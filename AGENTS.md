# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Type-check + build for production
npm run lint         # ESLint with zero warnings tolerance
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Prettier format all files
npm run type-check   # TypeScript check without emit
npm test             # Run Jest tests
npm run test:watch   # Jest in watch mode
npm run test:coverage # Jest with coverage report
```

To run a single test file:
```bash
npx jest src/tests/App.test.tsx
```

CI runs lint → test (with coverage) → build on pushes/PRs to `main` and `dev`.

## Architecture

The app is a React 19 + TypeScript + Vite SPA for managing users via a REST API.

**Layer flow:** `Component → Hook → Service → ApiService → Axios instance`

- **`src/lib/axios.ts`** — Configured Axios instance. Reads `VITE_ENV` to select the base URL from `VITE_API_URL_DEV`, `VITE_API_URL_UAT`, or `VITE_API_URL_LOCAL`. Transforms backend error messages in the response interceptor.
- **`src/services/apiService.ts`** — Generic CRUD wrapper (`get`, `post`, `put`, `delete`) around the Axios instance. Returns typed responses.
- **`src/services/userService.ts`** — Domain service for `/v1/users` endpoints (`getAll`, `getById`, `create`, `update`).
- **`src/hooks/`** — Custom React hooks that call services and expose `{ data, loading, error, refetch }` shaped state.
- **`src/components/`** — UI components. `UsersTable` is the main screen; modals (`UserCreateModal`, `UserDetailModal`) are rendered inline within it.
- **`src/VOs/`** — TypeScript interfaces/types (Value Objects). `user.types.ts` defines `User`, `UserRequest`, `UserUpdateRequest`.

**Path alias:** `@/` maps to `src/` (configured in both Vite and Jest).

## Testing

Tests live in `src/tests/` and must match `**/*.test.ts` or `**/*.test.tsx`.

`setupTests.ts` globally mocks `@/lib/axios` so HTTP calls never fire in tests. CSS and image imports are stubbed via `identity-obj-proxy` and `__mocks__/fileMock.cjs`.

## Environment Variables

Defined in `.env`. Key variables:
- `VITE_ENV` — `local` | `dev` | `uat`
- `VITE_API_URL_LOCAL`, `VITE_API_URL_DEV`, `VITE_API_URL_UAT` — Backend URLs per environment
