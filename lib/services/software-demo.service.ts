import type {
  SoftwareDemoConfig,
  SoftwareDemoMetrics,
  SoftwareDemoModule,
  SoftwareDemoSessionSnapshot,
  SoftwareFeatureFlags,
} from '@/types/bitp';
import { getServerClient } from '@/lib/services/client';

type SeedData = {
  products?: { sku: string; name: string; type: string; qty: number; cost: number; price: number }[];
  parties?: { type: string; name: string; balance: number }[];
  boms?: { name: string; finished: string; lines: { raw: string; qty: number }[] }[];
};

export async function getSoftwareDemoConfigBySlug(demoSlug: string): Promise<SoftwareDemoConfig | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  const { data: product } = await supabase
    .from('products')
    .select('id, name, slug, starting_price, currency, demo_url, internal_demo_slug, target_customer')
    .eq('internal_demo_slug', demoSlug)
    .eq('status', 'published')
    .maybeSingle();

  if (!product) return null;

  const { data: config } = await supabase
    .from('software_demo_configs')
    .select('*')
    .eq('product_id', product.id)
    .eq('active', true)
    .maybeSingle();

  if (!config) return null;

  const { data: modules } = await supabase
    .from('software_demo_modules')
    .select('*')
    .eq('demo_config_id', config.id)
    .eq('active', true)
    .order('sort_order');

  return {
    ...(config as SoftwareDemoConfig),
    feature_flags: (config.feature_flags ?? {}) as SoftwareFeatureFlags,
    workflow_config: Array.isArray(config.workflow_config) ? config.workflow_config : [],
    product: product as SoftwareDemoConfig['product'],
    modules: (modules ?? []) as SoftwareDemoModule[],
  };
}

async function logActivity(
  supabase: NonNullable<Awaited<ReturnType<typeof getServerClient>>>,
  configId: string,
  sessionId: string,
  actionType: string,
  summary: string,
  entityType?: string,
  entityId?: string
) {
  await supabase.from('software_demo_activity_log').insert({
    demo_config_id: configId,
    session_id: sessionId,
    action_type: actionType,
    entity_type: entityType ?? null,
    entity_id: entityId ?? null,
    summary,
    is_demo: true,
  });
}

export async function initSoftwareDemoSession(
  configId: string,
  sessionId: string,
  businessType: string
): Promise<{ initialized: boolean }> {
  const supabase = await getServerClient();
  if (!supabase) return { initialized: false };

  const { data: existing } = await supabase
    .from('software_demo_sessions')
    .select('id, initialized')
    .eq('demo_config_id', configId)
    .eq('session_id', sessionId)
    .maybeSingle();

  if (existing?.initialized) return { initialized: true };

  if (!existing) {
    await supabase.from('software_demo_sessions').insert({
      demo_config_id: configId,
      session_id: sessionId,
      business_type: businessType,
      initialized: false,
    });
  }

  const { data: seedSet } = await supabase
    .from('software_demo_seed_sets')
    .select('seed_data')
    .eq('business_type', businessType)
    .eq('active', true)
    .maybeSingle();

  const seed = (seedSet?.seed_data ?? {}) as SeedData;

  for (const p of seed.products ?? []) {
    await supabase.from('software_demo_products').insert({
      demo_config_id: configId,
      session_id: sessionId,
      sku: p.sku,
      name: p.name,
      product_type: p.type,
      opening_qty: p.qty,
      current_qty: p.qty,
      unit_cost: p.cost,
      sale_price: p.price,
      is_demo: true,
    });
  }

  for (const party of seed.parties ?? []) {
    await supabase.from('software_demo_parties').insert({
      demo_config_id: configId,
      session_id: sessionId,
      party_type: party.type,
      name: party.name,
      balance: party.balance,
      is_demo: true,
    });
  }

  if (seed.boms?.length) {
    const { data: products } = await supabase
      .from('software_demo_products')
      .select('id, sku')
      .eq('demo_config_id', configId)
      .eq('session_id', sessionId);

    const skuMap = Object.fromEntries((products ?? []).map((p) => [p.sku, p.id]));

    for (const bom of seed.boms) {
      const fgId = skuMap[bom.finished];
      if (!fgId) continue;
      const { data: bomRow } = await supabase
        .from('software_demo_boms')
        .insert({
          demo_config_id: configId,
          session_id: sessionId,
          finished_product_id: fgId,
          name: bom.name,
          batch_size: 1,
          is_demo: true,
        })
        .select('id')
        .single();

      if (bomRow) {
        for (const line of bom.lines) {
          const rawId = skuMap[line.raw];
          if (rawId) {
            await supabase.from('software_demo_bom_lines').insert({
              bom_id: bomRow.id,
              raw_product_id: rawId,
              quantity_per_batch: line.qty,
            });
          }
        }
      }
    }
  }

  await supabase
    .from('software_demo_sessions')
    .update({ initialized: true })
    .eq('demo_config_id', configId)
    .eq('session_id', sessionId);

  await logActivity(supabase, configId, sessionId, 'init', 'Demo session initialized with sample data');

  return { initialized: true };
}

