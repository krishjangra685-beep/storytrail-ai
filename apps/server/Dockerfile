FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/
RUN npm ci --workspace=apps/server --ignore-scripts

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY apps/server ./apps/server
COPY package*.json ./
RUN npm run build --workspace=apps/server

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=deps /app/apps/server/node_modules ./node_modules
COPY apps/server/package.json ./
EXPOSE 8080
CMD ["node", "dist/index.js"]
