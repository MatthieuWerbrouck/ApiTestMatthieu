import { prisma } from "@/lib/prisma";
import { getMonthRange, getMonthString } from "@/lib/month";
import { getBudgetSummary } from "@/lib/budgets";
import { getRoommateLedger } from "@/lib/coloc";
import Money from "@/components/Money";
import BudgetProgressBar from "@/components/BudgetProgressBar";
import RoommateBalanceBanner from "@/components/RoommateBalanceBanner";

export default async function DashboardPage() {
  const month = getMonthString();
  const { start, end } = getMonthRange(month);

  const [incomeAgg, expenseAgg, budgetSummary, { balance }] = await Promise.all([
    prisma.transaction.aggregate({
      where: { type: "INCOME", date: { gte: start, lt: end } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { type: "EXPENSE", date: { gte: start, lt: end } },
      _sum: { amount: true },
    }),
    getBudgetSummary(month),
    getRoommateLedger(),
  ]);

  const income = incomeAgg._sum.amount ?? 0;
  const expense = expenseAgg._sum.amount ?? 0;
  const net = income - expense;

  const monthLabel = new Date(start).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-gray-500 capitalize">{monthLabel}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Revenus</div>
          <div className="text-lg font-semibold text-emerald-600">
            <Money amount={income} />
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Dépenses</div>
          <div className="text-lg font-semibold text-red-600">
            <Money amount={expense} />
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Solde</div>
          <div className={`text-lg font-semibold ${net >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            <Money amount={net} />
          </div>
        </div>
      </div>

      <RoommateBalanceBanner balance={balance} />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Budgets du mois</h2>
        {budgetSummary.length === 0 ? (
          <p className="text-gray-500">Aucune catégorie avec budget pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {budgetSummary.map((b) => (
              <BudgetProgressBar key={b.categoryId} name={b.name} spent={b.spent} budget={b.budget} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
