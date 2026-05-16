# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/ packages/
COPY apps/api/ apps/api/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm --filter @rapide/database db:generate

# Build the API
RUN pnpm --filter @rapide/api build

# Stage 2: Production
FROM node:20-alpine AS production

RUN apk add --no-cache wget dumb-init

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copy built output + node_modules
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/packages/ ./packages/
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./apps/api/package.json

USER nestjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/v1/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "apps/api/dist/main.js"]
