/**
 * Enrich software_product_features with icon_key, short_description, is_primary.
 * Idempotent upserts by project slug + title for flagships; heuristics for others.
 *
 * Run: npx tsx scripts/backfill-software-important-features.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {
  inferIconKeyFromTitle,
  inferShortDescription,
} from '../src/features/software-showcase/public/feature-icons';

config({ path: '.env.local' });
config({ path: '.env' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !key) {
  console.error('Missing Supabase env');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

/** Flagship important features (title, description, icon_key) — first 4 are primary. */
const FLAGSHIP: Record<
  string,
  Array<{ title: string; short_description: string; icon_key: string }>
> = {
  'ecommerce-admin-dashboard': [
    { title: 'Order Management', short_description: 'Track & manage orders', icon_key: 'shopping-cart' },
    { title: 'Inventory Sync', short_description: 'Real-time stock tracking', icon_key: 'warehouse' },
    { title: 'Customer Management', short_description: 'Manage customers easily', icon_key: 'users' },
    { title: 'Analytics & Reports', short_description: 'Business insights', icon_key: 'bar-chart-3' },
    { title: 'Courier Integration', short_description: 'Multi-courier delivery', icon_key: 'truck' },
    { title: 'Payments', short_description: 'Transactions & settlements', icon_key: 'wallet-cards' },
  ],
  'feed-mill-erp': [
    { title: 'Raw Material Stock', short_description: 'Bins, lots & tonnage', icon_key: 'warehouse' },
    { title: 'Formula Management', short_description: 'Recipes & cost per MT', icon_key: 'clipboard-list' },
    { title: 'Production', short_description: 'Daily mixer & batches', icon_key: 'factory' },
    { title: 'Dealer Sales', short_description: 'Orders & dispatch', icon_key: 'truck' },
    { title: 'Dealer Due', short_description: 'Credit & collections', icon_key: 'badge-dollar-sign' },
    { title: 'Accounts / P&L', short_description: 'Cost vs sales', icon_key: 'file-bar-chart' },
  ],
  'garments-erp': [
    { title: 'Sales Orders', short_description: 'Buyer styles & delivery', icon_key: 'shopping-cart' },
    { title: 'Production Tracking', short_description: 'Cutting to finishing', icon_key: 'factory' },
    { title: 'Costing', short_description: 'CM & style cost', icon_key: 'badge-dollar-sign' },
    { title: 'Ready Stock', short_description: 'Finished warehouse', icon_key: 'warehouse' },
    { title: 'Quality Control', short_description: 'AQL & defects', icon_key: 'file-bar-chart' },
    { title: 'Delivery / Billing', short_description: 'Shipment & invoice', icon_key: 'truck' },
  ],
};

async function upsertFlagship(projectId: string, slug: string) {
  const specs = FLAGSHIP[slug];
  if (!specs) return 0;

  const { data: existing } = await supabase
    .from('software_product_features')
    .select('id, title')
    .eq('project_id', projectId)
    .is('deleted_at', null);

  const byTitle = new Map((existing ?? []).map((r) => [String(r.title).toLowerCase(), r.id]));
  let touched = 0;

  for (let i = 0; i < specs.length; i++) {
    const spec = specs[i]!;
    const id = byTitle.get(spec.title.toLowerCase());
    const row = {
      project_id: projectId,
      title: spec.title,
      short_description: spec.short_description,
      icon_key: spec.icon_key,
      sort_order: (i + 1) * 10,
      is_primary: i < 4,
      published: true,
      deleted_at: null,
      updated_at: new Date().toISOString(),
    };
    if (id) {
      const { error } = await supabase.from('software_product_features').update(row).eq('id', id);
      if (error) console.error(slug, spec.title, error.message);
      else touched += 1;
    } else {
      const { error } = await supabase.from('software_product_features').insert(row);
      if (error) console.error(slug, spec.title, error.message);
      else touched += 1;
    }
  }
  return touched;
}

async function enrichExisting(projectId: string, slug: string) {
  const { data: rows } = await supabase
    .from('software_product_features')
    .select('id, title, short_description, icon_key, is_primary, sort_order')
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (!rows?.length) return 0;
  let updated = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!;
    const patch = {
      icon_key: row.icon_key || inferIconKeyFromTitle(String(row.title)),
      short_description:
        row.short_description || inferShortDescription(String(row.title)),
      is_primary: i < 4,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('software_product_features')
      .update(patch)
      .eq('id', row.id);
    if (!error) updated += 1;
  }
  console.log('enriched', slug, updated);
  return updated;
}

async function main() {
  const { data: projects, error } = await supabase
    .from('software_projects')
    .select('id, slug')
    .is('deleted_at', null)
    .eq('published', true);
  if (error) throw error;

  for (const p of projects ?? []) {
    const slug = String(p.slug);
    const id = String(p.id);
    if (FLAGSHIP[slug]) {
      const n = await upsertFlagship(id, slug);
      console.log('flagship', slug, n);
    } else {
      await enrichExisting(id, slug);
    }
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
