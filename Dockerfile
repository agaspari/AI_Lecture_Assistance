# Stage 1: Install dependencies and generate Prisma client
FROM node:20-alpine AS deps
WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install all dependencies (including dev for build and Prisma)
RUN npm ci --production=false

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Stage 2: Build the Next.js app with standalone output
FROM node:20-alpine AS builder
WORKDIR /app

# Reuse installed deps and generated Prisma client
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source files
COPY . .

# Build for production (expects output: 'standalone' in next.config.js)
RUN npm run build

# Stage 3: Prepare the minimal production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy standalone build output and static assets
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose default Next.js port
EXPOSE 3000

# Launch the standalone server
CMD ["node", "server.js"]
