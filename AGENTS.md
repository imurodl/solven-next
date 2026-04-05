# AI Agent Guide — Solven Next

This file helps AI coding agents understand the project quickly.

## What is this?

A Next.js 14 (Pages Router) frontend for a car marketplace. Connects to a NestJS GraphQL backend via Apollo Client and WebSockets.

## Quick orientation

| What | Where |
|------|-------|
| Page routes | `pages/` |
| React components | `libs/components/{feature}/` |
| GraphQL queries | `apollo/user/query.ts` |
| GraphQL mutations | `apollo/user/mutation.ts` |
| Apollo client setup | `apollo/client.ts` |
| Global state | `apollo/store.ts` (reactive variables) |
| Auth helpers | `libs/auth/index.ts` |
| TypeScript types | `libs/types/` |
| Enums | `libs/enums/` |
| Shared config | `libs/config.ts` |
| Desktop styles | `scss/pc/` |
| Mobile styles | `scss/mobile/` |
| MUI theme | `scss/MaterialTheme/` |
| i18n config | `next-i18next.config.js` |
| Env vars | `.env.local` (see `.env.example`) |

## Architecture decisions

- **Pages Router** (not App Router) — all routes in `pages/`
- **Device-adaptive**: `useDeviceDetect()` hook returns `'mobile'` or `'desktop'`, components render different JSX per device
- **Separate SCSS**: Desktop styles in `scss/pc/`, mobile in `scss/mobile/`
- **Auth via localStorage**: Access + refresh tokens stored in `localStorage`, auto-refreshed via `TokenRefreshLink` in Apollo
- **Filter state via URL**: Car filters are serialized as JSON in query params (`?input=JSON`)
- **Admin panel**: Routes under `pages/_admin/`, uses `LayoutAdmin` wrapper

## Key patterns to follow

- **GraphQL**: All queries go in `apollo/user/query.ts`, mutations in `mutation.ts`. Use `gql` tagged templates.
- **Auth state**: Current user is in `userVar` reactive variable (from `apollo/store.ts`). Read with `useReactiveVar(userVar)`.
- **Components**: Each feature has its own directory under `libs/components/`. Common reusable components are in `libs/components/common/`.
- **Alerts**: Use `sweetalert2` (`libs/sweetAlert.ts`) for user-facing messages.
- **Types**: Mirror backend DTOs in `libs/types/`. Keep them in sync with the GraphQL schema.

## Auth flow

- `logIn()` / `signUp()` in `libs/auth/index.ts` — call GraphQL mutations, store tokens
- `TokenRefreshLink` in `apollo/client.ts` auto-detects expired tokens and calls `refreshTokens()`
- `isTokenExpired()` checks JWT `exp` claim
- `logOut()` clears tokens and redirects to `/`

## Build and verify

```bash
yarn install           # Install deps
yarn build             # Production build (catches type + lint errors)
yarn dev               # Dev server
yarn lint              # ESLint check
```

## Things to avoid

- Using App Router patterns (this is Pages Router)
- Adding `@ts-ignore` — fix the underlying type issue instead
- Using `console.log` in production code
- Importing from `react-scripts` or other removed packages
- Adding new carousel libraries (use `swiper`, already installed)
- Hardcoding API URLs (use `process.env.REACT_APP_*`)
