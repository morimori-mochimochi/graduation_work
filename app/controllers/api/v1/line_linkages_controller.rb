# frozen_string_literal: true

module Api
  module V1
    # アカウント連携のためのコントローラー
    class LineLinkagesController < ApplicationController
      # LINEからのWebhookはCSRFトークンを含まないため、検証をスキップ
      skip_before_action :verify_authenticity_token, only: [:callback]

      # ユーザーをアカウント連携ページへリダイレクトさせる
      def new
        # ログイン必須
        unless user_signed_in?
          return redirect_to new_user_session_path, alert: 'LINE通知を連携するには、ログインが必要です。'
        end

        # 1. LINE PlatformからlinkTokenを発行してもらう
        response = line_bot_client.create_link_token(current_user.id)
        unless response.code == '200'
          Rails.logger.error "Failed to create link token: #{response.body}"
          return redirect_to mypage_path, alert: 'LINE連携に失敗しました。もう一度お試しください。'
        end

        link_token = JSON.parse(response.body)['linkToken']

        # 2. linkTokenを使ってアカウント連携用URLにリダイレクト
        redirect_to "https://access.line.me/dialog/bot/accountLink?linkToken=#{link_token}&nonce=#{current_user.id}", allow_other_host: true
      end

      # LINE PlatformからのWebhookを受け取るアクション
      def callback
        body = request.body.read
        events = line_bot_client.parse_events_from(body)

        events.each do |event|
          # アカウント連携イベントの場合
          if event.is_a?(Line::Bot::Event::AccountLink)
            # 3. nonceからユーザーを特定
            user = User.find_by(id: event['source']['userId'])
            next unless user

            # 4. Messaging APIのユーザーIDを保存
            user.update!(line_messaging_user_id: event['source']['userId'])

            # 連携完了をユーザーに通知
            message = { type: 'text', text: 'アカウント連携が完了しました！' }
            line_bot_client.push_message(user.line_messaging_user_id, message)
          end
        end

        head :ok
      end
    end
  end
end
  