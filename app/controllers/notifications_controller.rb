# frozen_srting_literal: true

class NotificationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_save_route

  def create
    start_datetime = @save_route.start_time
    unless start_datetime
      return redirect_to @save_route, alert: '出発時刻が設定されていません'
    end

    notify_at = start_datetime - 5.minutes
    # find_or_initialize_by: ActiveRecord のメソッドで、モデルの検索と新規オブジェクト生成を自動で行う
    @notification = @save_route.notifications.find_or_initialize_by(user: current_user)
    @notification.notify_at = notify_at
    @notification.status = 'pending'

    if @notification.save
      redirect_to @save_route, notice: "#{notify_at.strftime('%Y年%m月%d日 %H:%M')}に通知を設定しました。"
    else
      redirect_to @save_route, alert: '通知の設定に失敗しました。'
    end
  end

  private

  def set_save_route
    @save_route = current_user.save_routes.find(params[:save_route_id])
  end
end