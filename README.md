# FlowAI Nepal

Nepal's premium AI subscriptions and services marketplace. Users pay in NPR via local payment providers (eSewa, Khalti, IME Pay) and get API-proxied access to AI tools, subscription plans, and managed AI services — no shared credentials, no raw key exposure.

---

## Project Structure

```
ai nepal/
├── frontend/    # Next.js 16 app (TypeScript + Tailwind CSS + shadcn/ui)
└── backend/     # Express + Prisma REST API (TypeScript + PostgreSQL)
```

---

## Frontend

### Stack

| Tool | Version |
|---|---|
| Next.js | 16.2 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| shadcn/ui | 4 |
| Framer Motion | 12 |
| Recharts | 3 |
| React Hook Form + Zod | latest |
| Sonner (toasts) | 2 |
| next-themes | 0.4 |

### Pages

| Route | Description |
|---|---|
| `/` | Public marketing homepage |
| `/pricing` | Subscription plans & pricing |
| `/services` | AI services catalog |
| `/tools` | AI tools listing |
| `/login` | User login |
| `/register` | User registration |
| `/forgot-password` | Password reset request |
| `/reset-password` | Password reset form |
| `/dashboard` | User dashboard |
| `/chat` | AI chat interface |
| `/billing` | Billing & payment history |
| `/subscriptions` | Subscription management |
| `/subscriptions/[slug]` | Subscription detail |
| `/profile` | User profile |
| `/settings` | Account settings |
| `/admin` | Admin panel |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### Dev Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev                         # http://localhost:3000
```

---

## Backend

### Stack

| Tool | Purpose |
|---|---|
| Node.js + Express | HTTP server |
| TypeScript | Type safety |
| Prisma | ORM |
| PostgreSQL | Database |
| JWT | Authentication |
| Zod | Schema validation |
| OpenAI SDK | AI proxy |
| Helmet + Rate Limit | Security |
| Nodemailer | Email (password reset) |

### API Routes

**Health**
```
GET  /health
```

**Auth**
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

**Plans / Services / Tools**
```
GET  /api/plans
GET  /api/services
GET  /api/tools
```

**Subscriptions**
```
GET  /api/subscription/current
```

**Usage**
```
GET  /api/usage/summary
```

**AI Chat (proxied)**
```
POST /api/ai/chat
```

**Payments**
```
POST /api/payments/initiate
POST /api/payments/verify-manual
```

**Service Requests**
```
POST  /api/service-requests
GET   /api/service-requests/admin
PATCH /api/service-requests/admin/:id/status
```

**Admin**
```
GET  /api/admin/summary
GET  /api/admin/users
GET  /api/admin/subscriptions
GET  /api/admin/payments
GET  /api/admin/usage
GET  /api/admin/plans
PUT  /api/admin/plans
GET  /api/admin/services
PUT  /api/admin/services
GET  /api/admin/tools
PUT  /api/admin/tools
```

### Dev Setup

```bash
cd backend
npm install
cp .env.example .env          # fill in required vars
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev                   # http://localhost:4000
```

### Environment Variables

```env
# Required
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flowai_nepal?schema=public
JWT_SECRET=replace-with-a-long-random-secret-min-24-chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# AI (set AI_MOCK_ENABLED=true for local dev without OpenAI billing)
OPENAI_API_KEY=
OPENAI_DEFAULT_MODEL=gpt-4.1-mini
AI_MOCK_ENABLED=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120

