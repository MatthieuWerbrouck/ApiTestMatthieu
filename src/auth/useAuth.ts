import { useState, useEffect, useCallback } from 'react'
import { tokenStorage, decodeJwtPayload } from './storage'

interface AuthState<TUser = Record<string, unknown>> {
  user: TUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (accessToken: string, refreshToken?: string) => void
  logout: () => void
}

export function useAuth<TUser = Record<string, unknown>>(): AuthState<TUser> {
  const [user, setUser] = useState<TUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = tokenStorage.getAccessToken()
    if (token) {
      const payload = decodeJwtPayload<TUser>(token)
      setUser(payload)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((accessToken: string, refreshToken?: string) => {
    tokenStorage.setAccessToken(accessToken)
    if (refreshToken) {
      tokenStorage.setRefreshToken(refreshToken)
    }
    const payload = decodeJwtPayload<TUser>(accessToken)
    setUser(payload)
  }, [])

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
  }, [])

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
  }
}
