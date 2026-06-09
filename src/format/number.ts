export function formatNumber(
  n: number,
  locale: string = 'fr-CH',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(n)
}

export function formatCurrency(
  amount: number,
  currency: string,
  locale: string = 'fr-CH'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatPercent(ratio: number, decimals: number = 1): string {
  const pct = ratio * 100
  return `${round(pct, decimals)}%`
}

export function clamp(value: number, minVal: number, maxVal: number): number {
  return Math.min(Math.max(value, minVal), maxVal)
}

export function round(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}
