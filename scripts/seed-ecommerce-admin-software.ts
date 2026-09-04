/**
 * Seed E-commerce Admin software showcase products (idempotent).
 * Run: npx tsx scripts/seed-ecommerce-admin-software.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !key) {
  console.error('Missing Supabase env');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const PRODUCTS = [
  {
    slug: 'ecommerce-admin-dashboard',
    title: 'E-commerce Admin Dashboard',
    shortDescription: 'Run products, orders, inventory, courier and analytics from one admin.',
    featureSummary: 'Complete store operations — catalog, orders, stock, delivery and insights.',
    modules: ['Dashboard', 'Products', 'Orders', 'Inventory', 'Courier', 'Analytics'],
    screens: [
      { key: 'dashboard', name: 'Dashboard' },
      { key: 'products', name: 'Products' },
      { key: 'orders', name: 'Orders' },
      { key: 'inventory', name: 'Inventory' },
      { key: 'courier', name: 'Courier' },
      { key: 'analytics', name: 'Analytics' },
    ],
    sortOrder: 5,
  },
  {
    slug: 'ecommerce-admin-operations',
    title: 'E-commerce Operations Suite',
    shortDescription: 'Day-to-day ops for multi-channel Bangladesh e-commerce brands.',
    featureSummary: 'Orders, stock sync, courier handoff and settlement in one workflow.',
    modules: ['Orders Hub', 'Stock Sync', 'Courier Desk', 'Settlements', 'Customers', 'Reports'],
    screens: [
      { key: 'orders-hub', name: 'Orders Hub' },
      { key: 'stock-sync', name: 'Stock Sync' },
      { key: 'courier-desk', name: 'Courier Desk' },
      { key: 'settlements', name: 'Settlements' },
      { key: 'customers', name: 'Customers' },
      { key: 'reports', name: 'Reports' },
    ],
    sortOrder: 6,
  },
];

async function main() {
  const { data: main } = await supabase
    .from('showcase_main_categories')
    .select('id')
    .eq('slug', 'software')
    .maybeSingle();
  const { data: tax } = await supabase
    .from('showcase_categories')
    .select('id')
    .eq('slug', 'ecommerce-admin')
    .maybeSingle();
  const { data: child } = await supabase
    .from('showcase_child_categories')
    .select('id')
    .eq('slug', 'ecommerce-admin')
    .maybeSingle();

  if (!main?.id || !tax?.id || !child?.id) {
    console.error('Missing ecommerce-admin taxonomy rows');
    process.exit(1);
  }

  for (const product of PRODUCTS) {
    const { data: existing } = await supabase
      .from('software_projects')
      .select('id')
      .eq('slug', product.slug)
      .maybeSingle();

    let projectId = existing?.id as string | undefined;
    if (!projectId) {
      const { data: inserted, error } = await supabase
        .from('software_projects')
        .insert({
          title: product.title,
          slug: product.slug,
          short_description: product.shortDescription,
          feature_summary: product.featureSummary,
          full_description: `${product.shortDescription}\n\nBuilt for Bangladesh e-commerce teams who need a reliable admin alongside their storefront.`,
          main_category_id: main.id,
          taxonomy_category_id: tax.id,
          child_category_id: child.id,
          solution_group: 'business-automation',
          software_type: 'E-commerce Admin',
          platform_type: 'web',
          industry: 'E-commerce',
          business_type: 'Online store',
          primary_user: 'Store owners & ops teams',
          modules: product.modules,
          starting_price: 0,
          price_suffix: '+',
          currency: 'BDT',
          featured: true,
          popular: true,
          published: true,
          sort_order: product.sortOrder,
          seo_title: `${product.title} | Code Bondhu IT`,
          seo_description: product.shortDescription,
          seo_keywords: ['ecommerce admin', 'online store admin', 'order management Bangladesh'],
        })
        .select('id')
        .single();
      if (error) {
        console.error(product.slug, error.message);
        continue;
      }
      projectId = inserted.id;
      console.log('created', product.slug);
    } else {
      await supabase
        .from('software_projects')
        .update({
          main_category_id: main.id,
          taxonomy_category_id: tax.id,
          child_category_id: child.id,
          feature_summary: product.featureSummary,
          published: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);
      console.log('updated', product.slug);
    }

    const { count } = await supabase
      .from('software_product_features')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .is('deleted_at', null);

    if ((count ?? 0) === 0) {
      await supabase.from('software_product_features').insert(
        product.modules.map((title, index) => ({
          project_id: projectId,
          title,
          sort_order: (index + 1) * 10,
          is_primary: index < 3,
          published: true,
        }))
      );
    }

    const { count: screenCount } = await supabase
      .from('software_project_screens')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .is('deleted_at', null);

    if ((screenCount ?? 0) === 0) {
      await supabase.from('software_project_screens').insert(
        product.screens.map((screen, index) => ({
          project_id: projectId,
          screen_key: screen.key,
          screen_name: screen.name,
          module_name: screen.name,
          short_caption: screen.name,
          sort_order: (index + 1) * 10,
          is_featured: index === 0,
          published: true,
        }))
      );
      console.log('placeholder screens (upload covers in Admin)', product.slug);
    }
  }

  console.log('Done seeding ecommerce admin software');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
