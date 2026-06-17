import { prisma } from "@/lib/prisma";
import { getMonthRange } from "@/lib/month";

export async function getBudgetSummary(month?: string | null) {
  const { start, end } = getMonthRange(month);

  const budgetedCategories = await prisma.category.findMany({
    where: { type: "EXPENSE", budget: { not: null } },
    orderBy: { name: "asc" },
  });

  const spentByCategory = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      type: "EXPENSE",
      date: { gte: start, lt: end },
      categoryId: { in: budgetedCategories.map((c) => c.id) },
    },
    _sum: { amount: true },
  });

  const spentMap = new Map(spentByCategory.map((row) => [row.categoryId, row._sum.amount ?? 0]));

  return budgetedCategories.map((category) => {
    const budget = category.budget ?? 0;
    const spent = spentMap.get(category.id) ?? 0;
    return {
      categoryId: category.id,
      name: category.name,
      budget,
      spent,
      remaining: budget - spent,
      percentUsed: budget > 0 ? spent / budget : 0,
    };
  });
}
