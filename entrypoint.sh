#!/bin/bash
set -e

# Railsサーバーの古いプロセスIDファイルが残っている場合に削除
rm -f /app/tmp/pids/server.pid

# コンテナの役割に応じて処理を分岐
case "$CONTAINER_ROLE" in
  "web")
    # Webコンテナの場合、データベースを準備（作成/マイグレーション）
    echo "Preparing database..."
    bundle exec rails db:prepare
    ;;
  "cron")
    # cronコンテナの場合、crontabを更新
    echo "Updating crontab..."
    bundle exec whenever --update-crontab
    ;;
esac

# DockerfileのCMDで指定されたコマンド（rails serverなど）を実行
echo "Starting main process..."
exec "$@"