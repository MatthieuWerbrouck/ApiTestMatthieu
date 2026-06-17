"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoommateEntryForm() {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(sign: 1 | -1) {
    if (!amount || Number(amount) <= 0) {
      setError("Indiquez un montant positif");
      return;
    }
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/coloc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, description, amount: Number(amount) * sign }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de l'ajout");
      return;
    }

    setDescription("");
    setAmount("");
    router.refresh();
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            className="rounded border px-2 py-1"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Description</label>
          <input
            className="rounded border px-2 py-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: courses, électricité…"
          />
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
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={submitting}
          onClick={() => submit(1)}
          className="rounded bg-emerald-600 px-4 py-1.5 text-white disabled:opacity-50"
        >
          J&apos;ai payé pour le/la coloc
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => submit(-1)}
          className="rounded bg-amber-600 px-4 py-1.5 text-white disabled:opacity-50"
        >
          Remboursement reçu
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
