# frozen_string_literal: true

class NotificationCreator
  # 結果を返すのみの構造体
  Result = Struct.new(:success?, :notification, :message)

  def self.call(save_route:, user:)
    new(save_route: save_route, user: user).call
  end

  def initialize(save_route:, user:)
    @save_route = save_route
    @user = user
  end

  def call
    execution_date = @save_route.execution_date
    start_time = @save_route.start_time

    # 実行日と出発時刻の両方が設定されているか確認
    return Result.new(false, nil, { alert: I18n.t('notifications.create.start_time_blank') }) unless execution_date && start_time

    # 日付と時刻を結合して、完全な出発日時を作成
    start_datetime = Time.zone.local(execution_date.year, execution_date.month, execution_date.day, start_time.hour, start_time.min)
    notify_at = start_datetime - 5.minutes # 出発の5分前に通知
    notification = @save_route.notifications.find_or_initialize_by(user: @user)
    notification.assign_attributes(notify_at: notify_at, status: 'pending')

    if notification.save
      message = { notice: I18n.t('notifications.create.notice', time: notify_at.strftime('%Y年%m月%d日 %H:%M')) }
      puts "設定日時コントローラー: #{notify_at}"
      Result.new(true, notification, message)
    else
      Result.new(false, notification, { alert: I18n.t('notifications.create.alert') })
    end
  end
end
