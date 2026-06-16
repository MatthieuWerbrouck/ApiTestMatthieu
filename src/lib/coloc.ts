import { prisma } from "@/lib/prisma";

export async function getRoommateLedger() {
  const [entries, aggregate] = await Promise.all([
    prisma.roommateEntry.findMany({ orderBy: { date: "desc" } }),
    prisma.roommateEntry.aggregate({ _sum: { amount: true } }),
  ]);

  return { entries, balance: aggregate._sum.amount ?? 0 };
}
