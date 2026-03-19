# frozen_string_literal: true

require 'net/http'
require 'uri'
require 'json'

namespace :notifications do
  desc '期限が来た通知を送信する'
  task send_due: :environment do
    Rails.logger.info "===== [CRON] notifications:send_dueタスクを実行しました ====="

    # 送信すべき通知を取得
    notifications_to_send = Notification.due_for_sending.includes(:user, :save_route)

    notifications_to_send.each do |notification|
      Rails.logger.info "通知処理を開始します: Notification ID #{notification.id} (Type: #{notification.send_to})"

      if notification.line?
        # --- LINE通知処理 ---
        line_uid = notification.user.line_login_uid
        raise "LINE UIDが見つかりません" if line_uid.blank?

        uri = URI.parse("https://api.line.me/v2/bot/message/push")
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true

        request = Net::HTTP::Post.new(uri.path)
        request["Content-Type"] = "application/json"
        request["Authorization"] = "Bearer #{Rails.application.credentials.line[:messaging_api_channel_access_token]}"

        message_text = "出発時刻のお知らせ: #{notification.save_route.name}\n出発時刻の5分前になりました。"
        data = {
          to: line_uid,
          messages: [{ type: "text", text: message_text }]
        }
        request.body = data.to_json

        response = http.request(request)
        raise "LINE API Error: #{response.code} #{response.body}" unless response.code == '200'
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
