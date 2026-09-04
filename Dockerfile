FROM node:22-bookworm-slim
ENV TZ=Asia/Kolkata
ENV LANG=en_IN.UTF-8
ENV LC_ALL=en_IN.UTF-8
ENV NODE_ENV=production
WORKDIR /app
COPY package.json bun.lock ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "server.js"]
