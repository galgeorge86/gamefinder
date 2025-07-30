import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { withAccelerate } from '@prisma/extension-accelerate'

const connectionString = process.env.DATABASE_URL

const adapter = new PrismaNeon({connectionString})

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
}

const prisma = globalForPrisma.prisma || new PrismaClient({adapter}).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma