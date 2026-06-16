export function getMonthRange(month?: string | null): { start: Date; end: Date } {
  const now = new Date();
  let year = now.getUTCFullYear();
  let monthIndex = now.getUTCMonth();

  if (month) {
    const match = /^(\d{4})-(\d{2})$/.exec(month);
    if (match) {
      year = Number(match[1]);
      monthIndex = Number(match[2]) - 1;
    }
  }

  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 1));
  return { start, end };
}
