/**
 * Seed differentiated package features for flagship software products.
 * Run: npx tsx scripts/seed-software-package-feature-ladders.ts
 *
 * Requires migration 20260919120000_software_package_features.sql applied.
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

type LadderFeature = {
  key: string;
  label: string;
  group: string;
  fromTier: Array<'starter' | 'basic' | 'standard' | 'professional' | 'enterprise'>;
  highlighted?: boolean;
};

const TIER_RANK: Record<string, number> = {
  starter: 1,
  basic: 2,
  standard: 3,
  professional: 4,
  enterprise: 5,
};

function includedFor(tier: string, feature: LadderFeature): boolean {
  const rank = TIER_RANK[tier] ?? 0;
  return feature.fromTier.some((t) => (TIER_RANK[t] ?? 99) <= rank);
}

/** Cumulative ladders — each tier includes all lower-tier capabilities. */
const LADDERS: Record<string, LadderFeature[]> = {
  'feed-mill-erp': [
    { key: 'purchase', label: 'Purchase', group: 'Purchase & Supplier', fromTier: ['starter'], highlighted: true },
    { key: 'raw-stock', label: 'Raw Material Stock', group: 'Inventory', fromTier: ['starter'], highlighted: true },
    { key: 'production', label: 'Production', group: 'Production', fromTier: ['starter'], highlighted: true },
    { key: 'sales', label: 'Sales', group: 'Sales', fromTier: ['starter'], highlighted: true },
    { key: 'customers', label: 'Customers', group: 'Sales', fromTier: ['basic'] },
    { key: 'suppliers', label: 'Suppliers', group: 'Purchase & Supplier', fromTier: ['basic'] },
    { key: 'due', label: 'Due Tracking', group: 'Accounts', fromTier: ['basic'] },
    { key: 'expenses', label: 'Expenses', group: 'Accounts', fromTier: ['basic'] },
    { key: 'basic-reports', label: 'Basic Reports', group: 'Reports', fromTier: ['basic'] },
    { key: 'finished-goods', label: 'Finished Goods', group: 'Inventory', fromTier: ['standard'], highlighted: true },
    { key: 'production-costing', label: 'Production Costing', group: 'Production', fromTier: ['standard'] },
    { key: 'cash', label: 'Cash', group: 'Accounts', fromTier: ['standard'] },
    { key: 'bank', label: 'Bank', group: 'Accounts', fromTier: ['standard'] },
    { key: 'customer-ledger', label: 'Customer Ledger', group: 'Accounts', fromTier: ['standard'] },
    { key: 'supplier-ledger', label: 'Supplier Ledger', group: 'Accounts', fromTier: ['standard'] },
    { key: 'dealer', label: 'Dealer', group: 'Sales', fromTier: ['professional'] },
    { key: 'warehouse', label: 'Warehouse', group: 'Inventory', fromTier: ['professional'] },
    { key: 'approval', label: 'Approval', group: 'Administration', fromTier: ['professional'] },
    { key: 'user-roles', label: 'User Roles', group: 'Administration', fromTier: ['professional'] },
    { key: 'advanced-accounts', label: 'Advanced Accounts', group: 'Accounts', fromTier: ['professional'] },
    { key: 'audit-log', label: 'Audit Log', group: 'Administration', fromTier: ['professional'] },
    { key: 'bom', label: 'BOM', group: 'Production', fromTier: ['enterprise'] },
    { key: 'production-planning', label: 'Production Planning', group: 'Production', fromTier: ['enterprise'] },
    { key: 'qc', label: 'QC', group: 'Production', fromTier: ['enterprise'] },
    { key: 'multi-warehouse', label: 'Multi-Warehouse', group: 'Inventory', fromTier: ['enterprise'] },
    { key: 'dealer-network', label: 'Dealer Network', group: 'Sales', fromTier: ['enterprise'] },
    { key: 'hr', label: 'HR', group: 'Enterprise Automation', fromTier: ['enterprise'] },
    { key: 'payroll', label: 'Payroll', group: 'Enterprise Automation', fromTier: ['enterprise'] },
    { key: 'automation', label: 'Automation', group: 'Enterprise Automation', fromTier: ['enterprise'] },
    { key: 'analytics', label: 'Analytics', group: 'Reports', fromTier: ['enterprise'] },
  ],
  'garments-erp': [
    { key: 'order-booking', label: 'Order Booking', group: 'Sales', fromTier: ['starter'], highlighted: true },
    { key: 'style-master', label: 'Style Master', group: 'Production', fromTier: ['starter'], highlighted: true },
    { key: 'cutting', label: 'Cutting', group: 'Production', fromTier: ['starter'] },
    { key: 'sewing', label: 'Sewing Output', group: 'Production', fromTier: ['starter'], highlighted: true },
    { key: 'merchandising', label: 'Merchandising', group: 'Purchase & Supplier', fromTier: ['basic'] },
    { key: 'trim-stock', label: 'Trim Stock', group: 'Inventory', fromTier: ['basic'] },
    { key: 'party-ledger', label: 'Party Ledger', group: 'Accounts', fromTier: ['basic'] },
    { key: 'basic-reports', label: 'Basic Reports', group: 'Reports', fromTier: ['basic'] },
    { key: 'finishing', label: 'Finishing & Packing', group: 'Production', fromTier: ['standard'], highlighted: true },
    { key: 'shipment', label: 'Shipment', group: 'Sales', fromTier: ['standard'] },
    { key: 'fabric-stock', label: 'Fabric Stock', group: 'Inventory', fromTier: ['standard'] },
    { key: 'accounts', label: 'Accounts', group: 'Accounts', fromTier: ['standard'] },
    { key: 'line-efficiency', label: 'Line Efficiency', group: 'Reports', fromTier: ['professional'] },
    { key: 'qc', label: 'QC', group: 'Production', fromTier: ['professional'] },
    { key: 'user-roles', label: 'User Roles', group: 'Administration', fromTier: ['professional'] },
    { key: 'approval', label: 'Approval', group: 'Administration', fromTier: ['professional'] },
    { key: 'planning', label: 'Production Planning', group: 'Production', fromTier: ['enterprise'] },
    { key: 'multi-factory', label: 'Multi-Factory', group: 'Enterprise Automation', fromTier: ['enterprise'] },
    { key: 'hr', label: 'HR', group: 'Enterprise Automation', fromTier: ['enterprise'] },
    { key: 'analytics', label: 'Analytics', group: 'Reports', fromTier: ['enterprise'] },
  ],
  'manufacturing-erp': [
    { key: 'purchase', label: 'Purchase', group: 'Purchase & Supplier', fromTier: ['starter'], highlighted: true },
    { key: 'stock', label: 'Stock', group: 'Inventory', fromTier: ['starter'], highlighted: true },
    { key: 'production', label: 'Production', group: 'Production', fromTier: ['starter'], highlighted: true },
    { key: 'sales', label: 'Sales', group: 'Sales', fromTier: ['starter'] },
    { key: 'parties', label: 'Customers & Suppliers', group: 'Sales', fromTier: ['basic'] },
    { key: 'expenses', label: 'Expenses', group: 'Accounts', fromTier: ['basic'] },
    { key: 'basic-reports', label: 'Basic Reports', group: 'Reports', fromTier: ['basic'] },
    { key: 'bom', label: 'BOM', group: 'Production', fromTier: ['standard'], highlighted: true },
    { key: 'costing', label: 'Costing', group: 'Accounts', fromTier: ['standard'] },
    { key: 'warehouse', label: 'Warehouse', group: 'Inventory', fromTier: ['standard'] },
    { key: 'ledgers', label: 'Party Ledgers', group: 'Accounts', fromTier: ['standard'] },
    { key: 'planning', label: 'Production Planning', group: 'Production', fromTier: ['professional'] },
    { key: 'qc', label: 'QC', group: 'Production', fromTier: ['professional'] },
    { key: 'roles', label: 'User Roles', group: 'Administration', fromTier: ['professional'] },
    { key: 'audit', label: 'Audit Log', group: 'Administration', fromTier: ['professional'] },
    { key: 'multi-plant', label: 'Multi-Plant', group: 'Enterprise Automation', fromTier: ['enterprise'] },
    { key: 'hr', label: 'HR & Payroll', group: 'Enterprise Automation', fromTier: ['enterprise'] },
    { key: 'automation', label: 'Automation', group: 'Enterprise Automation', fromTier: ['enterprise'] },
    { key: 'analytics', label: 'Analytics', group: 'Reports', fromTier: ['enterprise'] },
  ],
  'hospital-management': [
    { key: 'patients', label: 'Patients', group: 'Operations', fromTier: ['starter'], highlighted: true },
    { key: 'appointments', label: 'Appointments', group: 'Operations', fromTier: ['starter'], highlighted: true },
    { key: 'billing', label: 'Billing', group: 'Accounts', fromTier: ['starter'], highlighted: true },
    { key: 'pharmacy', label: 'Pharmacy Stock', group: 'Inventory', fromTier: ['basic'] },
    { key: 'lab', label: 'Lab Orders', group: 'Operations', fromTier: ['basic'] },
    { key: 'due', label: 'Due Collection', group: 'Accounts', fromTier: ['basic'] },
    { key: 'reports', label: 'Basic Reports', group: 'Reports', fromTier: ['basic'] },
    { key: 'ipd', label: 'IPD / Beds', group: 'Operations', fromTier: ['standard'], highlighted: true },
    { key: 'ot', label: 'OT Schedule', group: 'Operations', fromTier: ['standard'] },
    { key: 'accounts', label: 'Accounts', group: 'Accounts', fromTier: ['standard'] },
    { key: 'inventory', label: 'Hospital Inventory', group: 'Inventory', fromTier: ['standard'] },
    { key: 'roles', label: 'User Roles', group: 'Administration', fromTier: ['professional'] },
    { key: 'approvals', label: 'Approvals', group: 'Administration', fromTier: ['professional'] },
    { key: 'multi-branch', label: 'Multi-Branch', group: 'Enterprise Automation', fromTier: ['enterprise'] },
    { key: 'hr', label: 'HR & Payroll', group: 'Enterprise Automation', fromTier: ['enterprise'] },
    { key: 'analytics', label: 'Analytics', group: 'Reports', fromTier: ['enterprise'] },
  ],
};

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error('Missing supabase env');

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const slugs = Object.keys(LADDERS);

  const { data: projects, error } = await supabase
    .from('software_projects')
    .select('id, slug')
    .in('slug', slugs)
    .is('deleted_at', null);
  if (error) throw error;

  for (const project of projects ?? []) {
    const ladder = LADDERS[project.slug];
    if (!ladder) continue;

    const { data: pkgs, error: pkgErr } = await supabase
      .from('software_packages')
      .select('id, tier, name')
      .eq('project_id', project.id)
      .eq('active', true)
      .is('deleted_at', null);
    if (pkgErr) throw pkgErr;

    for (const pkg of pkgs ?? []) {
      const tier = String(pkg.tier ?? '').toLowerCase();
      if (!TIER_RANK[tier]) {
        console.warn(`skip ${project.slug} package ${pkg.name}: unknown tier ${tier}`);
        continue;
      }

      await supabase
        .from('software_package_features')
        .update({ deleted_at: new Date().toISOString() })
        .eq('package_id', pkg.id)
        .is('deleted_at', null);

      const rows = ladder.map((feature, index) => ({
        package_id: pkg.id,
        feature_key: feature.key,
        label: feature.label,
        feature_group: feature.group,
        is_included: includedFor(tier, feature),
        is_highlighted: Boolean(feature.highlighted && includedFor(tier, feature)),
        display_order: (index + 1) * 10,
        deleted_at: null,
        updated_at: new Date().toISOString(),
      }));

      const { error: insertErr } = await supabase.from('software_package_features').insert(rows);
      if (insertErr) throw insertErr;

      const includedLabels = rows.filter((r) => r.is_included).map((r) => r.label);
      await supabase
        .from('software_packages')
        .update({ features: includedLabels, updated_at: new Date().toISOString() })
        .eq('id', pkg.id);

      console.log(`${project.slug} / ${tier}: ${includedLabels.length} included features`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
