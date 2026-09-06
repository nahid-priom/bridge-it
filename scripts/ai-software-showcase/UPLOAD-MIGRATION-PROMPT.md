# Phase D — Upload Migration Prompt (copy into Cursor Agent)

Use this prompt when local ingest shows `screen skip … (missing *.png)`.
Do **not** force-upload SVG screens as final AI assets.

---

## Context

Bridge IT Park software showcase. Pipeline:

1. Cursor GenerateImage → PNG in assets (exact filenames below)
2. `npm run ai:showcase:ingest -- --slug=<slug> --force`
3. `npm run upload:software-assets -- --force --slug=<slug>`

Design system for every screen:
- Deep navy `#0f2744` sidebar, controlled red `#c41e3a` accent, white content
- Same app shell per product (sidebar + header + modules)
- Realistic production ERP screenshot (NOT illustration / landing page)
- Readable for 40+, industry terminology, BDT where relevant
- No neon, glassmorphism, purple gradients, gibberish, lorem ipsum

Aspect ratio: **16:9** for all PNGs.

---

## BLOCK A — Generate these MISSING PNGs only (28 screens)

Do not regenerate covers unless asked. Covers already exist.

### ecommerce-admin-dashboard (ShopAdmin)
1. `ecommerce-admin-dashboard-orders.png` — Orders Management / order pipeline
2. `ecommerce-admin-dashboard-inventory.png` — Inventory / Stock
3. `ecommerce-admin-dashboard-courier.png` — Courier Management
4. `ecommerce-admin-dashboard-analytics.png` — Analytics

### garments-merchandising-management (MerchDesk)
5. `garments-merchandising-management-styles.png`
6. `garments-merchandising-management-inquiries.png`
7. `garments-merchandising-management-time-action-calendar.png`
8. `garments-merchandising-management-reports.png`

### garments-cutting-sewing-management (FloorOps)
9. `garments-cutting-sewing-management-dashboard.png`
10. `garments-cutting-sewing-management-cutting.png`
11. `garments-cutting-sewing-management-sewing.png`
12. `garments-cutting-sewing-management-wip.png`
13. `garments-cutting-sewing-management-reports.png`

### garments-inventory-warehouse (FabricStore)
14. `garments-inventory-warehouse-dashboard.png`
15. `garments-inventory-warehouse-fabric.png`
16. `garments-inventory-warehouse-trims.png`
17. `garments-inventory-warehouse-grn.png`
18. `garments-inventory-warehouse-reports.png`

### garments-hr-payroll (ApparelHR)
19. `garments-hr-payroll-dashboard.png`
20. `garments-hr-payroll-attendance.png`
21. `garments-hr-payroll-payroll.png`
22. `garments-hr-payroll-employees.png`
23. `garments-hr-payroll-reports.png`

### garments-commercial-export-management (ExportDesk)
24. `garments-commercial-export-management-dashboard.png`
25. `garments-commercial-export-management-lc.png`
26. `garments-commercial-export-management-shipment.png`
27. `garments-commercial-export-management-documents.png`
28. `garments-commercial-export-management-reports.png`

After GenerateImage: filenames must match exactly (no extra suffixes).

---

## BLOCK B — Ingest only the 6 products

```bash
for s in ecommerce-admin-dashboard garments-merchandising-management garments-cutting-sewing-management garments-inventory-warehouse garments-hr-payroll garments-commercial-export-management; do
  echo "=== INGEST $s ==="
  npm run ai:showcase:ingest -- --slug=$s --force
done
```

Expect lines like `orders ← ecommerce-admin-dashboard-orders.png (XXKB)` — **not** `screen skip`.

Validate:

```bash
npm run ai:showcase:validate
# Target: Ready 21/21
```

---

## BLOCK C — Force upload (live catalog)

Only after Ready 21/21:

```bash
for s in ecommerce-admin-dashboard garments-merchandising-management garments-cutting-sewing-management garments-inventory-warehouse garments-hr-payroll garments-commercial-export-management; do
  echo "=== UPLOAD $s ==="
  npm run upload:software-assets -- --force --slug=$s
done
```

Optional full re-push of all phase-1 gallery products (already AI; safe but slower):

```bash
for s in accounting-software ecommerce-management ecommerce-admin-operations facility-management-software furniture-manufacturing-erp gym-management hotel-management jewelry-erp microfinance-software ngo-management procurement-software professional-services-erp rental-management security-services-software travel-tourism-software; do
  npm run upload:software-assets -- --force --slug=$s
done
```

Final check:

```bash
npm run audit:software-visual
npm run ai:showcase:validate
```

---

## Rules

- Never upload when ingest still prints `screen skip … (missing …png)` for hero keys.
- Never use `generate-software-showcases` / SVG emergency for these finals.
- `--force` on upload bumps `asset_version` (cache bust) — required after visual replace.
- Do not change public slugs or delete published products.
