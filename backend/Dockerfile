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

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript - install typescript explicitly and compile
RUN npm install typescript@5.3.3 --save-dev
RUN ./node_modules/.bin/tsc -p tsconfig.json

# Verify dist was created
RUN ls -la dist/ && ls -la dist/main.js

EXPOSE 3001

CMD ["node", "dist/main"]
