# Software showcase assets — remaining work

## Generated locally (this refactor)

| Product | Local path | Notes |
|---------|------------|--------|
| E-commerce Admin Dashboard | `seed-assets/software/ecommerce-admin-dashboard/screens/` | Dashboard from ImageGen + engine screens |
| Feed Mill ERP | `seed-assets/software/feed-mill-erp/screens/` | Dashboard from ImageGen + engine screens |
| Garments ERP | `seed-assets/software/garments-erp/screens/` | Dashboard from ImageGen + engine screens |

Manifest: [`docs/software-image-generation-manifest.json`](../docs/software-image-generation-manifest.json)

## Force regenerate + replace everything (one command)

Requires `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

```bash
# All software products: regenerate screens, upload, bump asset_version (replaces live URLs)
npm run software:force-refresh

# One product only
npm run software:force-refresh -- --slug=garments-erp

# Preview uploads without writing
npm run software:force-refresh -- --dry-run
```

What it does:
1. `generate-software-showcases.ts --force --screens-only` → local AVIFs under `seed-assets/software/`
2. Optionally overlays ImageGen dashboards if PNGs exist in Cursor assets
3. `upload-software-assets.ts --force` → upserts Storage + updates DB + **bumps `asset_version`** so caches bust


## Apply DB migrations

```bash
supabase db push
# or apply:
# 20260922120000_merge_garments_feed_mill_packages.sql
# 20260922120100_premium_screen_slots.sql
```

## Remaining products needing ImageGen / engine refresh

All other published software products still use prior `seed-assets/software/{slug}` screens. Priority refresh candidates:

- poultry-management-erp
- manufacturing-erp
- dealership-management
- retail-pos
- hospital-management
- school-management
- inventory-warehouse-erp
- garments-accessories-erp
- specialized feed/garments tools under industry pages

Extend the JSON manifest and regenerate with:

```bash
npx tsx scripts/generate-software-showcases.ts --slug=<slug> --screens-only --force
```
