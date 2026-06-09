type Validator = (value: unknown) => string | null

export function required(message = 'This field is required'): Validator {
  return (value) => {
    if (value === null || value === undefined || value === '') return message
    return null
  }
}

export function minLength(n: number, message?: string): Validator {
  return (value) => {
    const msg = message ?? `Must be at least ${n} characters`
    if (typeof value !== 'string') return msg
    return value.length < n ? msg : null
  }
}

export function maxLength(n: number, message?: string): Validator {
  return (value) => {
    const msg = message ?? `Must be at most ${n} characters`
    if (typeof value !== 'string') return msg
    return value.length > n ? msg : null
  }
}

export function email(message = 'Invalid email address'): Validator {
  return (value) => {
    if (typeof value !== 'string') return message
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(value) ? null : message
  }
}

export function min(n: number, message?: string): Validator {
  return (value) => {
    const msg = message ?? `Must be at least ${n}`
    const num = Number(value)
    if (isNaN(num)) return msg
    return num < n ? msg : null
  }
}

export function max(n: number, message?: string): Validator {
  return (value) => {
    const msg = message ?? `Must be at most ${n}`
    const num = Number(value)
    if (isNaN(num)) return msg
    return num > n ? msg : null
  }
}

export function pattern(regex: RegExp, message: string): Validator {
  return (value) => {
    if (typeof value !== 'string') return message
    return regex.test(value) ? null : message
  }
}

export function url(message = 'Invalid URL'): Validator {
  return (value) => {
    if (typeof value !== 'string') return message
    try {
      new URL(value)
      return null
    } catch {
      return message
    }
  }
}

export function compose(...validators: Validator[]): Validator {
  return (value) => {
    for (const validator of validators) {
      const error = validator(value)
      if (error !== null) return error
    }
    return null
  }
}
