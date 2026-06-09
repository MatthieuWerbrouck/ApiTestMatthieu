# @matthieu/web-utils

Shared utility library for React web projects. Includes typed API client, form validation hooks, date/number/string formatters, and JWT auth utilities.

## Installation

```bash
npm install @matthieu/web-utils
# or
yarn add @matthieu/web-utils
```

Requires React 18+ as a peer dependency.

## Quick Start

```ts
import { createApiClient, useForm, required, email, formatDate, formatCurrency, useAuth } from '@matthieu/web-utils'
```

---

## Modules

### `api` — Typed Fetch Wrapper

#### `createApiClient(config)`

Creates a typed HTTP client with token injection, retry, and error handling.

```ts
import { createApiClient, ApiError } from '@matthieu/web-utils'

const api = createApiClient({
  baseUrl: 'https://api.example.com',
  getToken: () => localStorage.getItem('access_token'),
  timeout: 10_000,
  retries: 2,
})

// GET request
interface User { id: number; name: string; email: string }
const user = await api.get<User>('/users/1')

// POST request
const newUser = await api.post<User>('/users', { name: 'Alice', email: 'alice@example.com' })

// PUT / PATCH / DELETE
await api.put<User>('/users/1', { name: 'Alice Updated' })
await api.patch<User>('/users/1', { email: 'new@example.com' })
await api.delete('/users/1')

// Error handling
try {
  await api.get('/protected')
} catch (err) {
  if (err instanceof ApiError) {
    console.error(err.status, err.message, err.data)
  }
}
```

**Config options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | `string` | — | Base URL for all requests |
| `getToken` | `() => string \| null` | — | Returns the Bearer token |
| `timeout` | `number` | `10000` | Request timeout in ms |
| `retries` | `number` | `0` | Retries on 5xx errors (exponential backoff) |

---

### `forms` — Validation + useForm Hook

#### Validators

Composable validator functions: `(value: unknown) => string | null`

```ts
import { required, minLength, maxLength, email, min, max, pattern, url, compose } from '@matthieu/web-utils'

const nameValidator = compose(required(), minLength(2), maxLength(50))
const emailValidator = compose(required(), email())
const ageValidator = compose(required(), min(18), max(120))

nameValidator('Alice')   // null (valid)
nameValidator('')        // 'This field is required'
emailValidator('bad')    // 'Invalid email address'
```

#### `useForm<T>(config)`

React hook for form state management with validation.

```tsx
import { useForm, required, email, minLength } from '@matthieu/web-utils'

interface LoginForm {
  email: string
  password: string
}

function LoginPage() {
  const form = useForm<LoginForm>({
    initialValues: { email: '', password: '' },
    validators: {
      email: compose(required(), email()),
      password: compose(required(), minLength(8)),
    },
    onSubmit: async (values) => {
      await loginUser(values)
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        value={form.values.email}
        onChange={form.handleChange('email')}
        onBlur={form.handleBlur('email')}
      />
      {form.touched.email && form.errors.email && (
        <span>{form.errors.email}</span>
      )}

      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `values` | `T` | Current form values |
| `errors` | `Partial<Record<keyof T, string>>` | Validation errors |
| `touched` | `Partial<Record<keyof T, boolean>>` | Touched fields |
| `isSubmitting` | `boolean` | Submit in progress |
| `handleChange` | `(field) => EventHandler` | Input change handler |
| `handleBlur` | `(field) => () => void` | Input blur handler |
| `handleSubmit` | `(e) => void` | Form submit handler |
| `setFieldValue` | `(field, value) => void` | Programmatic field update |
| `reset` | `() => void` | Reset to initial values |

---

### `format` — Date, Number, String Formatters

#### Date utilities

```ts
import { formatDate, formatRelative, toISODate, parseISODate, isSameDay, addDays, startOfDay, endOfDay } from '@matthieu/web-utils'

formatDate(new Date(), 'fr-CH')
// '09.06.2026'

