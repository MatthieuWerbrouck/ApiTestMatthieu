import { describe, it, expect, beforeEach, vi } from 'vitest'
import { tokenStorage, decodeJwtPayload, isTokenExpired } from './storage'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((_key: string): string | null => null),
    setItem: vi.fn((_key: string, _value: string): void => { store[_key] = _value }),
    removeItem: vi.fn((_key: string): void => { delete store[_key] }),
    clear: vi.fn((): void => { store = {} }),
    get length() { return Object.keys(store).length },
    key: vi.fn((_i: number): string | null => null),
  }
})()

vi.stubGlobal('localStorage', localStorageMock)

describe('tokenStorage', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
    // Reset store via clear mock
    localStorageMock.clear()
  })

  it('sets and gets access token', () => {
    tokenStorage.setAccessToken('access-token-123')
    localStorageMock.getItem.mockReturnValueOnce('access-token-123')
    expect(tokenStorage.getAccessToken()).toBe('access-token-123')
  })

  it('returns null when access token not set', () => {
    localStorageMock.getItem.mockReturnValueOnce(null)
    expect(tokenStorage.getAccessToken()).toBeNull()
  })

  it('removes access token', () => {
    tokenStorage.setAccessToken('access-token-123')
    tokenStorage.removeAccessToken()
    localStorageMock.getItem.mockReturnValueOnce(null)
    expect(tokenStorage.getAccessToken()).toBeNull()
  })

  it('sets and gets refresh token', () => {
    tokenStorage.setRefreshToken('refresh-token-456')
    localStorageMock.getItem.mockReturnValueOnce('refresh-token-456')
    expect(tokenStorage.getRefreshToken()).toBe('refresh-token-456')
  })

  it('returns null when refresh token not set', () => {
    localStorageMock.getItem.mockReturnValueOnce(null)
    expect(tokenStorage.getRefreshToken()).toBeNull()
  })

  it('removes refresh token', () => {
    tokenStorage.setRefreshToken('refresh-token-456')
    tokenStorage.removeRefreshToken()
    localStorageMock.getItem.mockReturnValueOnce(null)
    expect(tokenStorage.getRefreshToken()).toBeNull()
  })

  it('clear removes both tokens', () => {
    tokenStorage.setAccessToken('access')
    tokenStorage.setRefreshToken('refresh')
    tokenStorage.clear()
    expect(localStorageMock.removeItem).toHaveBeenCalledTimes(2)
  })
})

// Helper to create a JWT token with a given payload
function createJwtToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  const signature = 'fake-signature'
  return `${header}.${body}.${signature}`
}

describe('decodeJwtPayload', () => {
  it('decodes a valid JWT payload', () => {
    const payload = { sub: '123', name: 'John', iat: 1234567890 }
    const token = createJwtToken(payload)
    const decoded = decodeJwtPayload(token)
    expect(decoded).toMatchObject(payload)
  })

  it('returns null for invalid token (wrong number of parts)', () => {
    expect(decodeJwtPayload('invalid')).toBeNull()
    expect(decodeJwtPayload('only.two')).toBeNull()
  })

  it('returns null for malformed payload', () => {
    expect(decodeJwtPayload('header.!!!invalid!!!.sig')).toBeNull()
  })

  it('returns typed payload', () => {
    interface UserPayload { sub: string; email: string }
    const payload = { sub: '123', email: 'user@example.com' }
    const token = createJwtToken(payload)
    const decoded = decodeJwtPayload<UserPayload>(token)
    expect(decoded?.sub).toBe('123')
    expect(decoded?.email).toBe('user@example.com')
  })
})

describe('isTokenExpired', () => {
  it('returns false for a token with future expiry', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    const token = createJwtToken({ sub: '123', exp: futureExp })
    expect(isTokenExpired(token)).toBe(false)
  })

  it('returns true for an expired token', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
    const token = createJwtToken({ sub: '123', exp: pastExp })
    expect(isTokenExpired(token)).toBe(true)
  })

  it('returns true when token has no exp claim', () => {
    const token = createJwtToken({ sub: '123' })
    expect(isTokenExpired(token)).toBe(true)
  })

  it('returns true for invalid token', () => {
    expect(isTokenExpired('invalid-token')).toBe(true)
  })
})
