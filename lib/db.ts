import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaProd: PrismaClient | undefined
}

// Helper to safely create Prisma client with fallback for build time
function createPrismaClient(customUrl?: string): PrismaClient {
  // During build time, if no URL is provided, use a placeholder
  // This allows the build to complete even without a real database connection
  const url = customUrl || process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/dbname'
  
  return new PrismaClient({
    ...(customUrl ? {
      datasources: {
        db: {
          url: customUrl,
        },
      },
    } : {}),
    log: ['error', 'warn'],
  })
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

// Separate Prisma client for production database (contract and hashrate tables)
// Only create if PROD_DATABASE_URL is set, otherwise fall back to regular prisma
const prodDbUrl = process.env.PROD_DATABASE_URL

export const prismaProd: PrismaClient =
  // If PROD_DATABASE_URL is not set or empty, use regular prisma client
  (!prodDbUrl || prodDbUrl.trim() === '')
    ? prisma
    : // Otherwise, create a separate client for the production database
      (globalForPrisma.prismaProd ?? createPrismaClient(prodDbUrl))

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  if (prodDbUrl && prodDbUrl.trim() !== '') {
    globalForPrisma.prismaProd = prismaProd
  }
}