formatDate(new Date(), 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
// 'Tuesday, June 9, 2026'

formatRelative(new Date(Date.now() - 5 * 60 * 1000))
// 'il y a 5 minutes'

toISODate(new Date(2026, 5, 9))
// '2026-06-09'

parseISODate('2026-06-09')
// Date object

isSameDay(new Date(2026, 5, 9, 9, 0), new Date(2026, 5, 9, 18, 0))
// true

addDays(new Date(2026, 5, 9), 7)
// Date for 2026-06-16

startOfDay(new Date(2026, 5, 9, 14, 30))
// 2026-06-09T00:00:00.000

endOfDay(new Date(2026, 5, 9, 14, 30))
// 2026-06-09T23:59:59.999
```

#### Number utilities

```ts
import { formatNumber, formatCurrency, formatPercent, clamp, round } from '@matthieu/web-utils'

formatNumber(1234567.89, 'fr-CH')
// '1 234 567,89'

formatCurrency(1234.5, 'EUR', 'fr-CH')
// '1 234,50 EUR'

formatCurrency(1234.5, 'USD', 'en-US')
// '$1,234.50'

formatPercent(0.156, 1)
// '15.6%'

clamp(15, 0, 10)
// 10

round(1.2345, 2)
// 1.23
```

#### String utilities

```ts
import { capitalize, slugify, truncate, camelToKebab, kebabToCamel, stripHtml, initials } from '@matthieu/web-utils'

capitalize('hello world')
// 'Hello world'

slugify('Hello World! Héllo')
// 'hello-world-hello'

truncate('This is a long string', 15)
// 'This is a lo...'

camelToKebab('myVariableName')
// 'my-variable-name'

kebabToCamel('my-variable-name')
// 'myVariableName'

stripHtml('<p>Hello <b>World</b></p>')
// 'Hello World'

initials('John Michael Doe')
// 'JMD'
```

---

### `auth` — JWT Auth + useAuth Hook

#### Token storage

```ts
import { tokenStorage, decodeJwtPayload, isTokenExpired } from '@matthieu/web-utils'

// Store tokens
tokenStorage.setAccessToken('eyJhbGci...')
tokenStorage.setRefreshToken('eyJhbGci...')

// Read tokens
const access = tokenStorage.getAccessToken()  // string | null
const refresh = tokenStorage.getRefreshToken() // string | null

// Remove tokens
tokenStorage.removeAccessToken()
tokenStorage.removeRefreshToken()
tokenStorage.clear() // removes both

// Decode JWT payload (no signature verification)
interface UserPayload { sub: string; email: string; exp: number }
const payload = decodeJwtPayload<UserPayload>('eyJhbGci...')
// { sub: '123', email: 'user@example.com', exp: 1234567890 }

// Check expiry
isTokenExpired('eyJhbGci...')
// true or false
```

#### `useAuth()`

React hook for managing authentication state.

```tsx
import { useAuth } from '@matthieu/web-utils'

interface User {
  sub: string
  email: string
  name: string
}

function App() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth<User>()

  if (isLoading) return <div>Loading...</div>

  if (!isAuthenticated) {
    return (
      <button onClick={() => login('eyJhbGci...access...', 'eyJhbGci...refresh...')}>
        Sign in
      </button>
    )
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Sign out</button>
    </div>
  )
}
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `user` | `TUser \| null` | Decoded JWT payload |
| `isAuthenticated` | `boolean` | True when user is non-null |
| `isLoading` | `boolean` | True during initial token check |
| `login` | `(accessToken, refreshToken?) => void` | Store tokens and set user |
| `logout` | `() => void` | Clear tokens and reset state |

---

## Development

### Build

```bash
npm run build
```

### Tests

```bash
npm test
npm run test:watch
```

### Type check

```bash
npm run typecheck
```

### Dev mode (watch)

```bash
npm run dev
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes with tests
4. Run `npm test` and `npm run typecheck` to verify
5. Open a pull request

Please follow the existing code style. All new utilities should have corresponding test files.
