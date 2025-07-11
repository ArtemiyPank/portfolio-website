
# ─── 1) Builder on Ubuntu 24.04 (glibc 2.38) ──────────────────────────────
FROM ubuntu:24.04 AS builder
WORKDIR /app

# Install build tools + SQLite headers + Node 20
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      curl ca-certificates build-essential python3 libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/* && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

ENV npm_config_build_from_source=better-sqlite3

COPY package.json package-lock.json ./
RUN npm ci --build-from-source=better-sqlite3

COPY . .
RUN npm rebuild better-sqlite3 && \
    npm run db:init && \
    npm run build

# ─── 2) Production runner on the same Ubuntu 24.04 ────────────────────────
FROM ubuntu:24.04 AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install Node 20 runtime + SQLite
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      curl ca-certificates libsqlite3-0 && \
    rm -rf /var/lib/apt/lists/* && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copy necessary files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/data ./data

# Ensure directories exist with proper permissions
RUN mkdir -p data public/uploads && \
    chmod -R 777 data public/uploads

EXPOSE 3000

CMD ["node", "server.js"]