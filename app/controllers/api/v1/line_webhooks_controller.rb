# frozen_string_literal: true

module Api
  module V1
    class LineWebhooksController < ApplicationController
      # LINEからのWebhookはCSRFトークンを含まないため、検証をスキップ
      skip_before_action :verify_authenticity_token
      before_action :validate_line_signature

      def create
        events = client.parse_events_from(request.body.read)

        events.each do |event|
          case event
          when Line::Bot::Event::AccountLink
            handle_account_link(event)
          end
        end

        head :ok
      end

      private

      def client
        @client ||= Line::Bot::Client.new do |config|
          config.channel_secret = Rails.application.credentials.line[:messaging_api_secret]
          config.channel_token = Rails.application.credentials.line[:messaging_api_channel_access_token]
        end
      end

      # LINEからの正当なリクエストであることを署名で検証
      def validate_line_signature
        body = request.body.read
        signature = request.env['HTTP_X_LINE_SIGNATURE']
        return head :bad_request unless client.validate_signature(body, signature)

        # リクエストボディを再度読めるようにポインタを先頭に戻す
        request.body.rewind
      end

      # アカウント連携イベントの処理
      def handle_account_link(event)
        # イベントに 'success' と nonce が含まれているか確認
        return unless event.link['result'] == 'success' && event.link['nonce']

        # nonce を使ってWeb側のユーザーを検索
        user = User.find_by(line_nonce: event.link['nonce'])
        return unless user

        # Messaging API用のユーザーIDを保存し、nonceをクリアして紐付けを完了
        user.update!(
          line_messaging_user_id: event['source']['userId'],
          line_nonce: nil
        )
      end
    end
  end
end