# Email (optional for password reset)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=FlowAI Nepal <no-reply@flowainepal.local>
```

### Database

```bash
npm run prisma:studio     # visual DB browser
npm run prisma:migrate    # apply migrations
npm run prisma:seed       # seed plans, services, tools
```

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| `id` | cuid | Primary key |
| `name` | String | |
| `email` | String | Unique |
| `passwordHash` | String | bcrypt |
| `role` | `USER` \| `ADMIN` | Default: USER |

### Plan
| Field | Type | Notes |
|---|---|---|
| `planType` | Enum | FREE / BASIC / PRO / PREMIUM / TEAM / DEVELOPER / ENTERPRISE |
| `priceNpr` | Int | Price in Nepali Rupees |
| `dailyPromptLimit` | Int | Max prompts per day |
| `monthlyTokenLimit` | Int | Max tokens per month |
| `allowedModels` | JSON | e.g. `["gpt-4.1-mini", "gpt-4o"]` |
| `includedTools` | JSON | List of tool keys |

### Subscription
| Field | Type | Notes |
|---|---|---|
| `planType` | Enum | Linked plan tier |
| `productSlug` | String? | For product-based subs (e.g. ChatGPT Plus) |
| `status` | Enum | ACTIVE / EXPIRED / CANCELLED / TRIAL |
| `durationMonths` | Int | Default: 1 |
| `startsAt` / `expiresAt` | DateTime | Subscription window |

### Payment
| Field | Type | Notes |
|---|---|---|
| `provider` | Enum | ESEWA / KHALTI / CONNECTIPS / MANUAL |
| `amountNpr` | Int | Amount paid in NPR |
| `status` | Enum | PENDING / PAID / FAILED / CANCELLED / REFUNDED / MANUAL_REVIEW |
| `transactionId` | String? | Unique, from payment provider |
| `verifiedAt` | DateTime? | Set on admin approval |

### UsageLog
| Field | Type | Notes |
|---|---|---|
| `provider` | Enum | OPENAI (extendable) |
| `model` | String | e.g. `gpt-4.1-mini` |
| `promptTokens` | Int | |
| `completionTokens` | Int | |
| `totalTokens` | Int | |
| `requestCount` | Int | Default: 1 |

### Other Models
- **`AiServicePackage`** — Managed AI service offerings with slug, category, starting price, and included tools.
- **`AiTool`** — Individual AI tools with key, category, accent colour, and external href.
- **`SubscriptionProduct`** — Specific product subscriptions (e.g. ChatGPT Plus, Midjourney) with multi-duration pricing stored as JSON.
- **`ServiceRequest`** — Inbound enquiries from users/guests for a specific service.
- **`SiteContent`** — Key-value CMS for admin-editable site content.
- **`PasswordResetToken`** — Single-use, expiring tokens for password reset emails.

---

## Plan Tiers

| Plan | Type | Target User |
|---|---|---|
| Free | FREE | Exploration / trial |
| Basic | BASIC | Casual users |
| Pro | PRO | Power users |
| Premium | PREMIUM | Heavy users |
| Team | TEAM | Small teams |
| Developer | DEVELOPER | API / integration builders |
| Enterprise | ENTERPRISE | Businesses |

All prices are in **NPR**. Limits (daily prompts + monthly tokens) and allowed models are set per plan and enforced server-side.

---

## Auth Flow

```
1. POST /api/auth/register  →  creates User, returns JWT
2. POST /api/auth/login     →  validates password hash, returns JWT
3. JWT stored as httpOnly cookie (credentials: "include" on all fetches)
4. GET /api/auth/me         →  returns current user from JWT payload
5. 401 response             →  frontend auto-redirects to /login?expired=true
```

**Password Reset:**
```
1. POST /api/auth/forgot-password  →  generates PasswordResetToken, emails link
2. POST /api/auth/reset-password   →  validates token (single-use, expiring), updates hash
```

---

## Payment Flow

```
1. User selects plan/product → POST /api/payments/initiate
   → creates Payment record (status: PENDING)

2. User completes payment via eSewa / Khalti / IME Pay / bank transfer

3. User submits transaction ID → POST /api/payments/verify-manual
   → sets Payment status to MANUAL_REVIEW

4. Admin reviews in /admin panel → PATCH approves or rejects
   → on approval: Payment status = PAID, Subscription created/extended
```

> Automated provider callbacks (webhooks) can replace step 3–4 in future — the `transactionId` field is already unique-indexed for idempotency.

---

## AI Proxy Flow

```
1. Frontend POST /api/ai/chat  { message, model? }
2. Backend checks:
   a. Valid JWT (authenticated user)
   b. Active subscription exists
   c. Daily prompt limit not exceeded
   d. Monthly token limit not exceeded
3. If AI_MOCK_ENABLED=true  →  returns mock response (no OpenAI billing)
4. Otherwise               →  proxies to OpenAI, streams response
5. UsageLog row written with token counts
```

The OpenAI API key **never leaves the server**. The frontend only ever calls `/api/ai/chat`.

---

## Frontend API Client

All API calls go through `src/lib/api/client.ts`:

- Base URL from `NEXT_PUBLIC_API_URL` env var (defaults to `http://localhost:4000`)
- Sends `credentials: "include"` on every request (httpOnly cookie auth)
- Parses JSON responses; falls back to raw text on parse failure
- On `401` → auto-redirects to `/login?expired=true` (except on public routes)
- Throws `Error` with server's `message` field for all non-OK responses

---

## Security Rules

- `OPENAI_API_KEY` is **never** exposed to the frontend.
- AI requests require a valid JWT and an active subscription.
- Usage limits are enforced server-side before every AI call.
- Payment verification is server-side only.
- Manual payment approval requires the `ADMIN` role.
- Plans, services, and tools are editable only via authenticated admin routes.

---

## Docs

- [Project Plan](./docs/project-plan.md)
- [UI Design Plan](./docs/ui-design-plan.md)
- [Frontend Architecture](./docs/frontend-architecture.md)
- [Premium Frontend Plan](./docs/premium-frontend-plan.md)
- [Subscription Plans](./docs/subscription-plans.md)
- [Admin Panel Plan](./docs/admin-panel-plan.md)
- [Payment Plan](./docs/payment-plan.md)
- [Testing & Deployment Plan](./docs/testing-deployment-plan.md)
- [Backend Plan](./docs/backend-later-plan.md)
- [AI Handoff Notes](./docs/ai-handoff.md)
