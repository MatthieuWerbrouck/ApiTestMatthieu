import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPercent, clamp, round } from './number'

describe('formatCurrency', () => {
  it('formats amount with currency', () => {
    const result = formatCurrency(1234.5, 'USD', 'en-US')
    // Should contain dollar sign and formatted number
    expect(result).toContain('1,234.50')
  })

  it('returns a string', () => {
    const result = formatCurrency(100, 'EUR')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('formats zero correctly', () => {
    const result = formatCurrency(0, 'USD', 'en-US')
    expect(result).toContain('0')
  })

  it('handles negative amounts', () => {
    const result = formatCurrency(-50, 'USD', 'en-US')
    expect(result).toContain('50')
  })
})

describe('formatPercent', () => {
  it('converts ratio to percentage', () => {
    expect(formatPercent(0.5)).toBe('50%')
  })

  it('handles partial percentages', () => {
    expect(formatPercent(0.156, 1)).toBe('15.6%')
  })

  it('uses default 1 decimal', () => {
    expect(formatPercent(0.1)).toBe('10%')
  })

  it('rounds correctly', () => {
    expect(formatPercent(0.333, 2)).toBe('33.3%')
  })

  it('handles 100%', () => {
    expect(formatPercent(1)).toBe('100%')
  })

  it('handles 0%', () => {
    expect(formatPercent(0)).toBe('0%')
  })
})

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(0, 0, 10)).toBe(0)
    expect(clamp(10, 0, 10)).toBe(10)
  })

  it('clamps to minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
    expect(clamp(-100, -10, 10)).toBe(-10)
  })

  it('clamps to maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10)
    expect(clamp(1000, 0, 100)).toBe(100)
  })
})

describe('round', () => {
  it('rounds to specified decimal places', () => {
    expect(round(1.234, 2)).toBe(1.23)
    expect(round(1.235, 2)).toBe(1.24)
  })

  it('rounds to 0 decimal places', () => {
    expect(round(1.5, 0)).toBe(2)
    expect(round(1.4, 0)).toBe(1)
  })

  it('handles negative numbers', () => {
    expect(round(-1.5, 0)).toBe(-1)
    expect(round(-1.567, 2)).toBe(-1.57)
  })

  it('handles exact values', () => {
    expect(round(1.1, 1)).toBe(1.1)
    expect(round(100, 2)).toBe(100)
  })
})
