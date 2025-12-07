# frozen_string_literal: true

module Api
  module V1
    # アカウント連携のためのコントローラー
    class LineLinkagesController < BaseController
      # LINEからのWebhookはCSRFトークンを含まないため、検証をスキップ
      skip_before_action :verify_authenticity_token, only: [:callback]

      # LinkUserApiクライアントを返すヘルパーメソッド
      # Rails環境では、このクライアントは設定に応じて初期化されていることを想定
      # ※ line_messaging_clientの定義は、このコード外（ApplicationControllerなど）にあると想定
      def link_user_api_client
        # V3の作法に基づき、LinkUserApiClientを明示的に使用
        # 既存のline_messaging_clientがV3::MessagingApi::Clientを返す場合、そこからLinkUserApiを取得
        # line_messaging_client.api_client.link_user_api のような形になることが多い
        # ここでは、Messaging API ClientのインスタンスからLinkUserApiを生成できると仮定
        # もし、clientの取得方法が異なる場合は、このメソッドを適切に調整してください。
        @link_user_api_client ||= Line::Bot::V3::ApiClient::LinkUserApi.new(line_messaging_client.api_client)
      end

      # ユーザーをアカウント連携ページへリダイレクトさせる
      def new
        # ログイン必須
        unless user_signed_in?
          return render json: { error: 'LINE通知を連携するには、ログインが必要です。' }, status: :unauthorized
        end

        # 1. LINE PlatformからlinkTokenを発行してもらう (V3のメソッド名に合わせて修正)
        # V3ではissue_link_tokenの引数にUser IDは不要で、レスポンスはDTOオブジェクト
        response = link_user_api_client.issue_link_token

        # レスポンスオブジェクトからlinkTokenを取得
        link_token = response.link_token

        # 2. linkTokenを使ってアカウント連携用URLにリダイレクト
        # nonceはURLクエリパラメータとして渡すため、URLエンコードを考慮しつつ、現在のuser IDを使用
        redirect_to "https://access.line.me/dialog/bot/accountLink?linkToken=#{link_token}&nonce=#{current_user.id}", allow_other_host: true

      # 致命的なエラー箇所の修正: エラークラスを Line::Bot::V3::Api::HttpError に変更
      rescue Line::Bot::V3::Api::HttpError => e
        # エラーロギングをV3オブジェクト対応に修正
        Rails.logger.error "Failed to create link token: #{e.class} - #{e.message} - #{e.response_body if e.respond_to?(:response_body)}"
        render json: { error: 'LINE連携に失敗しました。もう一度お試しください。' }, status: :internal_server_error
      end

      # LINE PlatformからのWebhookを受け取るアクション
      def callback
        body = request.body.read
        signature = request.env['HTTP_X_LINE_SIGNATURE']

        # V3ではparse_events_fromメソッドは非推奨/削除されているため、parse_eventsメソッドを使用
        # V3のMessagingApi::ClientがWebhookイベントのパースを担当する
        events = line_messaging_client.parse_events(body, signature)

        events.each do |event|
          # AccountLinkイベントは共通で Line::Bot::Event::AccountLink クラスとして扱われる
          if event.is_a?(Line::Bot::Event::AccountLink)
            # 3. nonceからユーザーを特定
            # V3のEvent::AccountLinkでは、link['nonce']ではなく、link_token_result.nonce で取得できる
            nonce = event.link_token_result.nonce
            user = User.find_by(id: nonce)
            next unless user

            # 4. Messaging APIのユーザーIDを保存
            # V3でもevent['source']['userId']のアクセスは有効だが、event.source.user_idが推奨
            user_id = event.source.user_id
            user.update!(line_messaging_user_id: user_id)

            # 連携完了をユーザーに通知
            message = { type: 'text', text: 'アカウント連携が完了しました！' }
            # V3ではpush_messageも非推奨となり、新しいpushメソッドを使用
            # V3では引数も MessagingApi::Client.new.push(user_id, [message]) の形式に変わっている
            line_messaging_client.push(user_id, [message])
          end
        end

        head :ok
      end
    end
  end
end