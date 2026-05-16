# Rapide — Developer Onboarding

## What Is This?

Rapide is a production-grade logistics and delivery platform for the Benin Republic (and pan-African expansion). This monorepo contains all platform components: customer web app, admin dashboard, merchant portal, NestJS API, shared component library, and Flutter mobile stub.

## Monorepo Structure

```
rapide/
├── apps/
│   ├── web/        # Next.js 14 — Customer-facing app (port 3000)
│   ├── admin/      # Next.js 14 — Admin dashboard (port 3002)
│   ├── merchant/   # Next.js 14 — Merchant portal (port 3003)
│   ├── api/        # NestJS — REST + WebSocket backend (port 3001)
│   └── mobile/     # Flutter — Customer & rider mobile apps
├── packages/
│   ├── ui/         # @rapide/ui — Shared Radix+Tailwind component library
│   ├── database/   # @rapide/database — Prisma schema + client
│   ├── types/      # @rapide/types — Shared TypeScript types & enums
│   ├── i18n/       # @rapide/i18n — next-intl translations (fr/en)
│   ├── config/     # @rapide/config — Shared ESLint/TS/Tailwind configs
│   └── utils/      # @rapide/utils — Pure utility functions
├── supabase/       # SQL migrations + Edge Functions
├── docker/         # Dockerfiles + nginx config
└── .github/        # CI/CD workflows
```

## Stack

| Concern | Technology |
|---------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS |
| Animation | Framer Motion, Three.js, React Three Fiber |
| Maps | Mapbox GL JS |
| Backend | NestJS, Prisma ORM |
| Database | PostgreSQL (Supabase) + PostGIS |
| Auth | Supabase Auth (OTP, Google, Apple) |
| Realtime | Supabase Realtime + NestJS WebSockets |
| Queue | BullMQ + Redis |
| Payments | Flutterwave (primary), Stripe (secondary) |
| i18n | next-intl (French default, English) |
| Currency | XOF (West African CFA franc) |
| Mobile | Flutter 3.x |
| Deploy | Vercel (frontends) + Railway (API) |

## Getting Started

### Prerequisites
- Node.js ≥ 20
- pnpm ≥ 9
- Docker Desktop (for local Redis)

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy and fill environment variables
cp .env.example .env

# 3. Start Redis locally
docker-compose up redis -d

# 4. Generate Prisma client
pnpm db:generate

# 5. Run migrations (requires DATABASE_URL in .env)
pnpm db:migrate

# 6. Seed development data
pnpm db:seed

# 7. Start all apps in parallel
pnpm dev
```

Individual apps:
```bash
# Customer web app
cd apps/web && pnpm dev        # → http://localhost:3000

# Admin dashboard
cd apps/admin && pnpm dev      # → http://localhost:3002

# Merchant portal
cd apps/merchant && pnpm dev   # → http://localhost:3003

# API server
cd apps/api && pnpm dev        # → http://localhost:3001
```

## Key Architectural Decisions

### Delivery State Machine
```
DRAFT → PENDING → ASSIGNED → RIDER_EN_ROUTE_PICKUP → AT_PICKUP
→ PICKED_UP → IN_TRANSIT → AT_DROPOFF → DELIVERED
                                      ↘ FAILED
                         ↘ CANCELLED
                         ↘ REFUNDED
```
State transitions are validated in `apps/api/src/modules/deliveries/deliveries-state-machine.service.ts`. Never update `status` directly — always go through this service.

### Pricing Engine
`base_fare + (distance_km × per_km_rate) × surge_multiplier + weight_surcharge + priority_premium + insurance_fee`

Surge multipliers live in Redis (`surge:{zone_slug}`) and are updated every 5 minutes by a BullMQ scheduled job. Round final fare to nearest 5 XOF.

### Wallet Atomicity
All wallet balance mutations use `prisma.$transaction` with `SELECT FOR UPDATE`. Never update wallet balance outside `wallets.service.ts`.

### Rider Location
Current position: Redis hash `rider:location:{riderId}` with 30s TTL.
History: async write to `rider_location_history` table via BullMQ.
Real-time client updates: Supabase Realtime channel `rider-location:{deliveryId}`.

### OTP for Delivery Confirmation
4-digit OTP generated at dispatch, bcrypt-hashed in DB, shown to customer. Rider must enter OTP from customer to complete delivery. Prevents false completion claims.

### i18n Routing
French (`fr`) is default locale — served at root path (`/`).
English uses `/en/*` prefix.
Managed by `next-intl` middleware in each Next.js app.

### Admin RBAC
Roles: `SUPER_ADMIN` > `OPS_ADMIN` > `FINANCE_ADMIN` > `SUPPORT_AGENT` > `VIEWER`
Enforced via `@Roles()` decorator + `RolesGuard` in NestJS.
Admin routes in Next.js protected by middleware checking Supabase session + admin role.

## Supabase Setup

1. Create a project at supabase.com
2. Enable PostGIS extension in Database → Extensions
3. Copy connection strings and keys to `.env`
4. Run migrations: `pnpm db:migrate`
5. Enable Realtime for tables: `deliveries`, `rider_location_history`

## Testing

```bash
# Unit tests
pnpm test

# E2E tests (requires running services)
pnpm test:e2e

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## Code Conventions

- All monetary values stored in XOF as integers (no decimals)
- Coordinates stored as `Decimal(10,8)` for lat, `Decimal(11,8)` for lng
- All API responses wrapped: `{ data: T, meta?: { page, total } }`
- Error responses: `{ error: { code, message, details? } }`
- Use `@rapide/types` enums everywhere — no raw strings for status values
- Translations: always use `useTranslations()` from next-intl, never hardcode French strings

## Environment Variables

See `.env.example` for the full list with descriptions. Required for local dev:
- `DATABASE_URL` + `DIRECT_DATABASE_URL` — Supabase PostgreSQL
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (API only)
- `REDIS_URL`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
