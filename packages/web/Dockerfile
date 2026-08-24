# Development stage
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY packages/web/package*.json ./packages/web/

RUN npm ci

COPY packages/web ./packages/web

WORKDIR /app/packages/web

EXPOSE 5173

CMD ["npm", "run", "dev"]

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/web/package*.json ./packages/web/

RUN npm ci

COPY packages/web ./packages/web

WORKDIR /app/packages/web

RUN npm run build

# Production stage
FROM nginx:alpine AS production

COPY --from=builder /app/packages/web/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY packages/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]