export async function getSoftwareDemoSnapshot(
  configId: string,
  sessionId: string
): Promise<SoftwareDemoSessionSnapshot> {
  const supabase = await getServerClient();
  const empty: SoftwareDemoSessionSnapshot = {
    products: [],
    parties: [],
    purchases: [],
    sales: [],
    payments: [],
    expenses: [],
    boms: [],
    productionOrders: [],
    requisitions: [],
    salesOrders: [],
    activity: [],
    metrics: {
      totalProducts: 0,
      totalStockValue: 0,
      totalSales: 0,
      totalPurchases: 0,
      totalDue: 0,
      totalExpenses: 0,
      lowStockCount: 0,
      profitEstimate: 0,
    },
  };
  if (!supabase) return empty;

  const [
    productsRes,
    partiesRes,
    purchasesRes,
    salesRes,
    paymentsRes,
    expensesRes,
    bomsRes,
    productionRes,
    requisitionsRes,
    salesOrdersRes,
    activityRes,
  ] = await Promise.all([
    supabase.from('software_demo_products').select('*').eq('demo_config_id', configId).eq('session_id', sessionId).order('name'),
    supabase.from('software_demo_parties').select('*').eq('demo_config_id', configId).eq('session_id', sessionId),
    supabase.from('software_demo_purchases').select('*').eq('demo_config_id', configId).eq('session_id', sessionId).order('created_at', { ascending: false }),
    supabase.from('software_demo_sales').select('*').eq('demo_config_id', configId).eq('session_id', sessionId).order('created_at', { ascending: false }),
    supabase.from('software_demo_payments').select('id, payment_type, amount, created_at').eq('demo_config_id', configId).eq('session_id', sessionId).order('created_at', { ascending: false }),
    supabase.from('software_demo_expenses').select('id, category, amount, created_at').eq('demo_config_id', configId).eq('session_id', sessionId).order('created_at', { ascending: false }),
    supabase.from('software_demo_boms').select('*, lines:software_demo_bom_lines(*)').eq('demo_config_id', configId).eq('session_id', sessionId),
    supabase.from('software_demo_production_orders').select('*').eq('demo_config_id', configId).eq('session_id', sessionId).order('created_at', { ascending: false }),
    supabase.from('software_demo_requisitions').select('id, reference_no, department, amount, status').eq('demo_config_id', configId).eq('session_id', sessionId),
    supabase.from('software_demo_sales_orders').select('id, reference_no, total_amount, status').eq('demo_config_id', configId).eq('session_id', sessionId),
    supabase.from('software_demo_activity_log').select('id, action_type, summary, created_at').eq('demo_config_id', configId).eq('session_id', sessionId).order('created_at', { ascending: false }).limit(20),
  ]);

  const products = (productsRes.data ?? []) as SoftwareDemoSessionSnapshot['products'];
  const sales = (salesRes.data ?? []) as SoftwareDemoSessionSnapshot['sales'];
  const purchases = (purchasesRes.data ?? []) as SoftwareDemoSessionSnapshot['purchases'];
  const expenses = expensesRes.data ?? [];

  const totalSales = sales.reduce((s, r) => s + Number(r.total_amount), 0);
  const totalPurchases = purchases.reduce((s, r) => s + Number(r.total_amount), 0);
  const totalExpenses = expenses.reduce((s, r) => s + Number(r.amount), 0);
  const totalDue = sales.reduce((s, r) => s + Number(r.due_amount), 0);
  const totalStockValue = products.reduce((s, p) => s + Number(p.current_qty) * Number(p.unit_cost), 0);
  const lowStockCount = products.filter((p) => Number(p.current_qty) < 10 && p.product_type !== 'raw').length;

  return {
    products,
    parties: (partiesRes.data ?? []) as SoftwareDemoSessionSnapshot['parties'],
    purchases,
    sales,
    payments: paymentsRes.data ?? [],
    expenses,
    boms: (bomsRes.data ?? []) as SoftwareDemoSessionSnapshot['boms'],
    productionOrders: (productionRes.data ?? []) as SoftwareDemoSessionSnapshot['productionOrders'],
    requisitions: requisitionsRes.data ?? [],
    salesOrders: salesOrdersRes.data ?? [],
    activity: activityRes.data ?? [],
    metrics: {
      totalProducts: products.length,
      totalStockValue,
      totalSales,
      totalPurchases,
      totalDue,
      totalExpenses,
      lowStockCount,
      profitEstimate: totalSales - totalPurchases - totalExpenses,
    },
  };
}

