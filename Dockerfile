# ============================================================
# Stage 1: Dependencies
# ============================================================
FROM node:20-slim AS deps
WORKDIR /app

# Install build tools for native modules (better-sqlite3)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (with native compilation)
RUN npm ci

# ============================================================
# Stage 2: Builder
# ============================================================
FROM node:20-slim AS builder
WORKDIR /app

# Install build tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build Next.js application in standalone mode
RUN npm run build

# ============================================================
# Stage 3: Runner (Production)
# ============================================================
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install runtime dependencies for SQLite
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy standalone build (use existing 'node' user with UID/GID 1000)
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Copy better-sqlite3 native module with all dependencies
COPY --from=builder --chown=node:node /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=builder --chown=node:node /app/node_modules/bindings ./node_modules/bindings
COPY --from=builder --chown=node:node /app/node_modules/file-uri-to-path ./node_modules/file-uri-to-path

# Copy database initialization scripts
COPY --from=builder --chown=node:node /app/scripts ./scripts

# Create data and uploads directories
RUN mkdir -p /app/data /app/public/uploads && \
    chown -R node:node /app/data /app/public/uploads

# Copy entrypoint script and make it executable for all users
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/docker-entrypoint.sh

# Note: USER directive removed - will be set via docker-compose user mapping

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
