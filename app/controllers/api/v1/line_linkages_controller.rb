# frozen_string_literal: true

require 'net/http'
require 'uri'
require 'json'

module Api
  module V1
    # アカウント連携のためのコントローラー
    class LineLinkagesController < BaseController
      # LINEからのWebhookはCSRFトークンを含まないため、検証をスキップ
      skip_before_action :verify_authenticity_token

      # LinkUserApiクライアント（V2では不要なため削除）
      # V2ではline_messaging_client（Line::Bot::Clientのインスタンス）を直接使用します。
      # このメソッドは削除または空にして、直接 line_messaging_client を使用することを推奨します。

      # ユーザーをアカウント連携ページへリダイレクトさせる
      def new
        # ログイン必須
        unless user_signed_in?
          return render json: { error: 'LINE通知を連携するには、ログインが必要です。' }, status: :unauthorized
        end

        # 1. LINE PlatformからlinkTokenを発行してもらう (直接 HTTP API コール)
        user_id = current_user.id
            
        uri = URI.parse("https://api.line.me/v2/bot/user/#{user_id}/linkToken")
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true

        request = Net::HTTP::Post.new(uri.request_uri)

        # 認証ヘッダに Channel Access Token を設定
        channel_access_token = Rails.application.credentials.line[:messaging_api_channel_access_token]
        request['Authorization'] = "Bearer #{channel_access_token}"

        # APIリクエストを実行
        response = http.request(request)

        # 2. 応答の確認とlinkTokenの取得
        if response.code.to_i != 200
            # APIがエラーを返した場合、レスポンスボディをログに出力
            Rails.logger.error "LINE API Error (HTTP #{response.code}): #{response.body}"
            raise StandardError, "LINE API failed: #{response.code}"
        end

        # 成功した場合、JSONをパースしてlinkTokenを取得
        data = JSON.parse(response.body)
        link_token = data['linkToken'] # キー名は 'linkToken' のはず

        # 3. linkTokenを使ってアカウント連携用URLにリダイレクト
        redirect_to "https://access.line.me/dialog/bot/accountLink?linkToken=#{link_token}&nonce=#{current_user.id}", allow_other_host: true 

      rescue StandardError => e
        # 捕捉されたエラーのクラス名とメッセージをログに出力
        Rails.logger.error "LINE Linkage Failed (Final Catch): Class=#{e.class}, Message=#{e.message}"
        render json: { error: 'LINE連携に失敗しました。もう一度お試しください。' }, status: :internal_server_error
      end
    end
  end
end