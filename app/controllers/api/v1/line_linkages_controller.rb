# frozen_string_literal: true

module Api
  module V1
    # アカウント連携のためのコントローラー
    class LineLinkagesController < BaseController
      # LINEからのWebhookはCSRFトークンを含まないため、検証をスキップ
      skip_before_action :verify_authenticity_token, only: [:callback]

      # ユーザーをアカウント連携ページへリダイレクトさせる
      def new
        # ログイン必須
        unless user_signed_in?
          return render json: { error: 'LINE通知を連携するには、ログインが必要です。' }, status: :unauthorized
        end

        # 1. LINE PlatformからlinkTokenを発行してもらう
        link_token_response = line_messaging_client.issue_link_token(user_id: current_user.id)
        link_token = link_token_response.link_token

        # 2. linkTokenを使ってアカウント連携用URLにリダイレクト
        redirect_to "https://access.line.me/dialog/bot/accountLink?linkToken=#{link_token}&nonce=#{current_user.id}", allow_other_host: true
      rescue Line::Bot::V2::ApiError => e
        Rails.logger.error "Failed to create link token: #{e.response_body}"
        render json: { error: 'LINE連携に失敗しました。もう一度お試しください。' }, status: :internal_server_error
      end

      # LINE PlatformからのWebhookを受け取るアクション
      def callback
        body = request.body.read
        signature = request.env['HTTP_X_LINE_SIGNATURE']
        events = line_webhook_parser.parse(body: body, signature: signature)

        events.each do |event|
          # アカウント連携イベントの場合
          if event.is_a?(Line::Bot::V2::Webhook::AccountLinkEvent)
            # 3. nonceからユーザーを特定 (nonceはリダイレクト時にcurrent_user.idを渡している)
            user = User.find_by(id: event.link.nonce)
            next unless user

            # 4. Messaging APIのユーザーIDを保存
            user.update!(line_messaging_user_id: event.source.user_id)

            # 連携完了をユーザーに通知
            request = Line::Bot::V2::MessagingApi::PushMessageRequest.new(
              to: user.line_messaging_user_id,
              messages: [
                Line::Bot::V2::MessagingApi::TextMessage.new(text: 'アカウント連携が完了しました！')
              ]
            )
            line_messaging_client.push_message(push_message_request: request)
          end
        end

        head :ok
      end
    end
  end
end