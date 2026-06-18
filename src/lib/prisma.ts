import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  // Serverless: cap connections per instance so concurrent invocations don't
  // exhaust the Supabase pooler's client limit. Runtime traffic must go through
  // the transaction pooler (DATABASE_URL, port 6543), not the direct/session
  // connection (port 5432) which is reserved for migrations.
  max: 1,
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
