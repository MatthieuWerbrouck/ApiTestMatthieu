export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface ApiClientConfig {
  baseUrl: string
  getToken?: () => string | null
  timeout?: number
  retries?: number
}

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown }

export function createApiClient(config: ApiClientConfig) {
  const { baseUrl, getToken, timeout = 10_000, retries = 0 } = config

  async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
    const url = `${baseUrl}${path}`
    const headers = new Headers(options.headers as HeadersInit)

    headers.set('Content-Type', 'application/json')

    const token = getToken?.()
    if (token) headers.set('Authorization', `Bearer ${token}`)

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    const fetchOptions: RequestInit = {
      ...options,
      method,
      headers,
      signal: controller.signal,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    }

    let lastError: ApiError | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt > 0) {
        await new Promise(r => setTimeout(r, 2 ** (attempt - 1) * 1000))
      }
      try {
        const res = await fetch(url, fetchOptions)
        clearTimeout(timer)

        if (!res.ok) {
          let data: unknown
          try { data = await res.json() } catch { /* empty */ }
          throw new ApiError(res.status, `HTTP ${res.status}`, data)
        }

        if (res.status === 204) return undefined as T
        return res.json() as Promise<T>
      } catch (err) {
        if (err instanceof ApiError) {
          // Only retry on network errors (5xx), not on 4xx
          if (err.status < 500) throw err
          lastError = err
        } else {
          clearTimeout(timer)
          throw err
        }
      }
    }

    throw lastError!
  }

  return {
    get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
    post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('POST', path, { ...options, body }),
    put: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PUT', path, { ...options, body }),
    patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PATCH', path, { ...options, body }),
    delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
  }
}
