# frozen_string_literal: true

module Api
  module V1
    class LineLinkagesController < Api::V1::BaseController # BaseControllerを継承
      # CSRFトークンの検証をスキップ（LINEからのWebhookはCSRFトークンを持たないため）
      skip_before_action :verify_authenticity_token, only: [:callback]
      # ユーザー認証をスキップ（Webhook用）。LINEサーバーからのリクエストなのでRailsのセッションは存在しない。
      # `new` アクションは BaseController の `authenticate_user!` が適用される。
      skip_before_action :authenticate_user!, only: [:callback]
      # GET /api/v1/line_linkage/new
      # アカウント連携を開始し、連携用URLを返す
      def new
        # 1. Nonceを生成し、現在のユーザーに紐付けて保存
        nonce = SecureRandom.hex(16)
        # Userモデルに line_nonce:string カラムを追加してください
        current_user.update!(line_nonce: nonce)

        # 2. LINEプラットフォームからlinkTokenを取得
        client = line_bot_client
        response = client.create_link_token(current_user.id)

        unless response.code == '200'
          logger.error "Failed to create link token: #{response.body}"
          return render json: { error: 'Failed to create link token' }, status: :internal_server_error
        end

        link_token = JSON.parse(response.body)['linkToken']

        # 3. アカウント連携用URLを生成
        account_link_url = "https://access.line.me/dialog/bot/accountLink?linkToken=#{link_token}&nonce=#{nonce}"

        # 4. フロントエンドにURLを返す
        render json: { url: account_link_url }
      end

      # POST /api/v1/line_linkage/callback
      # LINEからのWebhookを受け取り、アカウントを紐付ける
      def callback
        body = request.body.read

        # LINEからのリクエストの署名を検証
        signature = request.env['HTTP_X_LINE_SIGNATURE']
        unless line_bot_client.validate_signature(body, signature)
          return head :bad_request
        end

        events = line_bot_client.parse_events_from(body)
        events.each do |event|
          next unless event.is_a?(LINE::Bot::Event::AccountLink)

          user = User.find_by(line_nonce: event['link']['nonce'])
          unless user
            logger.warn "Invalid nonce received: #{event['link']['nonce']}"
            next
          end

          # Userモデルに line_user_id:string カラムを追加してください
          user.update!(line_user_id: event['source']['userId'], line_nonce: nil)
          logger.info "Successfully linked LINE account for user: #{user.id}"
        end

        head :ok
      end

      private

      def line_bot_client
        # gem 'line-bot-api' を Gemfile に追加してください
        LINE::Bot::Client.new do |config|
          config.channel_secret = ENV['LINE_CHANNEL_SECRET']
          config.channel_token = ENV['LINE_CHANNEL_ACCESS_TOKEN']
        end
      end
    end
  end
end
