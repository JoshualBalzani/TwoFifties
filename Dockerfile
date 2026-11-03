FROM node:24-alpine
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY server/server.js server/core.js ./
COPY app/ ./public/
RUN mkdir -p /app/data && chown -R node:node /app/data
USER node
ENV NODE_ENV=production PORT=8080 BACKUP_DIR=/app/data
EXPOSE 8080
CMD ["node", "server.js"]
