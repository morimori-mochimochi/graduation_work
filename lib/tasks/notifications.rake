# frozen_string_literal: true

namespace :notifications do
  desc '期限が来た通知を送信する'
  task send_due: :environment do
    # 送信すべき通知を取得
    notifications_to_send = Notification.due_for_sending.includes(:user, :save_route)

    notifications_to_send.each do |notification|
      begin
        # メールを送信
        Rails.logger.info "通知を送信します: Notification ID #{notification.id}"
        NotificationMailer.departure_notification(notification).deliver_now
        # ステータスを 'sent' に更新
        notification.update!(status: 'sent')
        Rails.logger.info "通知を送信しました: Notification ID #{notification.id}"
      rescue StandardError => e
        # エラーが発生した場合はステータスを 'failed' に更新
        notification.update!(status: 'failed')
        Rails.logger.error "通知の送信に失敗しました: Notification ID #{notification.id}, エラー: #{e.message}"
      end
    end
  end
end
