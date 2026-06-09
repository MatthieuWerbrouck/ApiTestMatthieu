import { describe, it, expect } from 'vitest'
import { capitalize, slugify, truncate, camelToKebab, kebabToCamel, stripHtml, initials } from './string'

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('does not change the rest', () => {
    expect(capitalize('hELLO')).toBe('HELLO')
  })

  it('handles empty string', () => {
    expect(capitalize('')).toBe('')
  })

  it('handles single char', () => {
    expect(capitalize('a')).toBe('A')
  })
})

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('replaces spaces with hyphens', () => {
    expect(slugify('foo bar baz')).toBe('foo-bar-baz')
  })

  it('removes special characters', () => {
    expect(slugify('Hello World!')).toBe('hello-world')
  })

  it('collapses multiple hyphens', () => {
    expect(slugify('foo  --  bar')).toBe('foo-bar')
  })

  it('trims whitespace', () => {
    expect(slugify('  hello  ')).toBe('hello')
  })
})

describe('truncate', () => {
  it('returns original string if within limit', () => {
    expect(truncate('Hello', 10)).toBe('Hello')
    expect(truncate('Hello', 5)).toBe('Hello')
  })

  it('truncates with default suffix', () => {
    const result = truncate('Hello World', 8)
    expect(result).toBe('Hello...')
    expect(result.length).toBe(8)
  })

  it('truncates with custom suffix', () => {
    const result = truncate('Hello World', 8, '…')
    expect(result.length).toBe(8)
    expect(result.endsWith('…')).toBe(true)
  })

  it('handles empty string', () => {
    expect(truncate('', 10)).toBe('')
  })
})

describe('camelToKebab', () => {
  it('converts camelCase to kebab-case', () => {
    expect(camelToKebab('myVariable')).toBe('my-variable')
  })

  it('handles multiple words', () => {
    expect(camelToKebab('myLongVariableName')).toBe('my-long-variable-name')
  })

  it('handles already lowercase', () => {
    expect(camelToKebab('hello')).toBe('hello')
  })

  it('handles numbers', () => {
    expect(camelToKebab('myVar2Name')).toBe('my-var2-name')
  })
})

describe('kebabToCamel', () => {
  it('converts kebab-case to camelCase', () => {
    expect(kebabToCamel('my-variable')).toBe('myVariable')
  })

  it('handles multiple words', () => {
    expect(kebabToCamel('my-long-variable-name')).toBe('myLongVariableName')
  })

  it('handles no hyphens', () => {
    expect(kebabToCamel('hello')).toBe('hello')
  })

  it('is inverse of camelToKebab', () => {
    const original = 'myLongVariableName'
    expect(kebabToCamel(camelToKebab(original))).toBe(original)
  })
})

describe('stripHtml', () => {
  it('removes HTML tags', () => {
    expect(stripHtml('<p>Hello World</p>')).toBe('Hello World')
  })

  it('removes multiple tags', () => {
    expect(stripHtml('<b>Bold</b> and <i>italic</i>')).toBe('Bold and italic')
  })

  it('handles self-closing tags', () => {
    expect(stripHtml('Hello<br/>World')).toBe('HelloWorld')
  })

  it('returns string without HTML unchanged', () => {
    expect(stripHtml('Hello World')).toBe('Hello World')
  })

  it('handles empty string', () => {
    expect(stripHtml('')).toBe('')
  })
})

describe('initials', () => {
  it('extracts initials from full name', () => {
    expect(initials('John Doe')).toBe('JD')
  })

  it('handles three names', () => {
    expect(initials('John Michael Doe')).toBe('JMD')
  })

  it('handles single name', () => {
    expect(initials('John')).toBe('J')
  })

  it('handles extra spaces', () => {
    expect(initials('  John   Doe  ')).toBe('JD')
  })

  it('returns uppercase initials', () => {
    expect(initials('john doe')).toBe('JD')
  })
})
