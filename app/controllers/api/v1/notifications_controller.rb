# frozen_string_literal: true

module Api
  module V1
    class NotificationsController < ApplicationController
      # GASからのリクエストなのでCSRF保護をスキップ
      skip_before_action :verify_authenticity_token
      before_action :authenticate_api

      # GET /api/v1/notifications/due
      # mapはRubyのメソッド。 配列の各要素に対して必要な情報のみで新しい配列を返す。
      def due
        notifications = Notification.due_for_sending.includes(:user, :save_route)
        render json: notifications.map { |n|
          {
            notification_id: n.id,
            line_user_id: n.user.uid, # LINE連携しているユーザーのUID
            message: "#{n.save_route.name}の出発時刻5分前です！"
          }
        }
      end

      # PATCH /api/v1/notifications/sent
      # 通知終了後にstatusを更新するためのエンドポイント

      def sent
        notification_ids = params.require(:notification_ids)
        # update_all はバリデーションをスキップするため、update を使用する
        notifications = Notification.where(id: notification_ids)
        notifications.update(status: 'sent')
        head :no_content
      end

      private

      def authenticate_api
        # Rails credentialsからAPIキーを読み込む
        api_key = Rails.application.credentials.gas_api_key

        # APIキーが設定されていない、またはリクエストのキーと一致しない場合はエラーを返す
        head :unauthorized unless api_key && params[:api_key] == api_key
      end
    end
  end
end
