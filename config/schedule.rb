# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

require File.expand_path(File.dirname(__FILE__) + "/environment")

# Example:
# ログファイルの出力を確認
set :output, "log/cron.log"

# ジョブの実行環境を設定
set :environment, :development

# cron実行時の環境変数を設定
env :PATH, ENV['PATH']

# Bundlerがgemを見つけられるように、BUNDLE_PATHとBUNDLE_GEMFILEを明示的に設定します。
# これにより、cronデーモンから実行される際にも、vendor/bundle内のgemが正しく読み込まれます。
env :BUNDLE_PATH, '/app/vendor/bundle'
env :BUNDLE_GEMFILE, '/app/Gemfile'

every 1.minutes do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
  rake "notifications:send_due"
end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever
