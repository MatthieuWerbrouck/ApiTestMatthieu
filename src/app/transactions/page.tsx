import { prisma } from "@/lib/prisma";
import { getMonthRange, getMonthString } from "@/lib/month";
import TransactionForm from "@/components/TransactionForm";
import TransactionFilters from "@/components/TransactionFilters";
import TransactionList from "@/components/TransactionList";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; categoryId?: string }>;
}) {
  const { month: monthParam, categoryId } = await searchParams;
  const month = getMonthString(monthParam);
  const { start, end } = getMonthRange(month);

  const [categories, transactions] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.transaction.findMany({
      where: {
        date: { gte: start, lt: end },
        ...(categoryId ? { categoryId } : {}),
      },
      include: { category: true },
      orderBy: { date: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <TransactionForm categories={categories} />
      <TransactionFilters month={month} categoryId={categoryId} categories={categories} />
      <TransactionList transactions={transactions} />
    </div>
  );
}
