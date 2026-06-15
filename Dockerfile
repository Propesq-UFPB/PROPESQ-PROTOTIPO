FROM oven/bun:1-alpine

WORKDIR /usr/src/app

# Cache dependencies
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose Vite / dev server port
EXPOSE 3100

# Development server (hot reload)
CMD ["bun", "run", "dev"]
