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
    @save_route = current_user.save_routes.find(params[:save_route_id])
  end
end
