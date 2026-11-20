# Развёртывание

Продакшн: **artemiypank.com** → VPS `64.177.67.105` (Ubuntu 24.04, 1 vCPU, 2 ГБ RAM).
DNS — у Beget (A-записи `@` и `www` → 64.177.67.105).

Локальная разработка: `docker compose up` → http://localhost:3001 (см. `docker-compose.yml`).

## Структура сервера

```
/srv/
├── proxy/                      # общий Caddy для всех сайтов (deploy/proxy в репо)
│   ├── compose.yml
│   ├── Caddyfile               # глобальные сниппеты + import sites/*.caddy
│   ├── sites/artemiypank.caddy # по файлу на сайт
│   └── data/ config/           # сертификаты и состояние Caddy
├── sites/
│   └── portfolio/              # (deploy/portfolio в репо)
│       ├── compose.yml
│       ├── .env                # секреты, chmod 600
│       ├── data/portfolio.db   # SQLite, владелец 1000:1000
│       └── uploads/            # загрузки из админки, владелец 1000:1000
├── backups/<site>/             # ежедневные бэкапы, 14 дней
└── bin/backup-sites.sh         # cron: /etc/cron.d/backup-sites, 03:30
```

Сайты не публикуют порты наружу: наружу смотрит только Caddy (80/443),
а он ходит к контейнерам по имени через Docker-сеть `web`.
UFW открыт только для 22, 80, 443.

## Деплой новой версии

```sh
./deploy/deploy.sh
```

Скрипт собирает образ **локально**, передаёт его на сервер по ssh
(`docker save | docker load`) и перезапускает контейнер. Данные (`data/`,
`uploads/`, `.env`) лежат на сервере в volume и при деплое не трогаются.

## Добавить ещё один сайт

1. `mkdir /srv/sites/<name>` — свой `compose.yml` с `networks: web (external)`, без `ports:`.
2. `/srv/proxy/sites/<name>.caddy`:
   ```
   example.com {
   	import common
   	reverse_proxy <container-name>:<port>
   }
   ```
3. `docker exec caddy caddy reload --config /etc/caddy/Caddyfile`
4. A-запись домена → 64.177.67.105. Сертификат Caddy получит сам.

Бэкап подхватит новый сайт автоматически, если его БД лежит в `data/*.db`, а файлы — в `uploads/`.

## Частые команды (на сервере)

```sh
docker ps                                   # статус контейнеров
docker logs -f portfolio                    # логи приложения
docker logs -f caddy                        # логи прокси/сертификатов
cd /srv/sites/portfolio && docker compose restart
/srv/bin/backup-sites.sh                    # бэкап вручную
```

## Восстановление из бэкапа

```sh
cd /srv/sites/portfolio && docker compose stop
cp /srv/backups/portfolio/portfolio_<дата>.db data/portfolio.db
tar -xzf /srv/backups/portfolio/uploads_<дата>.tar.gz -C .
chown -R 1000:1000 data uploads
docker compose start
```

Забрать бэкапы к себе: `rsync -a root@64.177.67.105:/srv/backups/ ~/portfolio-backups/`

## Грабли

- **SQLITE_CANTOPEN / permission denied** — `data/` и `uploads/` должны принадлежать `1000:1000`
  (контейнер работает от `user: 1000:1000`).
- **Пустой сайт после деплоя** — если `data/portfolio.db` нет, entrypoint создаёт новую БД с сидом.
  Проверьте, что БД лежит именно в `/srv/sites/portfolio/data/`.
- **Сертификат не выдаётся** — `docker logs caddy`; почти всегда A-запись ещё не указывает на сервер.
- `next build` на сервере не запускать: на 2 ГБ RAM это медленно и может положить сайт.
