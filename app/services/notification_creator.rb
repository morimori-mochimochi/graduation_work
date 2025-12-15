# frozen_string_literal: true

class NotificationCreator
  def initialize(save_route:, user:)
    @save_route = save_route
    @user = user
  end

  # 結果を返すのみの構造体
  Result = Struct.new(:success?, :notification, :message)

  def self.call(save_route:, user:)
    new(save_route: save_route, user: user).call
  end

  def call
    return handle_missing_datetime unless start_datetime_present?

    notification = @save_route.notifications.find_or_initialize_by(user: @user)
    assign_notification_attributes(notification)

    if notification.save
      handle_success(notification)
    else
      handle_failure(notification)
    end
  end

  private

  def self.calculate_notify_at(execution_date, start_time)
    start_datetime = Time.zone.local(execution_date.year, execution_date.month, execution_date.day, start_time.hour,
                                     start_time.min)
    start_datetime - 5.minutes # 出発の5分前に通知
  end
  private_class_method :calculate_notify_at

  def handle_missing_datetime
    Result.new(false, nil, { alert: I18n.t('notifications.create.start_time_blank') })
  end

  def assign_notification_attributes(notification)
    notify_at = self.class.send(:calculate_notify_at, @save_route.execution_date, @save_route.start_time)
    notification.assign_attributes(notify_at: notify_at, status: 'pending')
  end

  def handle_success(notification)
    message = {
      notice: I18n.t(
        'notifications.create.notice',
        time: notification.notify_at.strftime('%Y年%m月%d日 %H:%M')
      )
    }
    Rails.logger.info "設定日時サービス: #{notification.notify_at}"
    Result.new(true, notification, message)
  end

  def handle_failure(notification)
    Rails.logger.error "通知の保存に失敗しました: #{notification.errors.full_messages.join(', ')}"
    Result.new(false, notification, { alert: I18n.t('notifications.create.alert') })
  end

  def start_datetime_present?
    @save_route.execution_date.present? && @save_route.start_time.present?
  end
end
