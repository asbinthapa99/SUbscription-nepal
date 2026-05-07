# FlowAI Nepal Frontend

A modern Next.js 16+ frontend for FlowAI Nepal - Premium AI tools for Nepali students, developers, and freelancers. Pay in NPR via eSewa, Khalti, or IME Pay.

## Features

- **Modern Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Authentication**: Email/password signup, login, password reset with dev email flow
- **User Profile**: Protected routes, user dropdown, session management
- **Marketing Pages**: Hero section, pricing, services, tools showcase
- **Payment Integration Ready**: Subscription plans and payment flows
- **Design System**: shadcn/ui components with custom Nepali color palette

## Quick Start

### Prerequisites

- Node.js 18+ (verify with `node --version`)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL (default: http://localhost:4000)
```

### Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### Build & Run Production

```bash
npm run build
npm run start
```

## Environment Variables

Create `.env.local`:

```env
# Backend API endpoint
NEXT_PUBLIC_API_URL=http://localhost:4000

# Optional: Frontend domain for password reset emails
# FRONTEND_URL=http://localhost:3000
```

## Key Pages

| Page | Path | Auth Required | Purpose |
|------|------|---------------|---------|
| Home | `/` | No | Marketing homepage |
| Login | `/login` | No | Sign in with email/password |
| Register | `/register` | No | Create new account |
| Forgot Password | `/forgot-password` | No | Request password reset token |
| Reset Password | `/reset-password?token=...` | No | Set new password |
| Profile | `/profile` | Yes | User account details (redirects to `/login` if not authenticated) |
| Pricing | `/pricing` | No | Subscription plans |
| Services | `/services` | No | AI services showcase |
| Tools | `/tools` | No | Available tools |

## Authentication Flow

### Sign Up / Sign In

1. User submits email + password at `/register` or `/login`
2. Frontend sends request to `POST /api/auth/register` or `POST /api/auth/login`
3. Backend validates and returns `{ user, token }` + sets HttpOnly `token` cookie
4. Frontend stores token in AuthProvider state (cookie-aware)
5. Navbar shows user name; login/register buttons hidden
6. User can access `/profile` (protected)

### Password Reset

1. User visits `/forgot-password` and submits email
2. Frontend POST to `POST /api/auth/forgot` (backend creates reset token, sends email via dev mailer)
3. Email contains link: `http://localhost:3000/reset-password?token=<reset-token>`
4. User clicks link, sees reset form
5. Submits new password to `POST /api/auth/reset { token, password }`
6. Token is marked as used, user can now sign in with new password

### Logout

- Click "Log out" in navbar user dropdown
- Frontend calls `POST /api/auth/logout`
- Backend clears HttpOnly cookie
- Redirects to `/`

## Development Notes

### Component Structure

- `src/app/` — Next.js pages and layouts
- `src/components/` — React components (layout, marketing sections, UI)
- `src/context/` — React context (AuthProvider for auth state)
- `src/lib/` — Utilities (API client, formatters, UI helpers)
- `src/types/` — TypeScript type definitions
- `src/app/globals.css` — Global styles, Tailwind directives, animations

### API Client

The frontend API client is in `src/lib/api/auth.ts`:

```typescript
import authApi from "@/lib/api/auth";

// Sign up
await authApi.apiRegister({ name, email, password });

// Sign in
await authApi.apiLogin({ email, password });

// Get current user (uses cookie)
await authApi.apiMe();

// Reset password
await authApi.apiResetPassword(token, password);
```

### Auth Provider

Access auth state in any component using `useAuth()`:

```typescript
import { useAuth } from "@/context/AuthProvider";

export function MyComponent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <button onClick={() => /* navigate to login */ }>Sign in</button>;
  
  return <div>Welcome, {user.name}!</div>;
}
```

## Styling & Design System

- **Colors**: Nepali Crimson (#dc143c), Himalayan Blue (#1e6fbf), Success Green (#10b981)
- **Typography**: Manrope (headings), Inter (body), JetBrains Mono (code)
- **Components**: shadcn/ui (Card, Button, Input, etc.)
- **Tailwind CSS 4**: PostCSS with custom utilities
- **Animations**: Aurora, float, and custom entrance animations

## Linting

```bash
npm run lint
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set `NEXT_PUBLIC_API_URL` environment variable in Vercel dashboard.

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json . && npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t flowainepal-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.example.com flowainepal-frontend
```

## Troubleshooting

### Auth not working

- Check backend is running on `NEXT_PUBLIC_API_URL` (default: `http://localhost:4000`)
- Verify `/api/auth/me` responds with user data
- Check browser cookies (look for `token` cookie set by backend)
- Clear browser cache and localStorage (`auth_token_v1`)

### Styles not loading

- Run `npm install` to ensure Tailwind dependencies are installed
- Clear `.next/` folder: `rm -rf .next && npm run dev`
- Verify `postcss.config.mjs` and `tailwind.config.ts` are present

### Pages not redirecting

- Check `useRouter()` is from `next/navigation` (not `next/router`)
- Verify AuthProvider wraps the app (in `src/app/layout.tsx`)

## Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -am 'Add feature'`
4. Push: `git push origin feature/my-feature`
5. Open a PR

## License

MIT

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation in `docs/`
- Contact: support@flowainepal.local

