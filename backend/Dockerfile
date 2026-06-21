# ==============================================================================
# STAGE 1: Build Environment
# ==============================================================================
FROM node:20-alpine AS builder

# Install system dependencies needed for Prisma / builds on Alpine
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy TypeScript config and application source code
COPY tsconfig.json ./
COPY src ./src/

# Generate Prisma Client to the custom output directory src/generated/prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build the TypeScript project (compiles to dist/)
RUN npm run build

# ==============================================================================
# STAGE 2: Production Runner
# ==============================================================================
FROM node:20-alpine AS runner

# Set environment to production
ENV NODE_ENV=production

# Install system dependencies needed for runtime (Prisma engine needs openssl)
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the compiled application from builder stage
COPY --from=builder /app/dist ./dist

# Copy the prisma schema and migrations in case we need to deploy migrations
COPY prisma ./prisma/

# Expose port (Backend defaults to 3000 unless process.env.PORT is configured)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
