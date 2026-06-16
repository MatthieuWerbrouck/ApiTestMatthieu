"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string; type: "INCOME" | "EXPENSE" };

export default function TransactionForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredCategories = categories.filter((c) => c.type === type);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!categoryId) {
      setError("Choisissez une catégorie");
      return;
    }
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), type, date, description, categoryId }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la création");
      return;
    }

    setAmount("");
    setDescription("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
      <div className="flex flex-col">
        <label className="text-sm font-medium">Type</label>
        <select
          className="rounded border px-2 py-1"
          value={type}
          onChange={(e) => {
            setType(e.target.value as "INCOME" | "EXPENSE");
            setCategoryId("");
          }}
        >
          <option value="EXPENSE">Dépense</option>
          <option value="INCOME">Revenu</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Catégorie</label>
        <select
          className="rounded border px-2 py-1"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="" disabled>
            Choisir…
          </option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Montant (€)</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          className="w-28 rounded border px-2 py-1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Date</label>
        <input
          type="date"
          className="rounded border px-2 py-1"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Description (optionnel)</label>
        <input
          className="rounded border px-2 py-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
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
