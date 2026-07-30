FROM node:20-alpine

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

# Generate Prisma client and build TypeScript
RUN npx prisma generate
RUN npx tsc -p tsconfig.json

# Remove dev dependencies
RUN npm prune --omit=dev

EXPOSE 3001

CMD ["node", "dist/main"]
