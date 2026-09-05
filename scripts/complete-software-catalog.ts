/**
 * Post-migration completion: orphans, related products, package feature quality.
 * Run: npx tsx scripts/complete-software-catalog.ts
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(url, key);

const PACKAGE_FEATURES: Record<
  string,
  Record<string, { features: string[]; short: string; size: string }>
> = {
  'feed-mill-erp': {
    starter: {
      size: 'small',
      short: 'For small feed mills starting digital control.',
      features: [
        'Raw material purchase',
        'Basic stock tracking',
        'Simple production batches',
        'Bag sales',
      ],
    },
    basic: {
      size: 'growing',
      short: 'For growing mills that need parties and dues.',
      features: [
        'Raw material purchase',
        'Stock and lot tracking',
        'Production batches',
        'Dealer and customer sales',
        'Due and expense tracking',
        'Basic reports',
      ],
    },
    standard: {
      size: 'growing',
      short: 'Complete daily feed mill operations.',
      features: [
        'Formula / BOM control',
        'Batch production with usage',
        'Finished feed stock',
        'Dealer sales and dispatch',
        'Cash and bank',
        'Customer and supplier ledger',
      ],
    },
    professional: {
      size: 'professional',
      short: 'Multi-user mills with warehouse and approvals.',
      features: [
        'Formula / BOM control',
        'QC assay before release',
        'Multi-warehouse stock',
        'Dealer network and credit',
        'Approval workflow',
        'Advanced accounts and audit',
      ],
    },
    enterprise: {
      size: 'enterprise',
      short: 'Full feed manufacturing ERP with planning.',
      features: [
        'Production planning and MRP',
        'QC and quality control',
        'Multi-branch / multi-warehouse',
        'Dealer network and sales team',
        'HR and payroll',
        'Management analytics',
      ],
    },
  },
  'garments-erp': {
    starter: {
      size: 'small',
      short: 'For small garment units tracking orders and stock.',
      features: ['Buyer and style orders', 'Basic production status', 'Fabric stock', 'Delivery tracking'],
    },
    basic: {
      size: 'growing',
      short: 'For factories adding cutting and sewing control.',
      features: [
        'Buyer and style orders',
        'Cutting and sewing tracking',
        'Fabric and trim stock',
        'Party due',
        'Basic costing',
        'Delivery',
      ],
    },
    standard: {
      size: 'growing',
      short: 'End-to-end garments ERP for daily production.',
      features: [
        'Merchandising and BOM',
        'Cut plan and line output',
        'Finishing and QC',
        'Ready stock',
        'Shipment packing',
        'Costing and accounts',
      ],
    },
    professional: {
      size: 'professional',
      short: 'Multi-line factories with commercial control.',
      features: [
        'Multi-line production planning',
        'Commercial and LC tracking',
        'Advanced costing',
        'User roles and approvals',
        'Warehouse control',
        'Audit history',
      ],
    },
    enterprise: {
      size: 'enterprise',
      short: 'Enterprise apparel operations with HR and automation.',
      features: [
        'Multi-factory planning',
        'Commercial and shipment automation',
        'HR and payroll',
        'Advanced accounts',
        'Management analytics',
        'Approval and audit controls',
      ],
    },
  },
};

const RELATED: Array<[string, string[]]> = [
  ['feed-mill-erp', ['inventory-warehouse-erp', 'distribution-management', 'crm-system', 'hr-payroll']],
  ['garments-erp', ['textile-erp', 'dyeing-management', 'inventory-warehouse-erp', 'hr-payroll']],
  ['manufacturing-erp', ['inventory-warehouse-erp', 'hr-payroll', 'crm-system']],
  ['hospital-management', ['pharmacy-management', 'diagnostic-center-management', 'clinic-management']],
  ['retail-pos', ['inventory-warehouse-erp', 'crm-system', 'hr-payroll']],
  ['restaurant-management', ['inventory-warehouse-erp', 'hr-payroll']],
  ['logistics-erp', ['courier-management', 'crm-system', 'inventory-warehouse-erp']],
  ['crm-system', ['sales-force-automation', 'hr-payroll']],
  ['real-estate-erp', ['construction-erp', 'hr-payroll']],
];

async function industryId(slug: string): Promise<string | null> {
  const { data } = await sb
    .from('catalog_industries')
    .select('id')
    .eq('category_root', 'software')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();
  return data?.id ?? null;
}

async function projectBySlug(slug: string) {
  const { data } = await sb
    .from('software_projects')
    .select('id, slug')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();
  return data;
}

async function fixOrphans() {
  const ecomId = await industryId('ecommerce');
  if (!ecomId) {
    console.warn('ecommerce industry missing');
    return;
  }
  for (const slug of ['ecommerce-admin-dashboard', 'ecommerce-admin-operations']) {
    const { data: p } = await sb
      .from('software_projects')
      .select('id, slug')
      .eq('slug', slug)
      .maybeSingle();
    if (!p) continue;
    const canonical = `/software/ecommerce/${slug}`;
    await sb
      .from('software_projects')
      .update({
        industry_id: ecomId,
        canonical_path: canonical,
        payment_type: 'one_time',
        updated_at: new Date().toISOString(),
      })
      .eq('id', p.id);
    await sb.from('catalog_url_redirects').upsert(
      {
        from_path: `/software/${slug}`,
        to_path: canonical,
        permanent: true,
        active: true,
      },
      { onConflict: 'from_path' }
    );
    // Ensure 5 packages
    const { count } = await sb
      .from('software_packages')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', p.id)
      .is('deleted_at', null);
    if ((count ?? 0) < 5) {
      const tiers = [
        { name: 'Starter', tier: 'starter', price: 25000, sort: 10, size: 'small' },
        { name: 'Basic', tier: 'basic', price: 45000, sort: 20, size: 'growing' },
        {
          name: 'Standard',
          tier: 'standard',
          price: 75000,
          sort: 30,
          size: 'growing',
          recommended: true,
        },
        { name: 'Professional', tier: 'professional', price: 150000, sort: 40, size: 'professional' },
        { name: 'Enterprise', tier: 'enterprise', price: 250000, sort: 50, size: 'enterprise' },
      ];
      await sb.from('software_packages').delete().eq('project_id', p.id);
      await sb.from('software_packages').insert(
        tiers.map((t) => ({
          project_id: p.id,
          name: t.name,
          tier: t.tier,
          price: t.price,
          currency: 'BDT',
          payment_type: 'one_time',
          target_business_size: t.size,
          short_description: `${t.name} e-commerce operations package`,
          features: [
            'Order management',
            'Inventory sync',
            'Customer list',
            'Sales reports',
            ...(t.tier === 'professional' || t.tier === 'enterprise'
              ? ['Multi-store', 'Advanced analytics']
              : ['Basic catalog']),
          ],
          is_recommended: Boolean(t.recommended),
          is_popular: t.tier === 'standard',
          badge: t.recommended ? 'Recommended' : t.tier === 'enterprise' ? 'Enterprise' : null,
          sort_order: t.sort,
          active: true,
        }))
      );
    }
    console.log('Fixed orphan', slug);
  }
}

async function improvePackageFeatures() {
  for (const [slug, byTier] of Object.entries(PACKAGE_FEATURES)) {
    const project = await projectBySlug(slug);
    if (!project) continue;
    const { data: pkgs } = await sb
      .from('software_packages')
      .select('id, tier, name')
      .eq('project_id', project.id)
      .is('deleted_at', null);
    for (const pkg of pkgs ?? []) {
      const key = String(pkg.tier || '').toLowerCase();
      const spec = byTier[key];
      if (!spec) continue;
      await sb
        .from('software_packages')
        .update({
          features: spec.features,
          short_description: spec.short,
          target_business_size: spec.size,
          payment_type: 'one_time',
          updated_at: new Date().toISOString(),
        })
        .eq('id', pkg.id);
    }
    console.log('Improved packages for', slug);
  }
}

async function seedRelated() {
  for (const [sourceSlug, relatedSlugs] of RELATED) {
    const source = await projectBySlug(sourceSlug);
    if (!source) continue;
    let order = 10;
    for (const relSlug of relatedSlugs) {
      const related = await projectBySlug(relSlug);
      if (!related) continue;
      await sb.from('catalog_related_products').upsert(
        {
          source_kind: 'software',
          source_id: source.id,
          related_kind: 'software',
          related_id: related.id,
          sort_order: order,
        },
        { onConflict: 'source_kind,source_id,related_kind,related_id' }
      );
      order += 10;
    }
    console.log('Related set for', sourceSlug);
  }
}

async function verify() {
  const { count: industries } = await sb
    .from('catalog_industries')
    .select('*', { count: 'exact', head: true })
    .eq('category_root', 'software')
    .eq('active', true)
    .is('deleted_at', null);
  const { count: orphans } = await sb
    .from('software_projects')
    .select('*', { count: 'exact', head: true })
    .is('industry_id', null)
    .eq('published', true)
    .is('deleted_at', null);
  const { data: feed } = await sb
    .from('software_packages')
    .select('tier, features')
    .eq(
      'project_id',
      (await projectBySlug('feed-mill-erp'))!.id
    )
    .eq('tier', 'standard')
    .maybeSingle();
  console.log(
    JSON.stringify(
      {
        industries,
        publishedOrphans: orphans,
        feedStandardFeatures: feed?.features,
      },
      null,
      2
    )
  );
}

async function main() {
  await fixOrphans();
  await improvePackageFeatures();
  await seedRelated();
  await verify();
  console.log('Catalog completion finished.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