function refNo(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

export async function addSoftwareDemoProduct(input: {
  configId: string;
  sessionId: string;
  sku: string;
  name: string;
  productType: string;
  openingQty: number;
  unitCost: number;
  salePrice: number;
}) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  const { data, error } = await supabase
    .from('software_demo_products')
    .insert({
      demo_config_id: input.configId,
      session_id: input.sessionId,
      sku: input.sku,
      name: input.name,
      product_type: input.productType,
      opening_qty: input.openingQty,
      current_qty: input.openingQty,
      unit_cost: input.unitCost,
      sale_price: input.salePrice,
      is_demo: true,
    })
    .select('*')
    .single();

  if (error) return { error: error.message };
  await logActivity(supabase, input.configId, input.sessionId, 'product_add', `Added product: ${input.name}`, 'product', data.id);
  return { product: data };
}

export async function createSoftwareDemoPurchase(input: {
  configId: string;
  sessionId: string;
  supplierId?: string;
  lines: { productId: string; quantity: number; unitCost: number }[];
}) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  const total = input.lines.reduce((s, l) => s + l.quantity * l.unitCost, 0);
  const { data: purchase, error } = await supabase
    .from('software_demo_purchases')
    .insert({
      demo_config_id: input.configId,
      session_id: input.sessionId,
      reference_no: refNo('PUR'),
      supplier_id: input.supplierId ?? null,
      total_amount: total,
      status: 'completed',
      is_demo: true,
    })
    .select('*')
    .single();

  if (error || !purchase) return { error: error?.message ?? 'Failed' };

  for (const line of input.lines) {
    await supabase.from('software_demo_purchase_lines').insert({
      purchase_id: purchase.id,
      product_id: line.productId,
      quantity: line.quantity,
      unit_cost: line.unitCost,
      line_total: line.quantity * line.unitCost,
    });

    const { data: prod } = await supabase.from('software_demo_products').select('current_qty').eq('id', line.productId).single();
    const newQty = Number(prod?.current_qty ?? 0) + line.quantity;
    await supabase.from('software_demo_products').update({ current_qty: newQty }).eq('id', line.productId);

    await supabase.from('software_demo_stock_movements').insert({
      demo_config_id: input.configId,
      session_id: input.sessionId,
      product_id: line.productId,
      movement_type: 'in',
      quantity: line.quantity,
      reference_type: 'purchase',
      reference_id: purchase.id,
      is_demo: true,
    });
  }

  await logActivity(supabase, input.configId, input.sessionId, 'purchase', `Purchase ${purchase.reference_no} — ৳${total}`, 'purchase', purchase.id);
  return { purchase };
}

