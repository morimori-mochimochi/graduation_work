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
      # 通知終了後にstatusを更新するためのエンドポイント
      
      def sent
        notification_ids = params.require(:notification_ids)
        Notification.where(id: notification_ids).update_all(status: 'sent', updated_at: Time.current)
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