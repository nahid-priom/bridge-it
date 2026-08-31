# Bridge IT Park — Digital Business Solutions

A Next.js platform for software, websites, digital marketing, and creative solutions. Built with Next.js 15, React 19, Tailwind CSS 4, Supabase, and Zustand.

## Requirements

- Node.js 20+
- npm 10+

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Brand assets

Official logo and favicon assets live under:

- `public/brand/` — full logo variants
- `public/icons/` — favicons and PWA icons
- `lib/config/brand-assets.ts` — centralized asset paths

## Environment

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
