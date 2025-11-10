# frozen_string_literal: true

# Rails専用の設定を読み込む(ActiveRecord・Controller・Viewを使うための設定)
# This file is copied to spec/ when you run 'rails generate rspec:install'
require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
# Prevent database truncation if the environment is production
abort('The Rails environment is running in production mode!') if Rails.env.production?
# Uncomment the line below in case you have `--require rails_helper` in the `.rspec` file
# that will avoid rails generators crashing because migrations haven't been run yet
# return unless Rails.env.test?
require 'rspec/rails'

require 'capybara/rails'

# Dockerコンテナでテストを実行する場合（SELENIUM_URLが設定されている場合）
if ENV['SELENIUM_URL']
  # Capybaraがテスト用サーバーを起動する際の設定
  Capybara.server_host = '0.0.0.0' # すべてのIPアドレスからの接続を許可
  Capybara.server_port = 3001      # 任意のポート
  # 環境に応じて接続先ホストを切り替え
  # - Docker Compose 環境では `web`
  # - GitHub Actions では `host.docker.internal`
  app_host = if ENV['CI']
               'host.docker.internal'
             else
               'web'
             end

  Capybara.app_host = "http://#{app_host}:#{Capybara.server_port}"

  puts "[DEBUG] ENV['CI']: #{ENV['CI'].inspect}"
  puts "[DEBUG] Capybara.app_host: #{Capybara.app_host}"
end

# Requires supporting ruby files with custom matchers and macros, etc, in
# spec/support/ and its subdirectories. Files matching `spec/**/*_spec.rb` are
# run as spec files by default. This means that files in spec/support that end
# in _spec.rb will both be required and run as specs, causing the specs to be
# run twice. It is recommended that you do not name files matching this glob to
# end with _spec.rb. You can configure this pattern with the --pattern
# option on the command line or in ~/.rspec, .rspec or `.rspec-local`.
#
# The following line is provided for convenience purposes. It has the downside
# of increasing the boot-up time by auto-requiring all files in the support
# directory. Alternatively, in the individual `*_spec.rb` files, manually
# require only the support files necessary.
Rails.root.glob('spec/support/**/*.rb').sort_by(&:to_s).each { |f| require f }
# Checks for pending migrations and applies them before tests are run.
# If you are not using ActiveRecord, you can remove these lines.
begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_paths = [
    Rails.root.join('spec/fixtures')
  ]

  config.include FactoryBot::Syntax::Methods

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # You can uncomment this line to turn off ActiveRecord support entirely.
  # config.use_active_record = false

  # RSpec Rails uses metadata to mix in different behaviours to your tests,
  # for example enabling you to call `get` and `post` in request specs. e.g.:
  #
  #     RSpec.describe UsersController, type: :request do
  #       # ...
  #     end
  #
  # The different available types are documented in the features, such as in
  # https://rspec.info/features/7-1/rspec-rails
  #
  # You can also this infer these behaviours automatically by location, e.g.
  # /spec/models would pull in the same behaviour as `type: :model` but this
  # behaviour is considered legacy and will be removed in a future version.
  #
  # To enable this behaviour uncomment the line below.
  # config.infer_spec_type_from_file_location!

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!
  # arbitrary gems may also be filtered via:
  # config.filter_gems_from_backtrace("gem name")

  # テスト失敗時にブラウザのコンソールログを出力する設定
  config.after(:each, type: :system, js: true) do |example|
    if example.exception
      logs = page.driver.browser.logs.get(:browser)
      if logs.present?
        Rails.logger.info "\n--- Browser Console Logs: ---"
        logs.each do |log|
          # 深刻なエラーのみ赤色で表示
          if log.level == 'SEVERE'
            Rails.logger.info "\e[31m#{log.message}\e[0m"
          else
            Rails.logger.info log.message
          end
        end
        Rails.logger.info "---------------------------\n"
      end
    end
  end
end

RSpec.configure do |config|
  config.before(:suite) do
    puts "Capybara.app_host = #{Capybara.app_host.inspect}"
  end
end
