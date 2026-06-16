const formatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export default function Money({ amount }: { amount: number }) {
  return <>{formatter.format(amount)}</>;
}
