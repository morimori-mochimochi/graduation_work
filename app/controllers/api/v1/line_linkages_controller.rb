# frozen_string_literal: true

module Api
  module V1
    # アカウント連携のためのコントローラー
    class LineLinkagesController < BaseController
      # LINEからのWebhookはCSRFトークンを含まないため、検証をスキップ
      skip_before_action :verify_authenticity_token, only: [:callback]

      # LinkUserApiクライアント（V2では不要なため削除）
      # V2ではline_messaging_client（Line::Bot::Clientのインスタンス）を直接使用します。
      # このメソッドは削除または空にして、直接 line_messaging_client を使用することを推奨します。

      # ユーザーをアカウント連携ページへリダイレクトさせる
      def new
        # ログイン必須
        unless user_signed_in?
          return render json: { error: 'LINE通知を連携するには、ログインが必要です。' }, status: :unauthorized
        end

        # 1. LINE PlatformからlinkTokenを発行してもらう (V2対応)
        # V2 GemにはlinkToken発行のヘルパーメソッドがないため、Messaging APIの /linkToken エンドポイントを直接叩く
        # clientはLine::Bot::Clientのインスタンスと仮定します。
        
        # Line::Bot::Client#post を使ってAPIエンドポイントを叩く
        response = line_messaging_client.post(
          '/v2/bot/user/linkToken',
          nil, # Bodyは不要
          'Content-Type' => 'application/json' # ヘッダーは必須
        )

        # 応答の検証
        unless response.code.to_i == 200
          raise StandardError, "LINE API failed to issue link token. Response: #{response.body}"
        end
        
        # 応答オブジェクトからlinkTokenを取得
        response_body = JSON.parse(response.body)
        link_token = response_body['linkToken']

        # 2. linkTokenを使ってアカウント連携用URLにリダイレクト
        # nonceとして現在のuser IDを使用
        redirect_to "https://access.line.me/dialog/bot/accountLink?linkToken=#{link_token}&nonce=#{current_user.id}", allow_other_host: true

      # エラーハンドリング (V2対応)
      rescue StandardError => e
        # LINE APIのエラーもここでキャッチされる
        Rails.logger.error "Failed to create link token (V2): #{e.class} - #{e.message}"
        render json: { error: 'LINE連携に失敗しました。もう一度お試しください。' }, status: :internal_server_error
      end

      # LINE PlatformからのWebhookを受け取るアクション
      def callback
        body = request.body.read
        signature = request.env['HTTP_X_LINE_SIGNATURE']

        # V2では Line::Bot::Client#parse_events_from を使用
        # `line_messaging_client` が Line::Bot::Client のインスタンスである必要があります。
        events = line_messaging_client.parse_events_from(body, signature)

        events.each do |event|
          # AccountLinkイベントのTypeは 'accountLink'
          if event['type'] == 'accountLink'
            # 3. nonceからユーザーを特定
            # V2のEventオブジェクトの構造: event['link'] または event['link']['nonce']
            # event.link.nonce のようにHashieでアクセスできることもありますが、ここでは安全のためHashでアクセスします。
            nonce = event['link']['nonce']
            user = User.find_by(id: nonce)
            next unless user

            # 4. Messaging APIのユーザーIDを保存
            # V2では event['source']['userId'] でアクセス
            user_id = event['source']['userId']
            user.update!(line_messaging_user_id: user_id)

            # 連携完了をユーザーに通知
            message = { type: 'text', text: 'アカウント連携が完了しました！' }
            
            # V2では Line::Bot::Client#push_message を使用
            # push_message(to, messages) の形式
            line_messaging_client.push_message(user_id, message)
          end
        end

        head :ok
      rescue StandardError => e
        Rails.logger.error "LINE webhook callback failed: #{e.class} - #{e.message}"
        head :bad_request
      end
    end
  end
end