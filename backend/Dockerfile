FROM node:20-alpine

# Install OpenSSL - required by Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Install ALL dependencies (including dev for build)
RUN npm install

# Copy source
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN ./node_modules/.bin/tsc -p tsconfig.json --listEmittedFiles

EXPOSE 3001

CMD ["node", "dist/main"]
