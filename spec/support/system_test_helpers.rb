# frozen_string_literal: true

# システムテスト用のヘルパーモジュール
# テスト失敗時にブラウザのコンソールログを出力する設定などを集約
module SystemTestHelpers
  # RSpecのフックをセットアップ

  # この SystemTestHelpers モジュールを使うテストでは、
  # JS付きシステムテストが終わった時に、
  # 失敗していたらデバッグ情報（アラートやコンソールログ）を自動で表示する
  def self.included(base)
    base.after(:each, type: :system, js: true) do |example|
      SystemTestHelpers.handle_failed_example(page) if example.exception
    end
  end

  # クラスメソッドとしてプライベートメソッドを定義
  class << self
    # テスト失敗時の処理をまとめたメソッド
    def handle_failed_example(page)
      close_alert_if_present(page)
      print_browser_logs(page)
    end

    # アラートが開いている場合に閉じる
    def close_alert_if_present(page)
      alert = page.driver.browser.switch_to.alert
      return unless alert

      Rails.logger.info "\n--- Alert Text on Failure: ---\n#{alert.text}\n---------------------------\n"
      alert.accept
    rescue Selenium::WebDriver::Error::NoSuchAlertError
      # アラートがなければ何もしない
    end

    # ブラウザのコンソールログを出力する
    def print_browser_logs(page)
      logs = page.driver.browser.logs.get(:browser)
      return if logs.blank?

      log_browser_messages(logs)
    end

    # ブラウザログを整形して出力する
    def log_browser_messages(logs)
      Rails.logger.info "\n--- Browser Console Logs: ---\n"
      logs.each { |log| log_message(log) }
      Rails.logger.info "---------------------------\n\n"
    end

    # ログレベルに応じてメッセージを出力する
    def log_message(log)
      message = "[#{log.level}] #{log.message}"
      logger = log.level == 'SEVERE' ? Rails.logger.method(:error) : Rails.logger.method(:info)
      logger.call(message)
    end
  end
end
