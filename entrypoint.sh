#!/bin/bash
set -e

# Railsサーバーの古いプロセスIDファイルが残っている場合に削除
rm -f /app/tmp/pids/server.pid

# cronコンテナの場合のみ、crontabを更新する
if [ "$CONTAINER_ROLE" = "cron" ]; then
  echo "Updating crontab..."
  bundle exec whenever --update-crontab
fi

# 【メイン】DockerfileのCMDで指定されたコマンド（rails server）を実行
echo "Starting main process..."
exec "$@"
