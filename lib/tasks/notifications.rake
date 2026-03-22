# frozen_string_literal: true

namespace :notifications do
  desc '期限が来た通知を送信する'
  task send_due: :environment do
    Rails.logger.info "===== [CRON] notifications:send_dueタスクを実行しました ====="

    # 送信すべき通知を取得
    notifications_to_send = Notification.due_for_sending.includes(:user, :save_route)

    notifications_to_send.each do |notification|
      Rails.logger.info "通知処理を開始します: Notification ID #{notification.id} (Type: #{notification.send_to})"

      begin
        if notification.line?
          # --- LINE通知処理 ---
          message = "出発時刻のお知らせ: #{notification.save_route.name}\n出発時刻の5分前をお知らせいたします😊\nお気を付けてお出かけください！"
          LineNotifier.send_message(notification.user.line_login_uid, message)
        else
          # --- メール通知処理 ---
          NotificationMailer.departure_notification(notification).deliver_now
        end

        notification.update!(status: 'sent')
        Rails.logger.info "通知を送信しました: Notification ID #{notification.id}"
      rescue StandardError => e
        notification.update!(status: 'failed')
        Rails.logger.error "通知の送信に失敗しました: Notification ID #{notification.id}, エラー: #{e.message}"
      end
    end
  end
end
