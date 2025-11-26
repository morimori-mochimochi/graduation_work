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
# seleniumコンテナから見たテストサーバーのホスト名
if ENV['SELENIUM_URL']
  # Capybaraがテスト用サーバーを起動する際の設定
  Capybara.server_host = '0.0.0.0' # すべてのIPアドレスからの接続を許可
  Capybara.server_port = 3001      # 任意のポート
  # 環境に応じて接続先ホストを切り替え
  # - Docker Compose 環境では `web`
  # - GitHub Actions では `host.docker.internal`
  app_host = if ENV['CI'] # GitHub Actions環境
               # GitHub Actionsのサービスネットワーク内でホストOSのIPアドレスを動的に取得する
               # `docker network inspect`でネットワーク情報をJSON形式で取得し、
               # `jq`コマンドでホストのIPアドレス（Gateway）を抽出する
               # この方法は `host.docker.internal` が使えない環境でも安定して動作します
               docker_network_id = ENV.fetch('DOCKER_NETWORK')
               # --- ここからデバッグコード ---
               puts "[DEBUG] DOCKER_NETWORK from ENV: #{docker_network_id.inspect}"
               if docker_network_id.present?
                 command = "docker network inspect #{docker_network_id} -f '{{(index .IPAM.Config 0).Gateway}}'"
                 puts "[DEBUG] Executing command: #{command}"
                 result = `#{command}`.strip
                 puts "[DEBUG] Command result: #{result.inspect}"
                 result
               else
                 puts "[DEBUG] DOCKER_NETWORK is not present."
                 nil
               end
               # --- ここまでデバッグコード ---
             elsif ENV['DOCKER_CONTAINER'] # ローカルのDocker環境
               # テスト実行中のコンテナ自身のホスト名（コンテナID）を取得する
               # これにより、seleniumコンテナが正しいテストサーバーに接続できる
               `hostname`.strip
             else
               'localhost' # Dockerを使わないローカル環境
             end

  Capybara.app_host = "http://#{app_host}:#{Capybara.server_port}"

  puts "[DEBUG] ENV['CI']: #{ENV['CI'].inspect}"
  puts "[DEBUG] Capybara.app_host: #{Capybara.app_host}"
end

# ローカル実行用のドライバ設定
Capybara.register_driver :selenium_chrome_headless do |app|
  options = Selenium::WebDriver::Options.chrome
  options.add_argument('--headless')
  options.add_argument('--no-sandbox')
  options.add_argument('--disable-dev-shm-usage')
  options.add_argument('--window-size=1400,1400')
  options.add_preference('goog:loggingPrefs', { browser: 'ALL' })
  Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
end

# spec_helper.rbから移動
# Capybara に対して、Docker 上の Selenium（ブラウザ実行コンテナ）を使うリモートドライバを登録する
# :remote_selenium_chrome が今回のドライバ名（好きな名前でOK）。do |app| ... end の中でどう動かすか定義
Capybara.register_driver :remote_chrome do |app|
  options = Selenium::WebDriver::Options.chrome
  # セキュリティサンドボックスを無効にする
  options.add_argument('no-sandbox')
  # ブラウザを「画面表示なし（ヘッドレス）」で起動します。CI や Docker では普通これにする
  options.add_argument('headless')
  #	GPU 関連の機能を無効化します。ヘッドレスでの互換性用オプション。
  options.add_argument('disable-gpu')
  # /dev/shm（共有メモリ）が小さい環境（Docker の一部設定など）でブラウザがクラッシュするのを防ぐためのオプション
  options.add_argument('disable-dev-shm-usage')
  options.add_argument('window-size=1400,1400')
  # 位置情報利用の許可を求めるアラートを自動的に承認する
  # CI環境で http://172.17.0.1 のようなIPアドレスでテストを実行すると、
  # Geolocation APIが "Only secure origins are allowed" エラーを出すため、
  # このオプションでテストサーバーのオリジンを安全なものとして明示的に許可します。
  # Capybara.app_host はこのファイル内で設定されています。
  options.add_argument("--unsafely-treat-insecure-origin-as-secure=#{Capybara.app_host}") if Capybara.app_host
  options.add_argument('--use-fake-ui-for-media-stream')
  # CI環境で位置情報APIを擬似的に使用できるようにする
  options.add_argument('--use-fake-device-for-media-stream')
  # ブラウザログを有効にするための設定
  options.add_preference('goog:loggingPrefs', { browser: 'ALL' })

  Capybara::Selenium::Driver.new(
    app,
    browser: :remote,
    url: ENV.fetch('SELENIUM_URL'),
    options: options
  )
end

# spec_helper.rbから移動
Capybara.javascript_driver = if ENV['SELENIUM_URL']
                               :remote_chrome
                             else
                               :selenium_chrome_headless
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

  # システムテスト用のヘルパーをインクルード
  config.include SystemTestHelpers, type: :system
end

RSpec.configure do |config|
  config.before(:suite) do
    puts "Capybara.app_host = #{Capybara.app_host.inspect}"
  end
end
