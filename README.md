# ShrinkVerse

Fast, friendly URL shortener built on Next.js 15 (App Router), MongoDB, and NextAuth.

- Shorten links instantly as a guest (links live for 15 days) or as a registered user (permanent).
- Custom aliases, link history, copy/visit/delete actions.
- Email/password auth and Google sign-in.
- Server-rendered redirects, abuse protection, SEO-friendly.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router, Server Components)
- [React 19](https://react.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- [NextAuth v4](https://next-auth.js.org/) (Credentials + Google)
- [Upstash Ratelimit](https://github.com/upstash/ratelimit) for abuse protection
- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) for CAPTCHA
- [Sentry](https://sentry.io/) for error tracking

## Getting started

### Prerequisites

- Node.js >= 20
- MongoDB connection string (Atlas free tier works fine)
- Google OAuth credentials (optional, for Google sign-in)

### Setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/<you>/shrinkverse.git
   cd shrinkverse
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in values:

   ```bash
   cp .env.example .env.local
   ```

   At minimum you need `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `NEXT_PUBLIC_BASE_URL`. The rest enable optional features (Google sign-in, rate limiting, CAPTCHA, error tracking, URL safety scanning).

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### Generating secrets

```bash
# NEXTAUTH_SECRET / IP_HASH_SALT
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Scripts

| Script           | Purpose                         |
| ---------------- | ------------------------------- |
| `npm run dev`    | Start dev server with Turbopack |
| `npm run build`  | Production build                |
| `npm start`      | Start production server         |
| `npm run lint`   | Run ESLint                      |
| `npm run format` | Run Prettier on the repo        |

## Project structure

```
src/
  app/                     # Next.js App Router pages and API routes
    api/
      auth/                # NextAuth + register endpoints
      url/                 # Shorten / list / get / delete
    [alias]/               # Server-side redirect handler
    about/ contact/ ...    # Static pages
    privacy/ terms/ abuse/ # Legal pages
  components/              # Reusable UI components
  context/                 # React context providers
  lib/                     # Server utilities (db, auth, rate limit, ...)
  models/                  # Mongoose models
```

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add every variable from `.env.example` in the Vercel project settings.
4. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` to your production URL.
5. Deploy.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the commit-message convention and dev workflow.

## License

MIT — see [LICENSE](LICENSE).
