# Gadget Selling Platform Monorepo

Apps and services:
- apps/web: Next.js admin + landing
- apps/mobile: Expo React Native app (Expo Router)
- supabase: Database schema, storage, RLS policies, edge functions
- packages/ui: Shared UI components
- packages/types: Shared TypeScript types

## Prerequisites
- Node.js 18+ and pnpm
- Supabase project (or Supabase CLI for local dev)
- Stripe account and CLI (optional for local webhooks)
- Expo account (for EAS and push notifications)

## Environment
Copy `.env.example` to `.env` at repo root and fill in keys. For Expo, EAS and the app can read from `EXPO_PUBLIC_*` variables.

## Install
```bash
pnpm install
```

## Develop
- Web: `pnpm dev:web` -> http://localhost:3000
- Mobile: `pnpm dev:mobile` -> Expo dev tools

## Supabase
- Apply SQL in `supabase/migrations` to your project (Dashboard -> SQL Editor)
- Create storage bucket `product-images` (public read)
- Deploy edge functions in `supabase/functions/*` (requires Supabase CLI)

## Stripe
- Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`
- Start webhook forwarding to Next.js: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## Deploy
- Web to Vercel. Set env vars in Vercel project settings
- Mobile with EAS. Configure `eas.json` and push notifications
