# frozen_string_literal: true

class NotificationMailer < ApplicationMailer
  # 5分前を通知するメール
  def departure_notification(notification)
    @notification = notification
    @save_route = @notification.save_route
    @user = @notification.user

    mail(
      to: @user.email,
      subject: "出発時刻のお知らせ: #{@save_route.name}"
    )
  end
end
