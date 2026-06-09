const ACCESS_TOKEN_KEY = 'auth_access_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'

export const tokenStorage = {
  getAccessToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY)
    } catch {
      return null
    }
  },

  setAccessToken(token: string): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token)
    } catch {
      // ignore storage errors (e.g. private mode)
    }
  },

  removeAccessToken(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    } catch {
      // ignore
    }
  },

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    } catch {
      return null
    }
  },

  setRefreshToken(token: string): void {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token)
    } catch {
      // ignore
    }
  },

  removeRefreshToken(): void {
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    } catch {
      // ignore
    }
  },

  clear(): void {
    this.removeAccessToken()
    this.removeRefreshToken()
  },
}

export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    // Add padding if needed
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4)
    const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded) as T
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload<{ exp?: number }>(token)
  if (!payload || typeof payload.exp !== 'number') return true
  return Date.now() / 1000 > payload.exp
}
