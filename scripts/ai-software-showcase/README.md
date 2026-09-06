# AI Software Showcase Pipeline

Production path for premium catalog visuals (replaces procedural SVG as the default).

## Flow

```
Catalog SSOT (src/features/software-showcase/seed/)
  → hero-registry.ts (phase targets)
  → Cursor GenerateImage / external PNGs in assets/
  → ingest-ai-assets.ts (AVIF + design-manifest)
  → upload-software-assets.ts (Storage + DB)
  → public showcase
```

## Commands

```bash
npm run ai:showcase:plan -- --missing-only --dry-run
npm run ai:showcase:validate
npm run ai:showcase:ingest -- --slug=hotel-management --force
npm run upload:software-assets -- --force --slug=hotel-management
npm run audit:software-visual
```

CLI flags: `--slug=`, `--industry=`, `--covers-only`, `--screens-only`, `--priority-screens`, `--missing-only`, `--force`, `--dry-run`, `--validate-only`.

## SVG emergency

`generate-software-showcases.ts` is AI-primary by default. Use `--allow-svg-emergency` only for temporary local fills. Do not ship SVG-looking assets as final approved product visuals.

## Phase registry

See `config/hero-registry.ts` for SVG cover upgrades and gallery-missing products.

## Upload migration (Phase D)

If ingest prints `screen skip (missing *.png)`, generate those PNGs first.
Copy-paste agent prompt: [`UPLOAD-MIGRATION-PROMPT.md`](./UPLOAD-MIGRATION-PROMPT.md).
