# ── VeriMedia AI — Dockerfile ──────────────────────────────────────────────────
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy application files
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Create uploads directory
RUN mkdir -p uploads

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S verimedia -u 1001 && \
    chown -R verimedia:nodejs /app

USER verimedia

EXPOSE 3000

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:3000/api/health || exit 1

CMD ["node", "backend/src/server.js"]
