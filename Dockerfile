FROM oven/bun:latest AS base

FROM base AS deps
WORKDIR /app

COPY bun.lockb package.json ./
RUN bun i --ignore-scripts

FROM base AS builder
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

COPY --from=node:18 /usr/local/bin/node /usr/local/bin/node
RUN bun prisma:generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
CMD HOSTNAME="0.0.0.0" bun server.js