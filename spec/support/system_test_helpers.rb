# frozen_string_literal: true

# システムテスト用のヘルパーモジュール
# テスト失敗時にブラウザのコンソールログを出力する設定などを集約
module SystemTestHelpers
  # RSpecのフックをセットアップ

  #この SystemTestHelpers モジュールを使うテストでは、
  # JS付きシステムテストが終わった時に、
  # 失敗していたらデバッグ情報（アラートやコンソールログ）を自動で表示する
  def self.included(base) # rubocop:disable Metrics/AbcSize
    base.after(:each, type: :system, js: true) { |example| SystemTestHelpers.handle_failed_example(page) if example.exception }
  end

  # クラスメソッドとしてプライベートメソッドを定義
  class << self
    private

    # テスト失敗時の処理をまとめたメソッド
    def handle_failed_example(page) # rubocop:disable Metrics/MethodLength
      close_alert_if_present(page)
      print_browser_logs(page)
    end

    # アラートが開いている場合に閉じる
    def close_alert_if_present(page)
      alert = page.driver.browser.switch_to.alert
      return unless alert

      puts "\n--- Alert Text on Failure: ---\n#{alert.text}\n---------------------------\n"
      alert.accept
    rescue Selenium::WebDriver::Error::NoSuchAlertError
      # アラートがなければ何もしない
    end

    # ブラウザのコンソールログを出力する
    def print_browser_logs(page)
      logs = page.driver.browser.logs.get(:browser)
      return if logs.blank?

      puts "\n--- Browser Console Logs: ---"
      logs.each do |log|
        message = "[#{log.level}] #{log.message}"
        puts log.level == 'SEVERE' ? "\e[31m#{message}\e[0m" : message
      end
      puts "---------------------------\n"
    end
  end
end
