import { getRoommateLedger } from "@/lib/coloc";
import RoommateBalanceBanner from "@/components/RoommateBalanceBanner";
import RoommateEntryForm from "@/components/RoommateEntryForm";
import RoommateLedgerList from "@/components/RoommateLedgerList";

export default async function ColocPage() {
  const { entries, balance } = await getRoommateLedger();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Coloc</h1>
      <RoommateBalanceBanner balance={balance} />
      <RoommateEntryForm />
      <RoommateLedgerList entries={entries} />
    </div>
  );
}
