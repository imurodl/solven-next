# Solven

Frontend for [solven.uz](https://solven.uz) — a car marketplace platform for buying and selling cars in Uzbekistan.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (Pages Router) + TypeScript 5.9 |
| UI | Material UI 5 + SCSS |
| Data | Apollo Client (GraphQL) + WebSocket subscriptions |
| i18n | next-i18next (EN, KR, RU, UZ) |
| Auth | JWT with automatic token refresh |
| Deploy | Docker + GitHub Actions CI/CD |

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn
- Running [solven API](https://github.com/imurodl/solven) backend

### Setup

```bash
# Clone
git clone https://github.com/imurodl/solven-next.git
cd solven-next

# Install dependencies
yarn install

# Configure environment
cp .env.example .env.local
# Edit with your API URLs

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker

```bash
# Development
docker compose up -d

# Production
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

## Features

### For Users
- Browse and search cars with advanced filters (brand, location, type, fuel, price range, mileage)
- Like and save favorite cars
- Follow agents/dealers
- Community discussion boards
- Real-time chat and notifications
- Multi-language support (English, Korean, Russian, Uzbek)

### For Agents
- List and manage car inventory
- Profile with reputation and rankings
- Track views and engagement

### Admin Panel
- Manage users, cars, and community content
- Customer support (notices, FAQ, inquiries)
- Car brand management

## Project Structure

```
pages/          -> Next.js routes (car, agent, community, mypage, _admin)
libs/
  components/   -> React components by feature
  auth/         -> JWT login/signup/refresh helpers
  types/        -> TypeScript interfaces
  enums/        -> Shared enums
apollo/         -> GraphQL client, queries, mutations, reactive state
scss/           -> Styles split by device (pc/ and mobile/)
```

## Deployment

Auto-deploys via GitHub Actions on push to `develop`:

1. CI checks (build + lint)
2. SSH to VPS
3. Docker build + restart

Live at: [solven.uz](https://solven.uz)

## License

ITC
