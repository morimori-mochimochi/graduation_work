# frozen_string_literal: true

class NotificationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_save_route

  def create
    result = NotificationCreator.call(save_route: @save_route, user: current_user)
    @notification = result.notification
    redirect_to @save_route, result.message
  end

  private

  def set_save_route
    # to_paramで署名付きIDが渡されるため、find_signed!で復号してから検索する
    route = SaveRoute.find_signed!(params[:save_route_id], purpose: :route_view)
    @save_route = current_user.save_routes.find(route.id)
  rescue ActiveSupport::MessageVerifier::InvalidSignature, ActiveRecord::RecordNotFound
    # URLが無効、または他人のルートにアクセスしようとした場合
    redirect_to save_routes_path, alert: t('save_routes.set_save_route.alert')
  end
end