export async function createSoftwareDemoSale(input: {
  configId: string;
  sessionId: string;
  customerId?: string;
  paidAmount: number;
  lines: { productId: string; quantity: number; unitPrice: number }[];
}) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  const total = input.lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const due = Math.max(0, total - input.paidAmount);

  const { data: sale, error } = await supabase
    .from('software_demo_sales')
    .insert({
      demo_config_id: input.configId,
      session_id: input.sessionId,
      reference_no: refNo('SAL'),
      customer_id: input.customerId ?? null,
      total_amount: total,
      paid_amount: input.paidAmount,
      due_amount: due,
      status: due > 0 ? 'partial' : 'completed',
      is_demo: true,
    })
    .select('*')
    .single();

  if (error || !sale) return { error: error?.message ?? 'Failed' };

  for (const line of input.lines) {
    const { data: prod } = await supabase.from('software_demo_products').select('current_qty, name').eq('id', line.productId).single();
    const current = Number(prod?.current_qty ?? 0);
    if (current < line.quantity) return { error: `Insufficient stock for ${prod?.name}` };

    await supabase.from('software_demo_sale_lines').insert({
      sale_id: sale.id,
      product_id: line.productId,
      quantity: line.quantity,
      unit_price: line.unitPrice,
      line_total: line.quantity * line.unitPrice,
    });

    await supabase.from('software_demo_products').update({ current_qty: current - line.quantity }).eq('id', line.productId);
    await supabase.from('software_demo_stock_movements').insert({
      demo_config_id: input.configId,
      session_id: input.sessionId,
      product_id: line.productId,
      movement_type: 'out',
      quantity: line.quantity,
      reference_type: 'sale',
      reference_id: sale.id,
      is_demo: true,
    });
  }

  if (input.customerId && due > 0) {
    const { data: party } = await supabase.from('software_demo_parties').select('balance').eq('id', input.customerId).single();
    await supabase.from('software_demo_parties').update({ balance: Number(party?.balance ?? 0) + due }).eq('id', input.customerId);
  }

  if (input.paidAmount > 0 && input.customerId) {
    await supabase.from('software_demo_payments').insert({
      demo_config_id: input.configId,
      session_id: input.sessionId,
      party_id: input.customerId,
      payment_type: 'collection',
      amount: input.paidAmount,
      reference_no: refNo('COL'),
      is_demo: true,
    });
  }

  await logActivity(supabase, input.configId, input.sessionId, 'sale', `Sale ${sale.reference_no} — ৳${total}`, 'sale', sale.id);
  return { sale };
}

export async function createSoftwareDemoPayment(input: {
  configId: string;
  sessionId: string;
  partyId: string;
  amount: number;
  paymentType: 'collection' | 'disbursement';
}) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  await supabase.from('software_demo_payments').insert({
    demo_config_id: input.configId,
    session_id: input.sessionId,
    party_id: input.partyId,
    payment_type: input.paymentType,
    amount: input.amount,
    reference_no: refNo('PAY'),
    is_demo: true,
  });

  const { data: party } = await supabase.from('software_demo_parties').select('balance').eq('id', input.partyId).single();
  const delta = input.paymentType === 'collection' ? -input.amount : input.amount;
  await supabase.from('software_demo_parties').update({ balance: Math.max(0, Number(party?.balance ?? 0) + delta) }).eq('id', input.partyId);

  await logActivity(supabase, input.configId, input.sessionId, 'payment', `${input.paymentType} ৳${input.amount}`);
  return { success: true };
}

export async function createSoftwareDemoExpense(input: {
  configId: string;
  sessionId: string;
  category: string;
  amount: number;
  notes?: string;
}) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  await supabase.from('software_demo_expenses').insert({
    demo_config_id: input.configId,
    session_id: input.sessionId,
    category: input.category,
    amount: input.amount,
    notes: input.notes ?? null,
    is_demo: true,
  });

  await logActivity(supabase, input.configId, input.sessionId, 'expense', `Expense: ${input.category} ৳${input.amount}`);
  return { success: true };
}

