import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaProd: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  })

// Separate Prisma client for production database (contract and hashrate tables)
export const prismaProd =
  globalForPrisma.prismaProd ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.PROD_DATABASE_URL,
      },
    },
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaProd = prismaProd
}
