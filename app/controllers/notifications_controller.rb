# frozen_string_literal: true

class NotificationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_save_route

  def create
    start_datetime = @save_route.start_time
    return redirect_to @save_route, alert: t('.start_time_blank') unless start_datetime

    notify_at = start_datetime - 5.minutes
    # find_or_initialize_by: ActiveRecord のメソッドで、モデルの検索と新規オブジェクト生成を自動で行う
    @notification = @save_route.notifications.find_or_initialize_by(user: current_user)
    @notification.notify_at = notify_at
    @notification.status = 'pending'

    if @notification.save
      redirect_to @save_route, notice: t('.notice', time: notify_at.strftime('%Y年%m月%d日 %H:%M'))
    else
      redirect_to @save_route, alert: t('.alert')
    end
  end

  private

  def set_save_route
    @save_route = current_user.save_routes.find(params[:save_route_id])
  end
end
