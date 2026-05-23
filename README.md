# Deshi Fiverr — Bangladesh Marketplace

A Next.js marketplace demo for buying and selling digital services (animations, software, courses, and more). Built with Next.js 15, React 19, Tailwind CSS 4, and Zustand.

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

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Production build (output in `.next/`) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |

## Project structure

- `app/` - App Router pages and layouts
- `components/` - UI sections and pages
- `lib/` - Utilities, metadata, Supabase clients
- `data/` - Sample categories, services, and sellers

## Deploy on Vercel

1. Framework Preset: Next.js
2. Build Command: `npm run build` (default)
3. Output Directory: leave empty (do not use `dist`)
4. Set Supabase env vars if using the database.

## Notes

- Front-end demo with mock data; Supabase is optional.
- Images load from Pexels CDN.
