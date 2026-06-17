import Money from "./Money";

export default function RoommateBalanceBanner({ balance }: { balance: number }) {
  if (balance === 0) {
    return (
      <div className="rounded-lg bg-gray-100 p-4 text-center font-medium text-gray-700">
        Vous êtes à égalité avec votre coloc.
      </div>
    );
  }

  const isOwedToYou = balance > 0;

  return (
    <div
      className={`rounded-lg p-4 text-center font-medium ${
        isOwedToYou ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {isOwedToYou ? (
        <>Le/La coloc vous doit <Money amount={balance} /></>
      ) : (
        <>Vous devez <Money amount={Math.abs(balance)} /> à votre coloc</>
      )}
    </div>
  );
}
