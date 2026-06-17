export function getMonthString(month?: string | null): string {
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    return month;
  }
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function getMonthRange(month?: string | null): { start: Date; end: Date } {
  const resolved = getMonthString(month);
  const [year, monthNumber] = resolved.split("-").map(Number);

  const start = new Date(Date.UTC(year, monthNumber - 1, 1));
  const end = new Date(Date.UTC(year, monthNumber, 1));
  return { start, end };
}
