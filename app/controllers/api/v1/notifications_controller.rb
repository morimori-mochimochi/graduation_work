# frozen_string_literal: true

module api
  module V1
    class NotificationsController < ApplicationController
      # GASからのリクエストなのでCSFR保護をスキップ
      skip_before_action :verify_authenticity_token
      before_action :authenticate_api

      # GET/api/v1/notifications/due
      def due
        notifications = Notification.due_for_sending.includes(:user, :save_routes)
        render json: notifications.map { |n|
          {
            notification_id: n.id,
            line_user_id: n.uset.uid, #LINE連携しているユーザーのUID
            message: "#{n.save_route.name}の出発時刻5分前です！"
          }
        }
      end

      # PATCH/api/v1/notifications/sent
      def sent
        notification_ids = params.require(:notification_ids)
        Notification.where(id: notification_ids).update_all(status: 'sent', updated_at: Time.current)
        head :no_content
      end

      private

      def authenticate_api
      # 環境変数などでAPIキーを設定し、リクエストヘッダーで検証するのが望ましい
      # 例: request.headers['X-API-KEY'] == ENV['GAS_API_KEY']
        head :unauthorized unless params[:api_key] == 'YOUR_SECRET_API_KEY' # TODO: APIキーを環境変数に設定する
      end
    end 
  end
end 