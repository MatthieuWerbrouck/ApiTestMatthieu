"use client";

import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

function shiftMonth(month: string, delta: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber - 1, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export default function TransactionFilters({
  month,
  categoryId,
  categories,
}: {
  month: string;
  categoryId?: string;
  categories: Category[];
}) {
  const router = useRouter();

  function updateParams(next: { month?: string; categoryId?: string }) {
    const params = new URLSearchParams();
    params.set("month", next.month ?? month);
    const nextCategoryId = next.categoryId !== undefined ? next.categoryId : categoryId;
    if (nextCategoryId) params.set("categoryId", nextCategoryId);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => updateParams({ month: shiftMonth(month, -1) })}
          className="rounded border px-2 py-1"
        >
          ←
        </button>
        <span className="font-medium capitalize">{formatMonthLabel(month)}</span>
        <button
          type="button"
          onClick={() => updateParams({ month: shiftMonth(month, 1) })}
          className="rounded border px-2 py-1"
        >
          →
        </button>
      </div>
      <select
        className="rounded border px-2 py-1"
        value={categoryId ?? ""}
        onChange={(e) => updateParams({ categoryId: e.target.value || undefined })}
      >
        <option value="">Toutes les catégories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
