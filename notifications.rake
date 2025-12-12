# frozen_string_literal: true

namespace :notifications do
  desc '出発時刻5分前の通知をチェックしてメールを送信する'
  task send_due: :environment do
    puts '通知送信タスクを開始します...'

    # 送信対象の通知を取得 (pendingかつ通知時刻を過ぎたもの)
    notifications_to_send = Notification.due_for_sending.includes(:user, :save_route)

    if notifications_to_send.empty?
      puts '送信対象の通知はありませんでした。'
    else
      puts "#{notifications_to_send.count}件の通知を送信します。"
      notifications_to_send.each do |notification|
        NotificationMailer.departure_notification(notification).deliver_now
        notification.update(status: 'sent') # 送信済みステータスに更新
      end
    end
    puts '通知送信タスクを終了します。'
  end
end