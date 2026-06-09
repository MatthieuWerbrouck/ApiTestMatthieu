import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createApiClient, ApiError } from './client'

describe('ApiError', () => {
  it('should be an instance of Error', () => {
    const err = new ApiError(404, 'Not Found')
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(ApiError)
  })

  it('should have the correct name', () => {
    const err = new ApiError(500, 'Server Error')
    expect(err.name).toBe('ApiError')
  })

  it('should have status and message', () => {
    const err = new ApiError(401, 'Unauthorized', { reason: 'token expired' })
    expect(err.status).toBe(401)
    expect(err.message).toBe('Unauthorized')
    expect(err.data).toEqual({ reason: 'token expired' })
  })
})

describe('createApiClient', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should inject Authorization header when getToken returns a token', async () => {
    const mockResponse = { id: 1, name: 'John' }
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      getToken: () => 'my-token',
    })

    const result = await client.get<typeof mockResponse>('/users/1')

    expect(result).toEqual(mockResponse)
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = options.headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer my-token')
  })

  it('should not inject Authorization header when getToken returns null', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })

    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      getToken: () => null,
    })

    await client.get('/test')

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = options.headers as Headers
    expect(headers.get('Authorization')).toBeNull()
  })

  it('should return undefined for 204 No Content', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: () => Promise.reject(new Error('No body')),
    })

    const client = createApiClient({ baseUrl: 'https://api.example.com' })
    const result = await client.delete('/users/1')

    expect(result).toBeUndefined()
  })

  it('should throw ApiError on non-ok response', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Not found' }),
    })

    const client = createApiClient({ baseUrl: 'https://api.example.com' })

    const err = await client.get('/missing').catch((e: unknown) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect((err as ApiError).status).toBe(404)
  })

  it('should throw immediately on 4xx without retry', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      json: () => Promise.resolve({}),
    })

    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      retries: 3,
    })

    await expect(client.get('/forbidden')).rejects.toThrow(ApiError)
    // Should only be called once (no retries on 4xx)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should retry on 5xx errors', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      })

    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      retries: 2,
    })

    // Mock the delay to avoid slow tests
    vi.useFakeTimers()
    const promise = client.get('/flaky')
    // Advance timers to skip exponential backoff
    await vi.runAllTimersAsync()
    const result = await promise
    vi.useRealTimers()

    expect(result).toEqual({ success: true })
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('should POST with JSON body', async () => {
    const body = { name: 'Alice', email: 'alice@example.com' }
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: 42, ...body }),
    })

    const client = createApiClient({ baseUrl: 'https://api.example.com' })
    await client.post('/users', body)

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(options.method).toBe('POST')
    expect(options.body).toBe(JSON.stringify(body))
  })

  it('should construct the full URL correctly', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })

    const client = createApiClient({ baseUrl: 'https://api.example.com' })
    await client.get('/users/123')

    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe('https://api.example.com/users/123')
  })
})
