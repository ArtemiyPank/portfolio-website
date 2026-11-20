#!/bin/sh
# Ежедневный бэкап сайтов: консистентная копия SQLite + архив загрузок.
# Ставится в /srv/bin, запускается cron-ом. Хранит последние 14 дней.
set -eu

BACKUP_ROOT=/srv/backups
KEEP_DAYS=14
STAMP=$(date +%F_%H%M)

for site in /srv/sites/*/; do
	name=$(basename "$site")
	dest="$BACKUP_ROOT/$name"
	mkdir -p "$dest"

	for db in "$site"data/*.db; do
		[ -f "$db" ] || continue
		sqlite3 "$db" ".backup '$dest/$(basename "$db" .db)_$STAMP.db'"
	done

	if [ -d "$site"uploads ]; then
		tar -czf "$dest/uploads_$STAMP.tar.gz" -C "$site" uploads
	fi

	[ -f "$site.env" ] && cp "$site.env" "$dest/env_$STAMP" && chmod 600 "$dest/env_$STAMP"

	find "$dest" -type f -mtime +$KEEP_DAYS -delete
done
