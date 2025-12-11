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

        # 2. line-bot-api gem を使ってlinkTokenを発行
        # link_token: ユーザーをLINEアプリのアカウント連携画面へ正しく誘導するための通行手形
        # このAPIを呼び出すには、Messaging APIのチャネルアクセストークンが必要

        # issue_link_tokenはline-bot-apiの持つメソッド
        # このメソッドはLINEプラットフォームのlinkToken発行APIに対して
        # current_user.line_login_uidを引数として渡して
        # このための連携トークンを発行して、と伝える
        # issue_link_tokenが成功すると、Line::Bot::V2::MessagingApi::IssueLinkTokenResponseオブジェクトが返される
        # このオブジェクトは直接link_token属性を持つ
        response = client.issue_link_token(user_id: current_user.line_login_uid) # 修正済み
        link_token = response.link_token # link_token属性を直接取得

        unless link_token.present?
          Rails.logger.error "Failed to get link token from response for user #{current_user.id}: #{response.inspect}"
          raise StandardError, "linkTokenの取得に失敗しました。"
        end

        # line-bot-api gem　を使ってlinkTokenを発行
        # これにはLINE Login Id が必要
        # LINE Login ID はDBに保存済みの想定
        # issue_link_tokenAPIを呼び出した時、link_tokenが生成される
        # このlink_tokenを後のresponseに含まれるlink_tokenと比較することで安全性を検証
        # link_token: ユーザーをlineアプリのアカウント連携画面へ正しく誘導する通行手形
        # 3. アカウント連携用のURLを構築
        account_link_url = "https://access.line.me/dialog/bot/accountLink?linkToken=#{link_token}&nonce=#{nonce}"

        # ユーザーをlineアカウント連携画面へリダイレクト
        redirect_to account_link_url, allow_other_host: true

      rescue StandardError => e
        # 捕捉されたエラーのクラス名とメッセージをログに出力
        Rails.logger.error "LINE Account Linkage failed for user #{current_user.id}: #{e.message}"
        render json: { error: 'LINE連携に失敗しました。もう一度お試しください。' }, status: :internal_server_error
      end

      private

      
      def client
        @client ||= Line::Bot::V2::MessagingApi::ApiClient.new(
          channel_access_token: Rails.application.credentials.line[:messaging_api_channel_access_token]
        )
      end
    end
  end
end
