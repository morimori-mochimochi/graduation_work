# frozen_string_literal: true

# システムテスト用のヘルパーモジュール
# テスト失敗時にブラウザのコンソールログを出力する設定などを集約
module SystemTestHelpers
  def self.included(base)
    base.after(:each, type: :system, js: true) do |example|
      if example.exception
        # アラートが開いているとログ取得やスクリーンショットでエラーになるため、
        # 先にアラートを閉じる試みを行う。
        begin
          alert = page.driver.browser.switch_to.alert
          if alert
            puts "\n--- Alert Text on Failure: ---\n#{alert.text}\n---------------------------\n"
            alert.accept # アラートを閉じる
          end
        rescue Selenium::WebDriver::Error::NoSuchAlertError
          # アラートがなければ何もしない
        end

        logs = page.driver.browser.logs.get(:browser)
        if logs.present?
          puts "\n--- Browser Console Logs: ---"
          logs.each do |log|
            # 深刻なエラーのみ赤色で表示
            puts "\e[31m[#{log.level}] #{log.message}\e[0m" if log.level == 'SEVERE'
            puts "[#{log.level}] #{log.message}" unless log.level == 'SEVERE'
          end
          puts "---------------------------\n"
        end
      end
    end
  end
end