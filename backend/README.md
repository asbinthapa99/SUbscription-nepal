# FlowAI Nepal Backend API

TypeScript Express backend for FlowAI Nepal.

## Stack

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT auth
- Zod validation
- OpenAI server-side proxy
- Rate limiting

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Environment

Required:

```txt
DATABASE_URL
JWT_SECRET
CORS_ORIGIN
```

AI:

```txt
OPENAI_API_KEY
OPENAI_DEFAULT_MODEL
AI_MOCK_ENABLED
```

Use `AI_MOCK_ENABLED="true"` for local frontend work before real AI billing is ready.

## Routes

Health:

```txt
GET /health
```

Auth:

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Plans:

```txt
GET /api/plans
```

Services:

```txt
GET /api/services
```

Tools:

```txt
GET /api/tools
```

Service requests:

```txt
POST /api/service-requests
GET  /api/service-requests/admin
PATCH /api/service-requests/admin/:id/status
```

Subscription:

```txt
GET /api/subscription/current
```

Usage:

```txt
GET /api/usage/summary
```

AI:

```txt
POST /api/ai/chat
```

Payments:

```txt
POST /api/payments/initiate
POST /api/payments/verify-manual
```

Admin:

```txt
GET /api/admin/summary
GET /api/admin/users
GET /api/admin/subscriptions
GET /api/admin/payments
GET /api/admin/usage
GET /api/admin/plans
PUT /api/admin/plans
GET /api/admin/services
PUT /api/admin/services
GET /api/admin/tools
PUT /api/admin/tools
```

## Security Rules

- Never expose `OPENAI_API_KEY` to the frontend.
- AI requests require auth and active subscription.
- Usage limits are checked before AI calls.
- Payment verification is server-side only.
- Manual payment verification requires admin role.
- Pricing, service packages, and AI tools are backend-editable through admin routes.
