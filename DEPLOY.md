# Руководство по развёртыванию Portfolio Website

Полная документация по настройке, развёртыванию и управлению проектом с нуля.

---

## Содержание

1. [Требования к системе](#требования-к-системе)
2. [Локальная разработка](#локальная-разработка)
3. [Развёртывание на VPS](#развёртывание-на-vps)
4. [Обновление приложения](#обновление-приложения)
5. [Управление и мониторинг](#управление-и-мониторинг)
6. [Решение проблем](#решение-проблем)
7. [Безопасность](#безопасность)

---

## Требования к системе

### Локальная машина (для разработки)
- **OS**: Linux / macOS / Windows (с WSL2)
- **Node.js**: 20.x или выше
- **Docker**: 24.x или выше
- **Docker Compose**: 2.x или выше
- **Git**: для версионирования

### VPS (для продакшена)
- **OS**: Ubuntu 20.04+ / Debian 11+ или аналог
- **RAM**: минимум 1GB (рекомендуется 2GB+)
- **Disk**: минимум 10GB свободного места
- **Docker**: 24.x или выше
- **Docker Compose**: 2.x или выше
- **Caddy** или **Nginx**: для reverse proxy
- **SSH**: доступ с ключом или паролем

---

## Локальная разработка

### 1. Клонирование проекта

```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd portfolio-website

# Или если уже есть проект локально
cd /home/artemiypank/Downloads/portfolio-website
```

### 2. Создание файла переменных окружения

```bash
# Скопируйте example файл
cp .env.production.example .env.local

# Отредактируйте файл
nano .env.local
```

Пример `.env.local`:
```env
ADMIN_PASSWORD="admin123"
NEXT_PUBLIC_APP_URL=http://localhost:3001
SESSION_SECRET="your-secret-key-min-32-chars-long"
DOMAIN=localhost
UID=1000
GID=1000
```

### 3. Запуск через Docker (рекомендуется)

```bash
# Запустите приложение
docker-compose up --build

# Или в фоновом режиме
docker-compose up --build -d

# Просмотр логов
docker-compose logs -f
```

Приложение будет доступно:
- **Frontend**: http://localhost:3001
- **Admin Panel**: http://localhost:3001/admin

### 4. Запуск без Docker (альтернатива)

```bash
# Установите зависимости
npm install

# Инициализируйте базу данных
npm run db:init

# Запустите dev сервер
npm run dev
```

Приложение будет доступно на http://localhost:3000

### 5. Структура проекта

```
portfolio-website/
├── app/                    # Next.js App Router
│   ├── admin/             # Админ-панель
│   ├── api/               # API endpoints
│   └── ...                # Публичные страницы
├── components/            # React компоненты
├── lib/                   # Утилиты и database
├── public/                # Статические файлы
│   └── uploads/           # Загруженные изображения
├── scripts/               # Скрипты для БД
├── data/                  # SQLite база данных
├── docker-compose.yml     # Dev конфигурация
├── docker-compose.prod.yml # Production конфигурация
├── Dockerfile             # Docker образ
├── .dockerignore          # Исключения для Docker
├── .env.local             # Локальные переменные (не коммитить!)
└── .env.production.example # Пример для продакшена
```

---

## Развёртывание на VPS

### Шаг 1: Подготовка VPS

#### 1.1. Подключитесь к VPS

```bash
ssh root@your-vps-ip
# или
ssh your-user@your-vps-ip
```

#### 1.2. Установите Docker (если не установлен)

```bash
# Обновите пакеты
sudo apt update && sudo apt upgrade -y

# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавьте пользователя в группу docker
sudo usermod -aG docker $USER

# Установите Docker Compose
sudo apt install docker-compose-plugin -y

# Перезайдите для применения изменений
exit
ssh root@your-vps-ip

# Проверьте установку
docker --version
docker compose version
```

#### 1.3. Создайте директорию проекта

```bash
# Создайте директорию
sudo mkdir -p /srv/nextjs-site/portfolio-website
cd /srv/nextjs-site/portfolio-website

# Установите права доступа
sudo chown -R $USER:$USER /srv/nextjs-site/portfolio-website
```

### Шаг 2: Копирование файлов на VPS

#### Вариант А: Через rsync (рекомендуется)

```bash
# На ЛОКАЛЬНОЙ машине
cd /home/artemiypank/Downloads/portfolio-website

rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude 'data' \
  --exclude 'public/uploads' \
  --exclude '.env.local' \
  --exclude '*.db' \
  ./ root@your-vps-ip:/srv/nextjs-site/portfolio-website/
```

Замените `root@your-vps-ip` на ваши данные (например, `root@123.45.67.89`).

#### Вариант Б: Через Git

```bash
# На VPS
cd /srv/nextjs-site/portfolio-website
git clone <your-repo-url> .
```

### Шаг 3: Настройка переменных окружения на VPS

```bash
# На VPS
cd /srv/nextjs-site/portfolio-website

# Сгенерируйте безопасный secret
GENERATED_SECRET=$(openssl rand -base64 32)

# Создайте .env файл
cat > .env << EOF
ADMIN_PASSWORD="change_this_to_secure_password"
NEXT_PUBLIC_APP_URL=https://artemiypank.com
SESSION_SECRET="$GENERATED_SECRET"
DOMAIN=artemiypank.com
UID=1000
GID=1000
EOF

# ВАЖНО: Отредактируйте файл и смените ADMIN_PASSWORD
nano .env
```

Обязательно замените:
- `ADMIN_PASSWORD` - на свой надёжный пароль
- `artemiypank.com` - на ваш домен
- `UID` и `GID` - на вашего пользователя (узнать: `id -u` и `id -g`)

### Шаг 4: Создание docker-compose.prod.yml

```bash
# На VPS
cd /srv/nextjs-site/portfolio-website

cat > docker-compose.prod.yml << 'EOF'
services:
  portfolio:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: portfolio-app
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      HOSTNAME: "0.0.0.0"
      ADMIN_PASSWORD: "${ADMIN_PASSWORD}"
      SESSION_SECRET: "${SESSION_SECRET}"
      NEXT_PUBLIC_APP_URL: "${NEXT_PUBLIC_APP_URL}"
      DOMAIN: "${DOMAIN}"
    volumes:
      - ./data:/app/data
      - ./public/uploads:/app/public/uploads
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "node -e \"require('http').get('http://localhost:3000/api/projects', (res) => process.exit(res.statusCode === 200 ? 0 : 1))\""]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - web

networks:
  web:
    external: true
EOF
```

### Шаг 5: Настройка Docker сети

```bash
# Проверьте существующие сети
docker network ls

# Создайте сеть для Caddy (если не существует)
docker network create web

# Если у вас уже запущен Caddy, подключите его к сети
docker ps | grep caddy  # узнайте имя контейнера
docker network connect web <caddy-container-name>
```

### Шаг 6: Настройка Caddy Reverse Proxy

#### 6.1. Если Caddy не установлен

```bash
# Создайте директорию для Caddy
sudo mkdir -p /srv/proxy
cd /srv/proxy

# Создайте docker-compose.yml для Caddy
cat > docker-compose.yml << 'EOF'
services:
  caddy:
    image: caddy:2-alpine
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - web

networks:
  web:
    external: true

volumes:
  caddy_data:
  caddy_config:
EOF

# Создайте Caddyfile
cat > Caddyfile << 'EOF'
artemiypank.com {
    reverse_proxy portfolio-app:3000

    encode gzip

    log {
        output file /var/log/caddy/access.log
    }
}
EOF

# Запустите Caddy
docker-compose up -d
```

#### 6.2. Если Caddy уже установлен

```bash
# Отредактируйте Caddyfile
nano /srv/proxy/Caddyfile
```

Добавьте блок для вашего домена:
```caddyfile
artemiypank.com {
    reverse_proxy portfolio-app:3000

    encode gzip

    log {
        output file /var/log/caddy/access.log
    }
}
```

Перезагрузите Caddy:
```bash
cd /srv/proxy
docker-compose exec caddy caddy reload --config /etc/caddy/Caddyfile

# Или перезапустите контейнер
docker restart caddy
```

### Шаг 7: Запуск приложения

```bash
# На VPS
cd /srv/nextjs-site/portfolio-website

# Создайте директории для данных
mkdir -p data public/uploads
chmod -R 755 data public/uploads

# Соберите и запустите приложение
docker-compose -f docker-compose.prod.yml up -d --build

# Следите за логами
docker logs -f portfolio-app
```

### Шаг 8: Проверка работы

```bash
# Проверьте статус контейнера
docker ps | grep portfolio

# Проверьте health status
docker inspect portfolio-app --format='{{.State.Health.Status}}'

# Проверьте локальную доступность
curl -I http://localhost:3000

# Проверьте через домен (замените на свой)
curl -I https://artemiypank.com

# Проверьте админ-панель
curl -I https://artemiypank.com/admin
```

Если всё работает, приложение доступно:
- **Frontend**: https://artemiypank.com
- **Admin Panel**: https://artemiypank.com/admin

---

## Обновление приложения

### Метод 1: Через rsync (быстрое обновление)

```bash
# На ЛОКАЛЬНОЙ машине
cd /home/artemiypank/Downloads/portfolio-website

rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude 'data' \
  --exclude 'public/uploads' \
  --exclude '.env.local' \
  --exclude '*.db' \
  ./ root@your-vps-ip:/srv/nextjs-site/portfolio-website/

# На VPS (после завершения rsync)
ssh root@your-vps-ip
cd /srv/nextjs-site/portfolio-website
docker-compose -f docker-compose.prod.yml up -d --build
```

### Метод 2: Через Git

```bash
# На VPS
cd /srv/nextjs-site/portfolio-website

# Получите последние изменения
git pull origin main  # или ваша ветка

# Пересоберите приложение
docker-compose -f docker-compose.prod.yml up -d --build
```

### Метод 3: Обновление без пересборки (если изменились только данные)

```bash
# На VPS
cd /srv/nextjs-site/portfolio-website
docker-compose -f docker-compose.prod.yml restart
```

---

## Управление и мониторинг

### Логи

```bash
# Следить за логами в реальном времени
docker logs -f portfolio-app

# Последние 100 строк
docker logs --tail 100 portfolio-app

# Логи с временными метками
docker logs -t portfolio-app

# Логи за определённое время
docker logs --since 1h portfolio-app
```

### Перезапуск

```bash
cd /srv/nextjs-site/portfolio-website

# Мягкий перезапуск
docker-compose -f docker-compose.prod.yml restart

# Остановка и запуск
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Пересборка с нуля
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate
```

### Мониторинг ресурсов

```bash
# Использование CPU/RAM контейнером
docker stats portfolio-app

# Использование диска
du -sh /srv/nextjs-site/portfolio-website/data
du -sh /srv/nextjs-site/portfolio-website/public/uploads

# Размер Docker образов
docker images | grep portfolio

# Общее использование диска на VPS
df -h
```

### Доступ к контейнеру

```bash
# Выполнить команду в контейнере
docker exec portfolio-app ls -la /app/data

# Интерактивный shell
docker exec -it portfolio-app sh

# Проверить переменные окружения
docker exec portfolio-app env
```

### Бэкап данных

#### Создание бэкапа

```bash
cd /srv/nextjs-site/portfolio-website

# Создать бэкап с датой в имени
tar czf ~/backup-portfolio-$(date +%Y%m%d-%H%M%S).tar.gz data/ public/uploads/

# Скачать бэкап на локальную машину (на ЛОКАЛЬНОЙ машине)
scp root@your-vps-ip:~/backup-portfolio-*.tar.gz ~/backups/
```

#### Восстановление из бэкапа

```bash
cd /srv/nextjs-site/portfolio-website

# Остановите приложение
docker-compose -f docker-compose.prod.yml down

# Восстановите данные
tar xzf ~/backup-portfolio-YYYYMMDD-HHMMSS.tar.gz

# Запустите приложение
docker-compose -f docker-compose.prod.yml up -d
```

#### Автоматический бэкап (cron)

```bash
# Создайте скрипт
cat > /usr/local/bin/backup-portfolio.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups"
PROJECT_DIR="/srv/nextjs-site/portfolio-website"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

mkdir -p $BACKUP_DIR
cd $PROJECT_DIR
tar czf $BACKUP_DIR/portfolio-$TIMESTAMP.tar.gz data/ public/uploads/

# Удалить бэкапы старше 7 дней
find $BACKUP_DIR -name "portfolio-*.tar.gz" -mtime +7 -delete

echo "Backup completed: portfolio-$TIMESTAMP.tar.gz"
EOF

# Сделайте скрипт исполняемым
chmod +x /usr/local/bin/backup-portfolio.sh

# Добавьте в cron (ежедневно в 3:00)
crontab -e
# Добавьте строку:
0 3 * * * /usr/local/bin/backup-portfolio.sh >> /var/log/portfolio-backup.log 2>&1
```

---

## Решение проблем

### 1. No space left on device (Нет места на диске)

Это критическая ошибка. Нужно срочно очистить диск.

```bash
# Проверьте использование диска
df -h

# Найдите что занимает место
du -sh /* 2>/dev/null | sort -hr | head -20

# БЫСТРОЕ РЕШЕНИЕ: Очистка Docker
docker system prune -a --volumes -f
# Это освободит 2-5GB!

# Очистка логов
sudo journalctl --vacuum-time=7d

# Очистка apt кеша (Ubuntu/Debian)
sudo apt clean
sudo apt autoremove -y

# Найти большие файлы
find /var/log -type f -size +100M 2>/dev/null
find /tmp -type f -size +100M 2>/dev/null

# Очистка старых Docker образов
docker images | grep portfolio
docker rmi $(docker images -f "dangling=true" -q) 2>/dev/null

# После очистки проверьте снова
df -h
```

### 2. Контейнер не запускается

```bash
# Посмотрите детальные логи
docker logs --tail 100 portfolio-app

# Проверьте конфигурацию
docker-compose -f docker-compose.prod.yml config

# Проверьте переменные окружения
cat .env

# Проверьте права доступа
ls -la data/
ls -la public/uploads/

# Пересоберите с нуля
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate
```

### 3. 502 Bad Gateway

Caddy не может подключиться к контейнеру.

```bash
# Проверьте что контейнер запущен
docker ps | grep portfolio

# Проверьте что контейнер в сети
docker network inspect web | grep portfolio

# Проверьте локальную доступность
curl http://localhost:3000

# Переподключите к сети
docker network disconnect web portfolio-app
docker network connect web portfolio-app

# Перезапустите Caddy
docker restart caddy

# Проверьте логи Caddy
docker logs caddy
```

### 4. Ошибка доступа к базе данных

```bash
# Проверьте существование базы данных
ls -la /srv/nextjs-site/portfolio-website/data/

# Создайте директории если нужно
mkdir -p /srv/nextjs-site/portfolio-website/data
mkdir -p /srv/nextjs-site/portfolio-website/public/uploads

# Установите права доступа
chmod -R 755 /srv/nextjs-site/portfolio-website/data
chmod -R 755 /srv/nextjs-site/portfolio-website/public/uploads

# Проверьте UID/GID в .env
id -u  # должен совпадать с UID в .env
id -g  # должен совпадать с GID в .env

# Перезапустите контейнер
docker-compose -f docker-compose.prod.yml restart
```

### 5. Permission denied при rsync

```bash
# На VPS: установите права на директорию
sudo chown -R $USER:$USER /srv/nextjs-site/portfolio-website

# На ЛОКАЛЬНОЙ машине: используйте sudo (если нужно)
sudo rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude 'data' \
  --exclude 'public/uploads' \
  ./ root@your-vps-ip:/srv/nextjs-site/portfolio-website/
```

### 6. Сеть web не существует

```bash
# Создайте сеть
docker network create web

# Перезапустите приложение
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### 7. Ошибка "Segmentation fault" при docker-compose

Обычно связано с отсутствием сети.

```bash
# Создайте сеть
docker network create web

# Попробуйте снова
docker-compose -f docker-compose.prod.yml up -d
```

### 8. База данных пустая после развёртывания

База инициализируется автоматически при первом запуске.

```bash
# Проверьте логи инициализации
docker logs portfolio-app | grep -i database

# Если база не создалась, инициализируйте вручную
docker exec portfolio-app node /app/scripts/database-init.js

# Перезапустите контейнер
docker-compose -f docker-compose.prod.yml restart
```

### 9. Изображения не загружаются

```bash
# Проверьте директорию uploads
ls -la /srv/nextjs-site/portfolio-website/public/uploads/

# Установите права
chmod -R 755 /srv/nextjs-site/portfolio-website/public/uploads

# Проверьте что volume смонтирован
docker inspect portfolio-app | grep -A 10 Mounts
```

### 10. Healthcheck failing

```bash
# Проверьте health status
docker inspect portfolio-app --format='{{.State.Health.Status}}'

# Посмотрите причину
docker inspect portfolio-app --format='{{json .State.Health}}' | jq

# Проверьте что API отвечает
curl http://localhost:3000/api/projects

# Если не отвечает, проверьте логи
docker logs portfolio-app
```

---

## Безопасность

### 1. Обязательные действия после развёртывания

```bash
# 1. Смените ADMIN_PASSWORD в .env
nano /srv/nextjs-site/portfolio-website/.env

# 2. Убедитесь что .env не доступен извне
chmod 600 /srv/nextjs-site/portfolio-website/.env

# 3. Настройте файрвол (если не настроен)
sudo ufw status
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable

# 4. Настройте автоматические обновления безопасности (Ubuntu)
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 2. Рекомендации по паролям

- `ADMIN_PASSWORD`: минимум 16 символов, используйте буквы, цифры, спецсимволы
- `SESSION_SECRET`: минимум 32 символа, генерируется автоматически

Генератор паролей:
```bash
# Сгенерировать случайный пароль
openssl rand -base64 24

# Или
pwgen 24 1
```

### 3. Ограничение доступа к админ-панели

В `Caddyfile` можно добавить IP whitelist:

```caddyfile
artemiypank.com {
    reverse_proxy portfolio-app:3000

    # Ограничить доступ к /admin по IP
    @admin {
        path /admin*
        not remote_ip 203.0.113.0/24  # ваша сеть
    }

    respond @admin "Access Denied" 403
}
```

### 4. SSL/TLS сертификаты

Caddy автоматически получает и обновляет Let's Encrypt сертификаты.

Проверка:
```bash
# Проверьте сертификат
curl -vI https://artemiypank.com 2>&1 | grep -i certificate

# Посмотрите статус в Caddy
docker exec caddy caddy list-certificates
```

### 5. Регулярные обновления

```bash
# Обновление системных пакетов
sudo apt update && sudo apt upgrade -y

# Обновление Docker образов
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --build

# Обновление зависимостей проекта (на ЛОКАЛЬНОЙ машине)
npm update
# Затем deploy на VPS
```

### 6. Мониторинг логов

```bash
# Следите за подозрительной активностью
docker logs portfolio-app | grep -i error
docker logs portfolio-app | grep -i fail
docker logs caddy | grep -i 403
docker logs caddy | grep -i 404

# Настройте логирование в файл
mkdir -p /var/log/portfolio
docker logs portfolio-app > /var/log/portfolio/app.log 2>&1
```

---

## Полезные команды

### Быстрые команды для ежедневного использования

```bash
# Алиасы (добавьте в ~/.bashrc или ~/.zshrc)
alias portfolio-logs='docker logs -f portfolio-app'
alias portfolio-restart='cd /srv/nextjs-site/portfolio-website && docker-compose -f docker-compose.prod.yml restart'
alias portfolio-rebuild='cd /srv/nextjs-site/portfolio-website && docker-compose -f docker-compose.prod.yml up -d --build'
alias portfolio-backup='cd /srv/nextjs-site/portfolio-website && tar czf ~/backup-portfolio-$(date +%Y%m%d-%H%M%S).tar.gz data/ public/uploads/'
alias portfolio-status='docker ps | grep portfolio && docker stats portfolio-app --no-stream'
```

Примените:
```bash
source ~/.bashrc  # или ~/.zshrc
```

---

## Контакты и поддержка

При возникновении проблем:

1. Проверьте логи: `docker logs portfolio-app`
2. Проверьте документацию: этот файл DEPLOY.md
3. Проверьте GitHub Issues проекта
4. Создайте новый Issue с описанием проблемы

---

**Последнее обновление**: 2025-01-25
**Версия документа**: 2.0
