# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# bcrypt 네이티브 모듈 컴파일에 필요한 빌드 도구
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src ./src

RUN npm run build && npm prune --omit=dev

# ── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# 컴파일된 node_modules를 builder에서 복사 (빌드 도구 불필요)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

EXPOSE 3003

CMD ["node", "dist/server.js"]
