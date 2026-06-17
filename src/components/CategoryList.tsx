"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string; type: "INCOME" | "EXPENSE"; budget: number | null };

export default function CategoryList({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la suppression");
      return;
    }
    setError(null);
    router.refresh();
  }

  async function handleBudgetChange(id: string, value: string) {
    await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ budget: value ? Number(value) : null }),
    });
    router.refresh();
  }

  function renderGroup(title: string, items: Category[]) {
    if (items.length === 0) return null;
    return (
      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase text-gray-500">{title}</h2>
        <ul>
          {items.map((category) => (
            <li key={category.id} className="flex flex-wrap items-center justify-between gap-3 border-b py-2">
              <span>{category.name}</span>
              <div className="flex items-center gap-3">
                {category.type === "EXPENSE" && (
                  <label className="flex items-center gap-1 text-sm text-gray-600">
                    Budget
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={category.budget ?? ""}
                      onBlur={(e) => handleBudgetChange(category.id, e.target.value)}
                      className="w-24 rounded border px-1 py-0.5"
                      placeholder="—"
                    />
                    €
                  </label>
                )}
                <button
                  type="button"
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => handleDelete(category.id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {renderGroup("Revenus", categories.filter((c) => c.type === "INCOME"))}
      {renderGroup("Dépenses", categories.filter((c) => c.type === "EXPENSE"))}
    </div>
  );
}
