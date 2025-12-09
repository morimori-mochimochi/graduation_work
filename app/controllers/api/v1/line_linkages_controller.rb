# このファイルではlineログインで得たUser IDと
# 友達登録で得たMessaging API用のUser IDを紐付けるためのエンドポイントを定義。
# LINEアカウントを連携するボタンをクリックするとこのファイルは呼ばれる

# frozen_string_literal: true

module Api
  module V1
    # アカウント連携のためのコントローラー
    class LineLinkagesController < BaseController

      # ユーザーをアカウント連携ページへリダイレクトさせる
      # nonce: webアプリのユーザーとlineアカウントを安全に紐付ける合言葉
      # アカウント連携ボタンクリックでnonceはDBに保存される
      # link_tokenによってユーザーはlineの画面へ移行する
      def new
        # 1. nonceを生成し、DBに保存
        nonce = SecureRandom.urlsafe_base64
        current_user.update!(line_nonce: nonce)

        # line-bot-api gem　を使ってlinkTokenを発行
        # これにはLINE Login Id が必要
        # LINE Login ID はDBに保存済みの想定
        # issue_link_tokenAPIを呼び出した時、link_tokenが生成される
        # このlink_tokenを後のresponseに含まれるlink_tokenと比較することで安全性を検証
        # link_token: ユーザーをlineアプリのアカウント連携画面へ正しく誘導する通行手形
        base_url = 'https://access.line.me/oauth2/v2.1/authorize'
        client_id = ENV['LINE_CHANNEL_ID']

        session[:omniauth_state] = SecureRandom.hex(24) unless session[:omniauth_state]

        params = {
          response_type: 'code',
          client_id: client_id,
          redirect_uri: "#{request.scheme}://#{request.host_with_port}/users/auth/line/callback", # DeviseのコールバックURL
          state: session[:omniauth_state], # CSRF対策
          scope: 'profile openid email',
          nonce: nonce,
          bot_prompt: 'aggressive'
        }
        auth_url = "#{base_url}?#{URI.encode_www_form(params)}"

        # 3. ユーザーをLINEログイン認可画面へリダイレクト
        redirect_to auth_url, allow_other_host: true
      rescue StandardError => e
        # 捕捉されたエラーのクラス名とメッセージをログに出力
        Rails.logger.error "LINE Account Linkage failed for user #{current_user.id}: #{e.message}"
        render json: { error: 'LINE連携に失敗しました。もう一度お試しください。' }, status: :internal_server_error
      end
    end
  end
end