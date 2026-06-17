import Money from "./Money";

export default function BudgetProgressBar({
  name,
  spent,
  budget,
}: {
  name: string;
  spent: number;
  budget: number;
}) {
  const overBudget = budget > 0 && spent > budget;
  const percent = budget > 0 ? Math.min(spent / budget, 1) : 0;
  const barColor = overBudget ? "bg-red-500" : percent > 0.8 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{name}</span>
        <span className={overBudget ? "font-medium text-red-600" : "text-gray-600"}>
          <Money amount={spent} /> / <Money amount={budget} />
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${percent * 100}%` }} />
      </div>
    </div>
  );
}
