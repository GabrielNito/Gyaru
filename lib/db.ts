import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createAdapter() {
  const pooledUrl =
    process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL

  const pool = new Pool({ connectionString: pooledUrl })
  return new PrismaPg(pool)
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: createAdapter(),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
