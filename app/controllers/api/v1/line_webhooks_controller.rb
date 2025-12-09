# このファイルでは、ユーザーが公式アカをフォローした時に
# LINEプラットフォームから送信されるWebhookを受け取り、
# MessagingAPI用のユーザーIDを保存するエンドポイントを定義。

# frozen_string_literal: true

module Api
  module V1
    class LineWebhooksController < ApplicationController
      # LINEからのWebhookはCSRFトークンを含まないため、検証をスキップ
      skip_before_action :verify_authenticity_token
      before_action :validate_line_signature

      def create
        # parse_events_from: line-bot-sdk-ruby が提供しているWebhook専用のメソッド
        # LINEから送られてきたWebhookの生データ（JSON文字列）をRubyのEventオブジェクトに変換
        # そのため複数のWebhookイベントが届いた場合もまとめて処理できる
        events = client.parse_events_from(request.body.read)

        events.each do |event|
          # eventがAccountLinkイベントだった時はアカウント連携処理に進む。
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
        # LINEの署名検証に生データが必要なのでパースせずそのまま読み取る
        body = request.body.read
        #  LINEから送信された署名を取得。
        signature = request.env['HTTP_X_LINE_SIGNATURE']
        # bodyとsignatureが一致するかチェック
        # 上記で取り出したbodyとsignature、SDKが裏で生成したsignatureと上記bodyを比較する
        # SDKはchannel_secret を使って自分でもう一度 signature を生成
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