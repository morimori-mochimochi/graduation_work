# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
# ログファイルの出力を確認
set :output, "log/cron.log"

# bundle exec を使ってコマンドを実行するように設定
job_type :rake, "cd :path && :environment_variable=:environment bundle exec rake :task --silent :output"

# ジョブの実行環境を設定
set :environment, :development
#
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
