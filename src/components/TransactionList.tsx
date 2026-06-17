"use client";

import { useRouter } from "next/navigation";
import Money from "./Money";

type Transaction = {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: Date;
  description: string | null;
  category: { name: string };
};

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (transactions.length === 0) {
    return <p className="text-gray-500">Aucune transaction pour cette période.</p>;
  }

  return (
    <ul className="divide-y">
      {transactions.map((t) => (
        <li key={t.id} className="flex items-center justify-between gap-3 py-2">
          <div>
            <div className="font-medium">
              {t.category.name}
              {t.description ? ` — ${t.description}` : ""}
            </div>
            <div className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString("fr-FR")}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className={t.type === "INCOME" ? "text-emerald-600" : "text-red-600"}>
              {t.type === "INCOME" ? "+" : "−"}
              <Money amount={t.amount} />
            </span>
            <button
              type="button"
              className="text-sm text-gray-400 hover:text-red-600"
              onClick={() => handleDelete(t.id)}
              aria-label="Supprimer"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
