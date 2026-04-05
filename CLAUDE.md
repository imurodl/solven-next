# Solven Next

Next.js frontend for the Solven car marketplace — car browsing, agent profiles, community, real-time chat, and admin panel.

## Tech Stack

- **Framework**: Next.js 14.2 (Pages Router) + React 18 + TypeScript 5.9
- **Data**: Apollo Client (GraphQL) + WebSocket subscriptions
- **UI**: MUI 5 + SCSS (separate mobile/desktop stylesheets)
- **State**: Apollo reactive variables (valtio also installed)
- **i18n**: next-i18next (4 locales: en, kr, ru, uz)
- **Auth**: JWT in localStorage, automatic refresh via TokenRefreshLink
- **Deploy**: Docker on VPS, CI/CD via GitHub Actions

## Architecture

```
├── pages/                 # Next.js page routes
│   ├── _app.tsx           # Apollo + MUI + i18n providers
│   ├── index.tsx          # Homepage
│   ├── car/               # Car listings + detail
│   ├── agent/             # Agent directory + detail
│   ├── community/         # Board articles + detail
│   ├── member/            # Member profiles
│   ├── mypage/            # User dashboard (profile, favorites, listings)
│   ├── account/           # Login/signup
│   ├── help/              # FAQ, terms
│   ├── about/             # About page
│   └── _admin/            # Admin panel (users, cars, community, CS)
│
├── libs/
│   ├── components/        # React components by feature
│   │   ├── admin/         # Admin UI (tables, forms)
│   │   ├── car/           # Filter, cards, detail views
│   │   ├── homepage/      # Hero, trending, top agents, brands
│   │   ├── common/        # AgentCard, CarBigCard, NotificationModal
│   │   ├── layout/        # LayoutHome, LayoutAdmin
│   │   ├── Chat.tsx       # WebSocket chat
│   │   ├── Top.tsx        # Navigation header
│   │   └── Footer.tsx     # Footer
│   ├── auth/              # JWT helpers (login, signup, refresh, logout)
│   ├── types/             # TypeScript interfaces (mirrors backend DTOs)
│   ├── enums/             # Shared enums (car, member, etc.)
│   ├── hooks/             # useDeviceDetect
│   └── config.ts          # Constants (price ranges, mileage, years)
│
├── apollo/
│   ├── client.ts          # Apollo setup (auth link, WebSocket, token refresh)
│   ├── store.ts           # Reactive variables (userVar, socketVar)
│   └── user/              # GraphQL queries + mutations
│       ├── query.ts
│       └── mutation.ts
│
└── scss/                  # Styling
    ├── pc/                # Desktop styles
    ├── mobile/            # Mobile styles
    └── MaterialTheme/     # MUI theme + styled components
```

## Key Conventions

- **Pages Router** (not App Router) — all routes in `pages/`
- Device-adaptive rendering via `useDeviceDetect()` hook (mobile vs desktop layouts)
- GraphQL queries/mutations in `apollo/user/query.ts` and `mutation.ts`
- Auth state stored in Apollo reactive variable `userVar` (decoded from JWT)
- Filter state passed via URL query params (`?input=JSON`)
- Admin routes under `/_admin/` — separate layout with sidebar
- SCSS split by device: `scss/pc/` and `scss/mobile/`
- Use `sweetalert2` for user-facing alerts, `notistack` for notifications

## Auth Flow

- Login/signup returns access + refresh tokens, both stored in `localStorage`
- `TokenRefreshLink` in Apollo client auto-refreshes when access token expires
- `isTokenExpired()` checks JWT `exp` claim client-side
- Logout clears both tokens and redirects to `/`

## Commands

```bash
yarn dev       # Dev server
yarn build     # Production build
yarn start     # Run production build
yarn lint      # ESLint (next/core-web-vitals)
```

## Docker

```bash
docker compose up -d                              # Dev (volume mount)
docker compose -f docker-compose.prod.yml build   # Prod (Dockerfile, env vars baked as build args)
docker compose -f docker-compose.prod.yml up -d   # Prod run (port 4006 -> 3006)
```

## Environment Variables

See `.env.example`. The frontend needs:
- `REACT_APP_API_URL` — Backend API base URL
- `REACT_APP_API_GRAPHQL_URL` — GraphQL endpoint
- `REACT_APP_API_WS` — WebSocket URL

## Deployment

- **VPS**: Docker container behind Nginx with SSL
- **CI/CD**: GitHub Actions on push to `develop` — build + lint check, then SSH deploy with retry
- **Domain**: `solven.uz` (frontend at port 4006)
