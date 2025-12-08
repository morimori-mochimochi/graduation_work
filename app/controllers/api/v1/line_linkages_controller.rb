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

        # ★ 修正箇所：レスポンスが nil でないことをチェック ★
        if response.nil? || !response.link_token
          # responseがnilの場合、API通信自体が失敗している可能性が高い
          Rails.logger.error "LINE API Call Failed: issue_link_token returned nil or missing link_token."
          # StandardErrorへ処理を移すか、直接エラーを返す
          raise StandardError, "LINE API failed to return a valid link token." 
        end
         
        # 応答はHashではなく、DTOオブジェクト（例: Line::Bot::V2::MessagingApi::LinkTokenResponse）を返す
        link_token = response.link_token

        # 2. linkToknを使ってアカウント連携用URLにリダイレクト
        redirect_to "https://access.line.me/dialog/bot/accountLink?linkToken=#{link_token}&nonce=#{current_user.id}", allow_other_host: true 

      # エラーハンドリング:
      # NameErrorを回避するため、StandardErrorで捕捉範囲を広げます。
      # これで、API呼び出し中に発生したエラーの実際のクラスが特定できるようになります。
      rescue StandardError => e # ここを StandardError に変更
        # 実際に発生したエラークラスをログに出力します
        Rails.logger.error "LINE API Call Failed (StandardError Catch): Class=#{e.class}, Message=#{e.message}"
  
        # 捕捉後、元の NameError が発生する行は実行されません
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