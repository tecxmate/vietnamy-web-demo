FROM node:20-slim

WORKDIR /app

# Install root dependencies (includes vite for build)
COPY package.json package-lock.json ./
RUN npm install

# Copy source and build frontend
COPY . .
RUN npx vite build

# Install server dependencies (better-sqlite3 needs native build)
WORKDIR /app/server
RUN npm install

WORKDIR /app
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server/server.js"]
