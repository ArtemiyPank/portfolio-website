# ─── 1) Builder on Ubuntu 24.04 (glibc 2.38) ──────────────────────────────
FROM ubuntu:24.04 AS builder
WORKDIR /app

# 1) Install build tools + SQLite headers + Node 20
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      curl ca-certificates build-essential python3 libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/* && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# 2) Force native addon to build under THIS glibc
ENV npm_config_build_from_source=better-sqlite3

# 3) Install dependencies (will compile better-sqlite3 for glibc 2.38)
COPY package.json package-lock.json ./
RUN npm ci --build-from-source=better-sqlite3

# 4) Copy code, init DB, build Next.js
COPY . .
RUN npm rebuild && \
    npm install && \
    npm run db:init && \
    npm run build

# ─── 2) Production runner on the same Ubuntu 24.04 ────────────────────────
FROM ubuntu:24.04 AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install Node 20 runtime + curl for health checks
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      curl ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copy build artifacts
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts

# Create data and uploads directories with full permissions
RUN mkdir -p data public/uploads && \
    chmod -R 777 data public/uploads

# Copy database to data directory
COPY --from=builder /app/portfolio.db ./

# Run as root for simplicity
EXPOSE 3000

CMD ["node", "server.js"]
