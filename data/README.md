# Demo data (seed only)

Runtime app code must **not** import from this folder except:

- `heroContent.ts` — marketing hero copy
- `testimonials.ts` — section headings (review bodies come from Supabase)

All catalog, search, admin, and dashboard data is loaded via `lib/db/*` and `lib/catalog/*`.

Seed source files live in `archive/demo-data/`. Run:

```bash
npm run seed:supabase
```
