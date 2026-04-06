FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .


ARG VITE_ENV=local
ENV VITE_ENV=$VITE_ENV
ENV VITE_API_URL_LOCAL=$VITE_API_URL_LOCAL
ENV VITE_API_URL_DEV=$VITE_API_URL_DEV
ENV VITE_API_URL_UAT=$VITE_API_URL_UAT

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]