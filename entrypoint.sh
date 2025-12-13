#!/bin/bash
set -e

# Railsサーバーの古いプロセスIDファイルが残っている場合に削除
rm -f /app/tmp/pids/server.pid

# 【準備1】wheneverでcronのスケジュールを更新
echo "Updating crontab..."
bundle exec whenever --update-crontab

# 【準備2】cronデーモンをバックグラウンドで起動
echo "Starting cron daemon..."
cron

# 【メイン】DockerfileのCMDで指定されたコマンド（rails server）を実行
echo "Starting main process..."
exec "$@"
