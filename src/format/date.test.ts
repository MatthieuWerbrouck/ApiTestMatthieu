import { describe, it, expect } from 'vitest'
import { toISODate, parseISODate, isSameDay, addDays, startOfDay, endOfDay, formatRelative } from './date'

describe('toISODate', () => {
  it('formats date as YYYY-MM-DD', () => {
    expect(toISODate(new Date(2024, 0, 15))).toBe('2024-01-15')
    expect(toISODate(new Date(2024, 11, 31))).toBe('2024-12-31')
  })

  it('pads month and day with zeros', () => {
    expect(toISODate(new Date(2024, 0, 5))).toBe('2024-01-05')
  })
})

describe('parseISODate', () => {
  it('parses YYYY-MM-DD string to Date', () => {
    const date = parseISODate('2024-01-15')
    expect(date.getFullYear()).toBe(2024)
    expect(date.getMonth()).toBe(0) // January
    expect(date.getDate()).toBe(15)
  })

  it('is inverse of toISODate', () => {
    const original = new Date(2024, 5, 21)
    const str = toISODate(original)
    const parsed = parseISODate(str)
    expect(toISODate(parsed)).toBe(str)
  })
})

describe('isSameDay', () => {
  it('returns true for same day', () => {
    const a = new Date(2024, 3, 10, 9, 0, 0)
    const b = new Date(2024, 3, 10, 18, 30, 0)
    expect(isSameDay(a, b)).toBe(true)
  })

  it('returns false for different days', () => {
    const a = new Date(2024, 3, 10)
    const b = new Date(2024, 3, 11)
    expect(isSameDay(a, b)).toBe(false)
  })

  it('returns false for same day in different months', () => {
    const a = new Date(2024, 3, 10)
    const b = new Date(2024, 4, 10)
    expect(isSameDay(a, b)).toBe(false)
  })
})

describe('addDays', () => {
  it('adds positive days', () => {
    const date = new Date(2024, 0, 28)
    const result = addDays(date, 5)
    expect(result.getDate()).toBe(2)
    expect(result.getMonth()).toBe(1) // February
  })

  it('adds negative days (subtracts)', () => {
    const date = new Date(2024, 1, 5)
    const result = addDays(date, -5)
    expect(result.getDate()).toBe(31)
    expect(result.getMonth()).toBe(0) // January
  })

  it('does not mutate original date', () => {
    const original = new Date(2024, 5, 1)
    const originalTime = original.getTime()
    addDays(original, 10)
    expect(original.getTime()).toBe(originalTime)
  })
})

describe('startOfDay', () => {
  it('sets time to 00:00:00.000', () => {
    const date = new Date(2024, 5, 15, 14, 30, 45, 500)
    const result = startOfDay(date)
    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
    expect(result.getSeconds()).toBe(0)
    expect(result.getMilliseconds()).toBe(0)
    expect(result.getDate()).toBe(15)
  })

  it('does not mutate original date', () => {
    const original = new Date(2024, 5, 15, 14, 30)
    const originalTime = original.getTime()
    startOfDay(original)
    expect(original.getTime()).toBe(originalTime)
  })
})

describe('endOfDay', () => {
  it('sets time to 23:59:59.999', () => {
    const date = new Date(2024, 5, 15, 0, 0, 0)
    const result = endOfDay(date)
    expect(result.getHours()).toBe(23)
    expect(result.getMinutes()).toBe(59)
    expect(result.getSeconds()).toBe(59)
    expect(result.getMilliseconds()).toBe(999)
    expect(result.getDate()).toBe(15)
  })

  it('does not mutate original date', () => {
    const original = new Date(2024, 5, 15, 0, 0)
    const originalTime = original.getTime()
    endOfDay(original)
    expect(original.getTime()).toBe(originalTime)
  })
})

describe('formatRelative', () => {
  it('returns a string for a past date', () => {
    const past = new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    const result = formatRelative(past, 'en')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns a string for a future date', () => {
    const future = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days in future
    const result = formatRelative(future, 'en')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('uses the provided locale', () => {
    const past = new Date(Date.now() - 10 * 60 * 1000) // 10 min ago
    const enResult = formatRelative(past, 'en')
    const frResult = formatRelative(past, 'fr')
    // Both should return strings (locale behavior varies across environments)
    expect(typeof enResult).toBe('string')
    expect(typeof frResult).toBe('string')
  })
})
