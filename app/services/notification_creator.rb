# frozen_string_literal: true

class NotificationCreator
  # 結果を返すのみの構造体
  Result = Struct.new(:success?, :notification, :message)

  def self.call(save_route:, user:)
    new(save_route: save_route, user: user).call
  end

  def self.calculate_notify_at(execution_date, start_time)
    start_datetime = Time.zone.local(execution_date.year, execution_date.month, execution_date.day, start_time.hour, start_time.min)
    start_datetime - 5.minutes # 出発の5分前に通知
  end

  def initialize(save_route:, user:)
    @save_route = save_route
    @user = user
  end

  def call
    # 実行日と出発時刻の両方が設定されているか確認
    return Result.new(false, nil, { alert: I18n.t('notifications.create.start_time_blank') }) unless start_datetime_present?

    notification = @save_route.notifications.find_or_initialize_by(user: @user)
    notification.assign_attributes(notify_at: self.class.calculate_notify_at(@save_route.execution_date, @save_route.start_time), status: 'pending')

    if notification.save
      message = { notice: I18n.t('notifications.create.notice', time: notification.notify_at.strftime('%Y年%m月%d日 %H:%M')) }
      puts "設定日時サービス: #{notification.notify_at}"
      Result.new(true, notification, message)
    else
      Rails.logger.error "通知の保存に失敗しました: #{notification.errors.full_messages.join(', ')}"
      Result.new(false, notification, { alert: I18n.t('notifications.create.alert') })
    end
  end

  private

  def start_datetime_present?
    @save_route.execution_date.present? && @save_route.start_time.present?
  end
end
