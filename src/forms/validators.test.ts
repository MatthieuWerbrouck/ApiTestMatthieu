import { describe, it, expect } from 'vitest'
import { required, minLength, maxLength, email, min, max, pattern, url, compose } from './validators'

describe('required', () => {
  const validator = required()

  it('returns null for non-empty string', () => {
    expect(validator('hello')).toBeNull()
  })

  it('returns error for empty string', () => {
    expect(validator('')).not.toBeNull()
  })

  it('returns error for null', () => {
    expect(validator(null)).not.toBeNull()
  })

  it('returns error for undefined', () => {
    expect(validator(undefined)).not.toBeNull()
  })

  it('uses custom message', () => {
    const v = required('Custom message')
    expect(v('')).toBe('Custom message')
  })
})

describe('minLength', () => {
  const validator = minLength(3)

  it('returns null when string is long enough', () => {
    expect(validator('abc')).toBeNull()
    expect(validator('abcd')).toBeNull()
  })

  it('returns error when string is too short', () => {
    expect(validator('ab')).not.toBeNull()
    expect(validator('')).not.toBeNull()
  })

  it('returns error for non-string', () => {
    expect(validator(123)).not.toBeNull()
  })

  it('uses custom message', () => {
    const v = minLength(5, 'Too short!')
    expect(v('abc')).toBe('Too short!')
  })
})

describe('maxLength', () => {
  const validator = maxLength(5)

  it('returns null when string is short enough', () => {
    expect(validator('abc')).toBeNull()
    expect(validator('abcde')).toBeNull()
  })

  it('returns error when string is too long', () => {
    expect(validator('abcdef')).not.toBeNull()
  })

  it('returns error for non-string', () => {
    expect(validator(123)).not.toBeNull()
  })

  it('uses custom message', () => {
    const v = maxLength(3, 'Too long!')
    expect(v('abcdef')).toBe('Too long!')
  })
})

describe('email', () => {
  const validator = email()

  it('returns null for valid email', () => {
    expect(validator('user@example.com')).toBeNull()
    expect(validator('user+tag@domain.co')).toBeNull()
  })

  it('returns error for invalid email', () => {
    expect(validator('notanemail')).not.toBeNull()
    expect(validator('@nodomain.com')).not.toBeNull()
    expect(validator('user@')).not.toBeNull()
  })

  it('returns error for non-string', () => {
    expect(validator(42)).not.toBeNull()
  })

  it('uses custom message', () => {
    const v = email('Bad email')
    expect(v('invalid')).toBe('Bad email')
  })
})

describe('min', () => {
  const validator = min(10)

  it('returns null when value is >= min', () => {
    expect(validator(10)).toBeNull()
    expect(validator(100)).toBeNull()
  })

  it('returns error when value is < min', () => {
    expect(validator(5)).not.toBeNull()
    expect(validator(0)).not.toBeNull()
    expect(validator(-1)).not.toBeNull()
  })

  it('returns error for NaN', () => {
    expect(validator('abc')).not.toBeNull()
  })

  it('uses custom message', () => {
    const v = min(0, 'Must be positive')
    expect(v(-1)).toBe('Must be positive')
  })
})

describe('max', () => {
  const validator = max(100)

  it('returns null when value is <= max', () => {
    expect(validator(100)).toBeNull()
    expect(validator(0)).toBeNull()
  })

  it('returns error when value is > max', () => {
    expect(validator(101)).not.toBeNull()
  })

  it('returns error for NaN', () => {
    expect(validator('abc')).not.toBeNull()
  })

  it('uses custom message', () => {
    const v = max(99, 'Too large')
    expect(v(100)).toBe('Too large')
  })
})

describe('pattern', () => {
  it('returns null when value matches pattern', () => {
    const validator = pattern(/^\d+$/, 'Digits only')
    expect(validator('12345')).toBeNull()
  })

  it('returns error when value does not match', () => {
    const validator = pattern(/^\d+$/, 'Digits only')
    expect(validator('abc')).toBe('Digits only')
    expect(validator('12a')).toBe('Digits only')
  })

  it('returns error for non-string', () => {
    const validator = pattern(/^\d+$/, 'Digits only')
    expect(validator(123)).toBe('Digits only')
  })
})

describe('url', () => {
  const validator = url()

  it('returns null for valid URL', () => {
    expect(validator('https://example.com')).toBeNull()
    expect(validator('http://localhost:3000')).toBeNull()
  })

  it('returns error for invalid URL', () => {
    expect(validator('not-a-url')).not.toBeNull()
    expect(validator('just-text')).not.toBeNull()
  })

  it('returns error for non-string', () => {
    expect(validator(42)).not.toBeNull()
  })

  it('uses custom message', () => {
    const v = url('Invalid URL!')
    expect(v('bad')).toBe('Invalid URL!')
  })
})

describe('compose', () => {
  it('returns null when all validators pass', () => {
    const validator = compose(required(), minLength(3), maxLength(10))
    expect(validator('hello')).toBeNull()
  })

  it('returns first error when a validator fails', () => {
    const validator = compose(required('Required'), minLength(5, 'Too short'))
    expect(validator('')).toBe('Required')
    expect(validator('abc')).toBe('Too short')
  })

  it('stops at first failing validator', () => {
    const alwaysFail1 = () => 'Error 1'
    const alwaysFail2 = () => 'Error 2'
    const validator = compose(alwaysFail1, alwaysFail2)
    expect(validator('anything')).toBe('Error 1')
  })
})
