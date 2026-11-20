#!/bin/sh
# Деплой портфолио: сборка образа локально, перенос на сервер, перезапуск.
# Сервер не собирает образ сам — next build на маленьком VPS слишком тяжёлый.
#   ./deploy/deploy.sh            # по умолчанию root@64.177.67.105
#   SERVER=root@host ./deploy/deploy.sh
set -eu

SERVER=${SERVER:-root@64.177.67.105}
REMOTE_DIR=/srv/sites/portfolio
cd "$(dirname "$0")/.."

docker build -t portfolio:latest .
docker image save portfolio:latest | gzip | ssh "$SERVER" 'gunzip | docker load'
scp deploy/portfolio/compose.yml "$SERVER:$REMOTE_DIR/compose.yml"
ssh "$SERVER" "cd $REMOTE_DIR && docker compose up -d && docker image prune -f >/dev/null"