export async function createSoftwareDemoProduction(input: {
  configId: string;
  sessionId: string;
  bomId: string;
  batchCount: number;
  wastageQty?: number;
}) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  const { data: bom } = await supabase
    .from('software_demo_boms')
    .select('*, lines:software_demo_bom_lines(*)')
    .eq('id', input.bomId)
    .single();

  if (!bom) return { error: 'BOM not found' };

  let totalCost = 0;
  for (const line of bom.lines ?? []) {
    const { data: raw } = await supabase.from('software_demo_products').select('current_qty, unit_cost, name').eq('id', line.raw_product_id).single();
    const needed = Number(line.quantity_per_batch) * input.batchCount;
    const current = Number(raw?.current_qty ?? 0);
    if (current < needed) return { error: `Insufficient ${raw?.name} for production` };

    totalCost += needed * Number(raw?.unit_cost ?? 0);
    await supabase.from('software_demo_products').update({ current_qty: current - needed }).eq('id', line.raw_product_id);
    await supabase.from('software_demo_stock_movements').insert({
      demo_config_id: input.configId,
      session_id: input.sessionId,
      product_id: line.raw_product_id,
      movement_type: 'production_issue',
      quantity: needed,
      reference_type: 'production',
      is_demo: true,
    });
  }

  const { data: fg } = await supabase.from('software_demo_products').select('current_qty, unit_cost').eq('id', bom.finished_product_id).single();
  const outputQty = input.batchCount - (input.wastageQty ?? 0);
  const unitCost = outputQty > 0 ? totalCost / outputQty : 0;
  await supabase.from('software_demo_products').update({
    current_qty: Number(fg?.current_qty ?? 0) + outputQty,
    unit_cost: unitCost,
  }).eq('id', bom.finished_product_id);

  const { data: prodOrder } = await supabase
    .from('software_demo_production_orders')
    .insert({
      demo_config_id: input.configId,
      session_id: input.sessionId,
      bom_id: input.bomId,
      reference_no: refNo('PRO'),
      batch_count: input.batchCount,
      status: 'completed',
      total_cost: totalCost,
      wastage_qty: input.wastageQty ?? 0,
      completed_at: new Date().toISOString(),
      is_demo: true,
    })
    .select('*')
    .single();

  await logActivity(supabase, input.configId, input.sessionId, 'production', `Production completed — cost ৳${totalCost}`, 'production', prodOrder?.id);
  return { productionOrder: prodOrder, totalCost };
}

export async function createSoftwareDemoRequisition(input: {
  configId: string;
  sessionId: string;
  department: string;
  description: string;
  amount: number;
}) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  const { data } = await supabase
    .from('software_demo_requisitions')
    .insert({
      demo_config_id: input.configId,
      session_id: input.sessionId,
      reference_no: refNo('REQ'),
      department: input.department,
      description: input.description,
      amount: input.amount,
      status: 'pending',
      is_demo: true,
    })
    .select('*')
    .single();

  await logActivity(supabase, input.configId, input.sessionId, 'requisition', `Requisition from ${input.department}`, 'requisition', data?.id);
  return { requisition: data };
}

export async function approveSoftwareDemoRequisition(input: {
  configId: string;
  sessionId: string;
  requisitionId: string;
  approved: boolean;
}) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  await supabase
    .from('software_demo_requisitions')
    .update({ status: input.approved ? 'approved' : 'rejected' })
    .eq('id', input.requisitionId);

  await logActivity(supabase, input.configId, input.sessionId, 'approval', `Requisition ${input.approved ? 'approved' : 'rejected'}`);
  return { success: true };
}

export async function createSoftwareDemoSalesOrder(input: {
  configId: string;
  sessionId: string;
  customerId?: string;
  totalAmount: number;
}) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  const { data } = await supabase
    .from('software_demo_sales_orders')
    .insert({
      demo_config_id: input.configId,
      session_id: input.sessionId,
      reference_no: refNo('SO'),
      customer_id: input.customerId ?? null,
      total_amount: input.totalAmount,
      status: 'confirmed',
      is_demo: true,
    })
    .select('*')
    .single();

  await logActivity(supabase, input.configId, input.sessionId, 'sales_order', `Sales order ${data?.reference_no}`, 'sales_order', data?.id);
  return { salesOrder: data };
}

export async function deliverSoftwareDemoSalesOrder(input: {
  configId: string;
  sessionId: string;
  salesOrderId: string;
}) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  await supabase.from('software_demo_sales_orders').update({ status: 'delivered' }).eq('id', input.salesOrderId);
  await logActivity(supabase, input.configId, input.sessionId, 'delivery', 'Sales order delivered');
  return { success: true };
}

export async function transferSoftwareDemoStock(input: {
  configId: string;
  sessionId: string;
  productId: string;
  quantity: number;
  notes?: string;
}) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  await supabase.from('software_demo_stock_movements').insert({
    demo_config_id: input.configId,
    session_id: input.sessionId,
    product_id: input.productId,
    movement_type: 'transfer',
    quantity: input.quantity,
    notes: input.notes ?? 'Warehouse transfer (demo)',
    is_demo: true,
  });

  await logActivity(supabase, input.configId, input.sessionId, 'transfer', `Stock transfer recorded`);
  return { success: true };
}
