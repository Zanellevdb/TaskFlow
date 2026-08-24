# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY packages/api/package*.json ./packages/api/

# Install dependencies
RUN npm ci

# Copy source code
COPY packages/api ./packages/api

# Build TypeScript
WORKDIR /app/packages/api
RUN npm run build

# Development stage
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
COPY packages/api/prisma ./packages/api/prisma

RUN npm ci

COPY packages/api/src ./packages/api/src
COPY packages/api/tsconfig.json ./packages/api/

WORKDIR /app/packages/api

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
COPY packages/api/prisma ./packages/api/prisma

RUN npm ci --only=production

COPY --from=builder /app/packages/api/dist ./packages/api/dist

WORKDIR /app/packages/api

EXPOSE 3000

CMD ["npm", "run", "start"]