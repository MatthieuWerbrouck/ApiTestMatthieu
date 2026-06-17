"use client";

import { useRouter } from "next/navigation";
import Money from "./Money";

type Entry = { id: string; date: Date; description: string; amount: number };

export default function RoommateLedgerList({ entries }: { entries: Entry[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    await fetch(`/api/coloc/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (entries.length === 0) {
    return <p className="text-gray-500">Aucune entrée pour l&apos;instant.</p>;
  }

  return (
    <ul className="divide-y">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-center justify-between gap-3 py-2">
          <div>
            <div className="font-medium">{entry.description}</div>
            <div className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString("fr-FR")}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className={entry.amount >= 0 ? "text-emerald-600" : "text-amber-600"}>
              {entry.amount >= 0 ? "+" : "−"}
              <Money amount={Math.abs(entry.amount)} />
            </span>
            <button
              type="button"
              className="text-sm text-gray-400 hover:text-red-600"
              onClick={() => handleDelete(entry.id)}
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
