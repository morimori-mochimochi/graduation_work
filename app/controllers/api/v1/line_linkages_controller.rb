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
        # 1. LINE PlatformからlinkTokenを発行してもらう (V3/V2 SDKのメソッドを使用)
        # client.issue_link_token は、Line::Bot::V2::MessagingApi::ApiClient のメソッド。
        # V3 SDKのように User ID は引数に不要。
        response = line_messaging_client.issue_link_token
         
        # 応答はHashではなく、DTOオブジェクト（例: Line::Bot::V2::MessagingApi::LinkTokenResponse）を返す
        link_token = response.link_token

        # 2. linkToknを使ってアカウント連携用URLにリダイレクト
        redirect_to "https://access.line.me/dialog/bot/accountLink?linkToken=#{link_token}&nonce=#{current_user.id}", allow_other_host: true 

        # 応答の検証
        unless response.code.to_i == 200
          raise StandardError, "LINE API failed to issue link token. Response: #{response.body}"
        end

      # エラーハンドリング(v2/v3のSDKのエラークラスを使用)
      # 致命的なエラー箇所の修正: 捕捉範囲を Line::Bot::V2::ApiError から
      # Line::Bot の内部エラー（V2 SDKで発生する可能性のある全てのエラー）に広げます。
      rescue Line::Bot::V2::ApiError, Line::Bot::ApiError, StandardError => e
          # 捕捉クラスが見つからないため、とりあえず StandardError で捕捉し、
          # ログで実際の発生クラスを確認します。
          Rails.logger.error "LINE API Error (Catching StandardError): #{e.class} - #{e.message}"
          render json: { error: 'LINE連携に失敗しました。もう一度お試しください。' }, status: :internal_server_error
      end
      # LINE PlatformからのWebhookを受け取るアクション
      def callback
        body = request.body.read
        signature = request.env['HTTP_X_LINE_SIGNATURE']

        # V2 SDKでは parse_events メソッドを使用 (bodyとsignatureを引数に取る)
        # V2::MessagingApi::ApiClient のインスタンスは parse_events メソッドを持ちます。
        events = line_messaging_client.parse_events(body, signature)

        events.each do |event|
          # V2 SDKのイベントオブジェクトは Hash のようにアクセスできます。
          if event['type'] == 'accountLink'
            # 3. nonceからユーザーを特定
            nonce = event.link['nonce'] # Hashieオブジェクトとしてアクセス可能と仮定
            user = User.find_by(id: nonce)
            next unless user

            # 4. Messaging APIのユーザーIDを保存
            user_id = event.source['user_id']
            user.update!(line_messaging_user_id: user_id)

            # 連携完了をユーザーに通知
            message = { type: 'text', text: 'アカウント連携が完了しました！' }
        
            # V2 SDKでは push メソッドを使用 (to, messages の引数形式)
            line_messaging_client.push(user_id, [message])
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