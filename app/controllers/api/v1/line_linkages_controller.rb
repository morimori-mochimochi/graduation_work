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
        nonce = SecureRandom.urlsafe_base64
        current_user.update!(line_nonce: nonce)

        # line-bot-api gem　を使ってlinkTokenを発行
        # これにはLINE Login Id が必要
        # LINE Login ID はDBに保存済みの想定
        response = line_messaging_client.issue_link_token(user_id: current_user.line_login_uid)

        # 応答が成功したかチェック
        raise "Failed to issue link token: #{response.body}" unless response.is_a?(Net::HTTPOK)

        link_token = JSON.parse(response.body)['linkToken']

      rescue StandardError => e
        # 捕捉されたエラーのクラス名とメッセージをログに出力
        Rails.logger.error "LINE Account Linkage failed for user #{current_user.id}: #{e.message}"
        render json: { error: 'LINE連携に失敗しました。もう一度お試しください。' }, status: :internal_server_error
      end

      private

      # ApplicationControllerからline_messaging_clientを呼び出せるように。
      # このクライアントはMessagingAPIとの通信を担当する
      def line_messaging_client
        @line_messaging_client ||= Line::Bot::V2::MessagingApi::ApiClient.new(
          channel_secret: Rails.application.credentials.line[:messaging_api_secret],
          channel_access_token: Rails.application.credentials.line[:messaging_api_channel_access_token]
        )
      end
    end
  end
end