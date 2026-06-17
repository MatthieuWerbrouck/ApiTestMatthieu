"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, budget: budget ? Number(budget) : null }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la création");
      return;
    }

    setName("");
    setBudget("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
      <div className="flex flex-col">
        <label className="text-sm font-medium" htmlFor="category-name">
          Nom
        </label>
        <input
          id="category-name"
          className="rounded border px-2 py-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium" htmlFor="category-type">
          Type
        </label>
        <select
          id="category-type"
          className="rounded border px-2 py-1"
          value={type}
          onChange={(e) => setType(e.target.value as "INCOME" | "EXPENSE")}
        >
          <option value="EXPENSE">Dépense</option>
          <option value="INCOME">Revenu</option>
        </select>
      </div>
      {type === "EXPENSE" && (
        <div className="flex flex-col">
          <label className="text-sm font-medium" htmlFor="category-budget">
            Budget mensuel (optionnel)
          </label>
          <input
            id="category-budget"
            type="number"
            min="0"
            step="0.01"
            className="w-32 rounded border px-2 py-1"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-gray-900 px-4 py-1.5 text-white disabled:opacity-50"
      >
        Ajouter
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
