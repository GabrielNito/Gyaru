import { config } from "dotenv"
import { defineConfig } from "prisma/config"

config()

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/gyaru",
  },
  migrations: {
    path: "prisma/migrations",
  },
})
