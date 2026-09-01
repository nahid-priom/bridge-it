'use client';

import { useCallback, useEffect, useState } from 'react';
import type { SoftwareDemoConfig, SoftwareDemoModule, SoftwareDemoSessionSnapshot, SoftwareFeatureFlags } from '@/types/bitp';
import { getSoftwareDemoSessionId } from '@/lib/software-demo/demo-session';
import { hasSoftwareFeature } from '@/lib/software-demo/feature-flags';
import { formatBdt } from '@/lib/format/currency';
import {
  bootstrapSoftwareDemoAction,
  addProductAction,
  createPurchaseAction,
  createSaleAction,
  createPaymentAction,
  createExpenseAction,
  createProductionAction,
  createRequisitionAction,
  approveRequisitionAction,
  createSalesOrderAction,
  deliverSalesOrderAction,
  transferStockAction,
} from '@/app/actions/software-demo';
import { cn } from '@/lib/cn';

type SoftwareDemoAppProps = {
  config: SoftwareDemoConfig;
  demoSlug: string;
};

export function SoftwareDemoApp({ config, demoSlug }: SoftwareDemoAppProps) {
  const [sessionId] = useState(() => getSoftwareDemoSessionId());
  const [activeModule, setActiveModule] = useState('dashboard');
  const [snapshot, setSnapshot] = useState<SoftwareDemoSessionSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flags = config.feature_flags;
  const modules = (config.modules ?? []).filter((m) => isModuleEnabled(m, flags));

  const load = useCallback(async () => {
    setLoading(true);
    const result = await bootstrapSoftwareDemoAction(demoSlug, sessionId);
    if (result.error) setError(result.error);
    else if (result.snapshot) setSnapshot(result.snapshot);
    setLoading(false);
  }, [demoSlug, sessionId]);

  useEffect(() => { load(); }, [load]);

  const run = async (fn: () => Promise<{ error?: string; snapshot?: SoftwareDemoSessionSnapshot }>) => {
    setPending(true);
    setError(null);
    const result = await fn();
    setPending(false);
    if (result.error) setError(result.error);
    else if (result.snapshot) setSnapshot(result.snapshot);
  };

  if (loading || !snapshot) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-text-secondary animate-pulse">Loading demo...</p></div>;
  }

  const m = snapshot.metrics;

  return (
    <div className="flex min-h-[calc(100vh-var(--demo-bar-height))]">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#0f1424] border-r border-slate-200 dark:border-white/10 transform transition-transform lg:translate-x-0 lg:static lg:shrink-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'top-[var(--demo-bar-height)] lg:top-0'
      )}>
        <nav className="p-3 space-y-1 overflow-y-auto max-h-full">
          {modules.map((mod) => (
            <button
              key={mod.module_key}
              type="button"
              onClick={() => { setActiveModule(mod.route_key); setSidebarOpen(false); }}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors',
                activeModule === mod.route_key ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-text-primary'
              )}
            >
              <span>{mod.icon}</span>
              {mod.label}
            </button>
          ))}
        </nav>
      </aside>
      {sidebarOpen && <button type="button" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}

      {/* Main */}
      <div className="flex-1 min-w-0 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button type="button" onClick={() => setSidebarOpen(true)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-semibold">Menu</button>
          <span className="text-sm font-bold text-emerald-600">{modules.find((x) => x.route_key === activeModule)?.label}</span>
        </div>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 text-sm">{error}</div>}

        {activeModule === 'dashboard' && (
          <DashboardView config={config} metrics={m} snapshot={snapshot} onNavigate={setActiveModule} flags={flags} />
        )}
        {activeModule === 'products' && (
          <ProductsView config={config} sessionId={sessionId} snapshot={snapshot} pending={pending} onAdd={(data) => run(() => addProductAction({ configId: config.id, sessionId, ...data }))} />
        )}
        {activeModule === 'purchase' && (
          <PurchaseView config={config} sessionId={sessionId} snapshot={snapshot} pending={pending} onSubmit={(lines, supplierId) => run(() => createPurchaseAction({ configId: config.id, sessionId, supplierId, lines }))} />
        )}
        {activeModule === 'sales' && (
          <SalesView config={config} sessionId={sessionId} snapshot={snapshot} pending={pending} onSubmit={(lines, customerId, paid) => run(() => createSaleAction({ configId: config.id, sessionId, customerId, paidAmount: paid ?? 0, lines }))} />
        )}
        {activeModule === 'stock' && <StockView snapshot={snapshot} />}
        {activeModule === 'parties' && <PartiesView snapshot={snapshot} />}
        {activeModule === 'payments' && (
          <PaymentsView config={config} sessionId={sessionId} snapshot={snapshot} pending={pending} onSubmit={(partyId, amount, type) => run(() => createPaymentAction({ configId: config.id, sessionId, partyId, amount, paymentType: type }))} />
        )}
        {activeModule === 'expenses' && (
          <ExpensesView config={config} sessionId={sessionId} pending={pending} snapshot={snapshot} onSubmit={(cat, amt) => run(() => createExpenseAction({ configId: config.id, sessionId, category: cat, amount: amt }))} />
        )}
        {activeModule === 'ledger' && <LedgerView snapshot={snapshot} />}
        {activeModule === 'transfer' && (
          <TransferView config={config} sessionId={sessionId} snapshot={snapshot} pending={pending} onSubmit={(productId, qty) => run(() => transferStockAction({ configId: config.id, sessionId, productId, quantity: qty }))} />
        )}
        {activeModule === 'accounts' && <AccountsView snapshot={snapshot} />}
        {activeModule === 'bom' && <BomView snapshot={snapshot} />}
        {activeModule === 'production' && (
          <ProductionView config={config} sessionId={sessionId} snapshot={snapshot} pending={pending} onSubmit={(bomId, batches, wastage) => run(() => createProductionAction({ configId: config.id, sessionId, bomId, batchCount: batches, wastageQty: wastage }))} />
        )}
        {activeModule === 'costing' && <CostingView snapshot={snapshot} />}
        {activeModule === 'requisition' && (
          <RequisitionView config={config} sessionId={sessionId} pending={pending} onSubmit={(dept, desc, amt) => run(() => createRequisitionAction({ configId: config.id, sessionId, department: dept, description: desc, amount: amt }))} />
        )}
        {activeModule === 'approval' && (
          <ApprovalView config={config} sessionId={sessionId} snapshot={snapshot} pending={pending} onApprove={(id, ok) => run(() => approveRequisitionAction({ configId: config.id, sessionId, requisitionId: id, approved: ok }))} />
        )}
        {activeModule === 'salesOrders' && (
          <SalesOrdersView config={config} sessionId={sessionId} snapshot={snapshot} pending={pending} onCreate={(customerId, amt) => run(() => createSalesOrderAction({ configId: config.id, sessionId, customerId, totalAmount: amt }))} onDeliver={(id) => run(() => deliverSalesOrderAction({ configId: config.id, sessionId, salesOrderId: id }))} />
        )}
        {activeModule === 'delivery' && <DeliveryView snapshot={snapshot} />}
        {activeModule === 'reports' && <ReportsView snapshot={snapshot} flags={flags} />}
      </div>
    </div>
  );
}

function isModuleEnabled(mod: SoftwareDemoModule, flags: SoftwareFeatureFlags) {
  const implemented = new Set([
    'dashboard', 'products', 'purchase', 'sales', 'stock', 'parties', 'payments',
    'expenses', 'ledger', 'transfer', 'accounts', 'bom', 'production', 'costing',
    'requisition', 'approval', 'salesOrders', 'delivery', 'reports',
  ]);
  if (!implemented.has(mod.route_key)) return false;
  const key = mod.module_key as keyof SoftwareFeatureFlags;
  return hasSoftwareFeature(flags, key) || mod.module_key === 'dashboard';
}

function DashboardView({ config, metrics, snapshot, onNavigate, flags }: {
  config: SoftwareDemoConfig;
  metrics: SoftwareDemoSessionSnapshot['metrics'];
  snapshot: SoftwareDemoSessionSnapshot;
  onNavigate: (m: string) => void;
  flags: SoftwareFeatureFlags;
}) {
  const kpis = [
    { label: 'Products', value: metrics.totalProducts },
    { label: 'Stock Value', value: formatBdt(metrics.totalStockValue) },
    { label: 'Total Sales', value: formatBdt(metrics.totalSales) },
    { label: 'Total Due', value: formatBdt(metrics.totalDue) },
    { label: 'Profit Est.', value: formatBdt(metrics.profitEstimate) },
    { label: 'Low Stock', value: metrics.lowStockCount },
  ];

  const actions = [
    { label: 'Add Product', module: 'products', show: flags.products },
    { label: 'New Purchase', module: 'purchase', show: flags.purchase },
    { label: 'New Sale', module: 'sales', show: flags.sales },
    { label: 'Run Production', module: 'production', show: flags.production },
    { label: 'New Requisition', module: 'requisition', show: flags.requisition },
  ].filter((a) => a.show);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black">{config.demo_title}</h1>
        <p className="text-sm text-text-secondary mt-1">{config.demo_description}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1424] p-4">
            <p className="text-xs text-text-secondary">{k.label}</p>
            <p className="text-lg font-black mt-1">{k.value}</p>
          </div>
        ))}
      </div>
      {actions.length > 0 && (
        <div>
          <h2 className="text-sm font-bold mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <button key={a.module} type="button" onClick={() => onNavigate(a.module)} className="deshi-btn-primary px-4 py-2 text-sm font-bold">{a.label}</button>
            ))}
          </div>
        </div>
      )}
      {config.workflow_config.length > 0 && (
        <div>
          <h2 className="text-sm font-bold mb-3">Demo Workflow</h2>
          <ol className="flex flex-wrap gap-2">
            {config.workflow_config.map((step, i) => (
              <li key={step} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
      <ActivityFeed activity={snapshot.activity} />
    </div>
  );
}

function ActivityFeed({ activity }: { activity: SoftwareDemoSessionSnapshot['activity'] }) {
  if (!activity.length) return null;
  return (
    <div>
      <h2 className="text-sm font-bold mb-3">Recent Activity</h2>
      <ul className="space-y-2">
        {activity.slice(0, 8).map((a) => (
          <li key={a.id} className="text-sm flex justify-between gap-2 py-2 border-b border-slate-100 dark:border-white/5">
            <span>{a.summary}</span>
            <span className="text-xs text-text-secondary shrink-0">{new Date(a.created_at).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductsView({ config, sessionId, snapshot, pending, onAdd }: {
  config: SoftwareDemoConfig; sessionId: string; snapshot: SoftwareDemoSessionSnapshot; pending: boolean;
  onAdd: (d: { sku: string; name: string; productType: string; openingQty: number; unitCost: number; salePrice: number }) => void;
}) {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('finished');
  const [qty, setQty] = useState(10);
  const [cost, setCost] = useState(100);
  const [price, setPrice] = useState(150);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Products</h1>
      <form onSubmit={(e) => { e.preventDefault(); onAdd({ sku, name, productType: type, openingQty: qty, unitCost: cost, salePrice: price }); setSku(''); setName(''); }} className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1424] p-4 space-y-3">
        <h2 className="font-bold text-sm">Add Product</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" required className="rounded-lg border px-3 py-2 text-sm" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" required className="rounded-lg border px-3 py-2 text-sm" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
            <option value="finished">Finished</option>
            <option value="raw">Raw Material</option>
          </select>
          <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} placeholder="Qty" className="rounded-lg border px-3 py-2 text-sm" />
          <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} placeholder="Unit cost" className="rounded-lg border px-3 py-2 text-sm" />
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Sale price" className="rounded-lg border px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={pending} className="deshi-btn-primary px-4 py-2 text-sm font-bold disabled:opacity-50">Add Product</button>
      </form>
      <DemoTable headers={['SKU', 'Name', 'Type', 'Stock', 'Cost', 'Price']} rows={snapshot.products.map((p) => [p.sku, p.name, p.product_type, String(p.current_qty), formatBdt(Number(p.unit_cost)), formatBdt(Number(p.sale_price))])} />
    </div>
  );
}

function PurchaseView({ config, sessionId, snapshot, pending, onSubmit }: {
  config: SoftwareDemoConfig; sessionId: string; snapshot: SoftwareDemoSessionSnapshot; pending: boolean;
  onSubmit: (lines: { productId: string; quantity: number; unitCost: number }[], supplierId?: string) => void;
}) {
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState(10);
  const [cost, setCost] = useState(100);
  const [supplierId, setSupplierId] = useState('');
  const suppliers = snapshot.parties.filter((p) => p.party_type === 'supplier');

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Purchase</h1>
      <form onSubmit={(e) => { e.preventDefault(); if (!productId) return; onSubmit([{ productId, quantity: qty, unitCost: cost }], supplierId || undefined); }} className="rounded-xl border p-4 space-y-3 bg-white dark:bg-[#0f1424]">
        <select value={productId} onChange={(e) => setProductId(e.target.value)} required className="w-full rounded-lg border px-3 py-2 text-sm">
          <option value="">Select product</option>
          {snapshot.products.map((p) => <option key={p.id} value={p.id}>{p.name} (stock: {p.current_qty})</option>)}
        </select>
        {suppliers.length > 0 && (
          <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">
            <option value="">Select supplier (optional)</option>
            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        )}
        <div className="grid grid-cols-2 gap-3">
          <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} placeholder="Quantity" className="rounded-lg border px-3 py-2 text-sm" />
          <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} placeholder="Unit cost" className="rounded-lg border px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={pending} className="deshi-btn-primary px-4 py-2 text-sm font-bold disabled:opacity-50">Create Purchase</button>
      </form>
      <DemoTable headers={['Ref', 'Total', 'Date']} rows={snapshot.purchases.map((p) => [p.reference_no, formatBdt(Number(p.total_amount)), new Date(p.created_at).toLocaleDateString()])} />
    </div>
  );
}

function SalesView({ config, sessionId, snapshot, pending, onSubmit }: {
  config: SoftwareDemoConfig; sessionId: string; snapshot: SoftwareDemoSessionSnapshot; pending: boolean;
  onSubmit: (lines: { productId: string; quantity: number; unitPrice: number }[], customerId?: string, paid?: number) => void;
}) {
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [customerId, setCustomerId] = useState('');
  const [paid, setPaid] = useState(0);
  const customers = snapshot.parties.filter((p) => p.party_type === 'customer');
  const sellable = snapshot.products.filter((p) => p.product_type === 'finished' && Number(p.current_qty) > 0);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Sales</h1>
      <form onSubmit={(e) => { e.preventDefault(); if (!productId) return; const p = snapshot.products.find((x) => x.id === productId); onSubmit([{ productId, quantity: qty, unitPrice: price || Number(p?.sale_price ?? 0) }], customerId || undefined, paid); }} className="rounded-xl border p-4 space-y-3 bg-white dark:bg-[#0f1424]">
        <select value={productId} onChange={(e) => { setProductId(e.target.value); const p = snapshot.products.find((x) => x.id === e.target.value); setPrice(Number(p?.sale_price ?? 0)); }} required className="w-full rounded-lg border px-3 py-2 text-sm">
          <option value="">Select product</option>
          {sellable.map((p) => <option key={p.id} value={p.id}>{p.name} (stock: {p.current_qty})</option>)}
        </select>
        {customers.length > 0 && (
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">
            <option value="">Walk-in customer</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
        <div className="grid grid-cols-3 gap-3">
          <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} placeholder="Qty" className="rounded-lg border px-3 py-2 text-sm" />
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Unit price" className="rounded-lg border px-3 py-2 text-sm" />
          <input type="number" value={paid} onChange={(e) => setPaid(Number(e.target.value))} placeholder="Paid now" className="rounded-lg border px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={pending} className="deshi-btn-primary px-4 py-2 text-sm font-bold disabled:opacity-50">Create Sale</button>
      </form>
      <DemoTable headers={['Ref', 'Total', 'Due', 'Date']} rows={snapshot.sales.map((s) => [s.reference_no, formatBdt(Number(s.total_amount)), formatBdt(Number(s.due_amount)), new Date(s.created_at).toLocaleDateString()])} />
    </div>
  );
}

function StockView({ snapshot }: { snapshot: SoftwareDemoSessionSnapshot }) {
  const low = snapshot.products.filter((p) => Number(p.current_qty) < 10);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Current Stock</h1>
      {low.length > 0 && <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-sm">{low.length} item(s) low on stock</div>}
      <DemoTable headers={['SKU', 'Name', 'Type', 'Current Qty', 'Value']} rows={snapshot.products.map((p) => [p.sku, p.name, p.product_type, String(p.current_qty), formatBdt(Number(p.current_qty) * Number(p.unit_cost))])} />
    </div>
  );
}

function PartiesView({ snapshot }: { snapshot: SoftwareDemoSessionSnapshot }) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Parties</h1>
      <DemoTable headers={['Type', 'Name', 'Balance']} rows={snapshot.parties.map((p) => [p.party_type, p.name, formatBdt(Number(p.balance))])} />
    </div>
  );
}

function PaymentsView({ config, sessionId, snapshot, pending, onSubmit }: {
  config: SoftwareDemoConfig; sessionId: string; snapshot: SoftwareDemoSessionSnapshot; pending: boolean;
  onSubmit: (partyId: string, amount: number, type: 'collection' | 'disbursement') => void;
}) {
  const [partyId, setPartyId] = useState('');
  const [amount, setAmount] = useState(0);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Payments</h1>
      <form onSubmit={(e) => { e.preventDefault(); if (!partyId || !amount) return; onSubmit(partyId, amount, 'collection'); }} className="rounded-xl border p-4 space-y-3 bg-white dark:bg-[#0f1424]">
        <select value={partyId} onChange={(e) => setPartyId(e.target.value)} required className="w-full rounded-lg border px-3 py-2 text-sm">
          <option value="">Select party</option>
          {snapshot.parties.map((p) => <option key={p.id} value={p.id}>{p.name} (due: {formatBdt(Number(p.balance))})</option>)}
        </select>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Collection amount" className="w-full rounded-lg border px-3 py-2 text-sm" />
        <button type="submit" disabled={pending} className="deshi-btn-primary px-4 py-2 text-sm font-bold">Record Collection</button>
      </form>
      <DemoTable headers={['Type', 'Amount', 'Date']} rows={snapshot.payments.map((p) => [p.payment_type, formatBdt(Number(p.amount)), new Date(p.created_at).toLocaleDateString()])} />
    </div>
  );
}

function ExpensesView({ config, sessionId, pending, snapshot, onSubmit }: {
  config: SoftwareDemoConfig; sessionId: string; pending: boolean; snapshot: SoftwareDemoSessionSnapshot;
  onSubmit: (cat: string, amt: number) => void;
}) {
  const [cat, setCat] = useState('Rent');
  const [amt, setAmt] = useState(500);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Expenses</h1>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(cat, amt); }} className="rounded-xl border p-4 space-y-3 bg-white dark:bg-[#0f1424]">
        <input value={cat} onChange={(e) => setCat(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" />
        <input type="number" value={amt} onChange={(e) => setAmt(Number(e.target.value))} className="w-full rounded-lg border px-3 py-2 text-sm" />
        <button type="submit" disabled={pending} className="deshi-btn-primary px-4 py-2 text-sm font-bold">Add Expense</button>
      </form>
      <DemoTable headers={['Category', 'Amount', 'Date']} rows={snapshot.expenses.map((e) => [e.category, formatBdt(Number(e.amount)), new Date(e.created_at).toLocaleDateString()])} />
    </div>
  );
}

function LedgerView({ snapshot }: { snapshot: SoftwareDemoSessionSnapshot }) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Ledger Summary</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4"><p className="text-xs text-text-secondary">Total Sales</p><p className="text-xl font-black">{formatBdt(snapshot.metrics.totalSales)}</p></div>
        <div className="rounded-xl border p-4"><p className="text-xs text-text-secondary">Total Purchases</p><p className="text-xl font-black">{formatBdt(snapshot.metrics.totalPurchases)}</p></div>
        <div className="rounded-xl border p-4"><p className="text-xs text-text-secondary">Total Due</p><p className="text-xl font-black">{formatBdt(snapshot.metrics.totalDue)}</p></div>
        <div className="rounded-xl border p-4"><p className="text-xs text-text-secondary">Profit Estimate</p><p className="text-xl font-black text-emerald-600">{formatBdt(snapshot.metrics.profitEstimate)}</p></div>
      </div>
      <DemoTable headers={['Party', 'Type', 'Balance']} rows={snapshot.parties.map((p) => [p.name, p.party_type, formatBdt(Number(p.balance))])} />
    </div>
  );
}

function TransferView({ config, sessionId, snapshot, pending, onSubmit }: {
  config: SoftwareDemoConfig; sessionId: string; snapshot: SoftwareDemoSessionSnapshot; pending: boolean;
  onSubmit: (productId: string, qty: number) => void;
}) {
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState(5);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Stock Transfer</h1>
      <form onSubmit={(e) => { e.preventDefault(); if (!productId) return; onSubmit(productId, qty); }} className="rounded-xl border p-4 space-y-3 bg-white dark:bg-[#0f1424]">
        <select value={productId} onChange={(e) => setProductId(e.target.value)} required className="w-full rounded-lg border px-3 py-2 text-sm">
          <option value="">Select product</option>
          {snapshot.products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-full rounded-lg border px-3 py-2 text-sm" />
        <button type="submit" disabled={pending} className="deshi-btn-primary px-4 py-2 text-sm font-bold">Record Transfer</button>
      </form>
      <p className="text-sm text-text-secondary">Demo: records warehouse transfer movement without changing total stock.</p>
    </div>
  );
}

function AccountsView({ snapshot }: { snapshot: SoftwareDemoSessionSnapshot }) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Accounts Summary</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border p-4"><p className="text-xs">Receivable</p><p className="text-xl font-black">{formatBdt(snapshot.metrics.totalDue)}</p></div>
        <div className="rounded-xl border p-4"><p className="text-xs">Expenses</p><p className="text-xl font-black">{formatBdt(snapshot.metrics.totalExpenses)}</p></div>
        <div className="rounded-xl border p-4"><p className="text-xs">Stock Value</p><p className="text-xl font-black">{formatBdt(snapshot.metrics.totalStockValue)}</p></div>
      </div>
    </div>
  );
}

function BomView({ snapshot }: { snapshot: SoftwareDemoSessionSnapshot }) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Bill of Materials</h1>
      {snapshot.boms.length === 0 ? <p className="text-text-secondary">No BOMs defined. Production demo includes pre-seeded BOM for Hand Wash.</p> : (
        snapshot.boms.map((bom) => {
          const fg = snapshot.products.find((p) => p.id === bom.finished_product_id);
          return (
            <div key={bom.id} className="rounded-xl border p-4 bg-white dark:bg-[#0f1424]">
              <h3 className="font-bold">{bom.name} → {fg?.name}</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {(bom.lines ?? []).map((l) => {
                  const raw = snapshot.products.find((p) => p.id === l.raw_product_id);
                  return <li key={l.raw_product_id}>{raw?.name}: {l.quantity_per_batch} per batch</li>;
                })}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}

function ProductionView({ config, sessionId, snapshot, pending, onSubmit }: {
  config: SoftwareDemoConfig; sessionId: string; snapshot: SoftwareDemoSessionSnapshot; pending: boolean;
  onSubmit: (bomId: string, batches: number, wastage: number) => void;
}) {
  const [bomId, setBomId] = useState(snapshot.boms[0]?.id ?? '');
  const [batches, setBatches] = useState(1);
  const [wastage, setWastage] = useState(0);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Production</h1>
      <form onSubmit={(e) => { e.preventDefault(); if (!bomId) return; onSubmit(bomId, batches, wastage); }} className="rounded-xl border p-4 space-y-3 bg-white dark:bg-[#0f1424]">
        <select value={bomId} onChange={(e) => setBomId(e.target.value)} required className="w-full rounded-lg border px-3 py-2 text-sm">
          <option value="">Select BOM</option>
          {snapshot.boms.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" value={batches} onChange={(e) => setBatches(Number(e.target.value))} placeholder="Batches" className="rounded-lg border px-3 py-2 text-sm" min={1} />
          <input type="number" value={wastage} onChange={(e) => setWastage(Number(e.target.value))} placeholder="Wastage qty" className="rounded-lg border px-3 py-2 text-sm" min={0} />
        </div>
        <button type="submit" disabled={pending || !bomId} className="deshi-btn-primary px-4 py-2 text-sm font-bold">Run Production</button>
      </form>
      <DemoTable headers={['Ref', 'Batches', 'Cost', 'Status', 'Date']} rows={snapshot.productionOrders.map((p) => [p.reference_no, String(p.batch_count), formatBdt(Number(p.total_cost)), p.status, new Date(p.created_at).toLocaleDateString()])} />
    </div>
  );
}

function CostingView({ snapshot }: { snapshot: SoftwareDemoSessionSnapshot }) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Production Costing</h1>
      <DemoTable headers={['Production Ref', 'Total Cost', 'Wastage', 'Status']} rows={snapshot.productionOrders.map((p) => [p.reference_no, formatBdt(Number(p.total_cost)), String(p.wastage_qty), p.status])} />
      <p className="text-sm text-text-secondary">Cost per unit is calculated and applied to finished goods on production completion.</p>
    </div>
  );
}

function RequisitionView({ config, sessionId, pending, onSubmit }: {
  config: SoftwareDemoConfig; sessionId: string; pending: boolean;
  onSubmit: (dept: string, desc: string, amt: number) => void;
}) {
  const [dept, setDept] = useState('Procurement');
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState(5000);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Requisitions</h1>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(dept, desc, amt); setDesc(''); }} className="rounded-xl border p-4 space-y-3 bg-white dark:bg-[#0f1424]">
        <input value={dept} onChange={(e) => setDept(e.target.value)} placeholder="Department" className="w-full rounded-lg border px-3 py-2 text-sm" />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" required className="w-full rounded-lg border px-3 py-2 text-sm" rows={2} />
        <input type="number" value={amt} onChange={(e) => setAmt(Number(e.target.value))} className="w-full rounded-lg border px-3 py-2 text-sm" />
        <button type="submit" disabled={pending} className="deshi-btn-primary px-4 py-2 text-sm font-bold">Submit Requisition</button>
      </form>
    </div>
  );
}

function ApprovalView({ config, sessionId, snapshot, pending, onApprove }: {
  config: SoftwareDemoConfig; sessionId: string; snapshot: SoftwareDemoSessionSnapshot; pending: boolean;
  onApprove: (id: string, ok: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Approvals</h1>
      {snapshot.requisitions.length === 0 ? <p className="text-text-secondary">No pending requisitions.</p> : (
        <ul className="space-y-3">
          {snapshot.requisitions.map((r) => (
            <li key={r.id} className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0f1424]">
              <div>
                <p className="font-bold">{r.reference_no} — {r.department}</p>
                <p className="text-sm text-text-secondary">{formatBdt(Number(r.amount))} · {r.status}</p>
              </div>
              {r.status === 'pending' && (
                <div className="flex gap-2">
                  <button type="button" disabled={pending} onClick={() => onApprove(r.id, true)} className="deshi-btn-primary px-3 py-1.5 text-xs font-bold">Approve</button>
                  <button type="button" disabled={pending} onClick={() => onApprove(r.id, false)} className="deshi-btn-outline px-3 py-1.5 text-xs font-bold">Reject</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SalesOrdersView({ config, sessionId, snapshot, pending, onCreate, onDeliver }: {
  config: SoftwareDemoConfig; sessionId: string; snapshot: SoftwareDemoSessionSnapshot; pending: boolean;
  onCreate: (customerId: string | undefined, amt: number) => void;
  onDeliver: (id: string) => void;
}) {
  const [amt, setAmt] = useState(10000);
  const [customerId, setCustomerId] = useState('');
  const customers = snapshot.parties.filter((p) => p.party_type === 'customer');
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Sales Orders</h1>
      <form onSubmit={(e) => { e.preventDefault(); onCreate(customerId || undefined, amt); }} className="rounded-xl border p-4 space-y-3 bg-white dark:bg-[#0f1424]">
        {customers.length > 0 && (
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">
            <option value="">Select customer</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
        <input type="number" value={amt} onChange={(e) => setAmt(Number(e.target.value))} className="w-full rounded-lg border px-3 py-2 text-sm" />
        <button type="submit" disabled={pending} className="deshi-btn-primary px-4 py-2 text-sm font-bold">Create Sales Order</button>
      </form>
      <ul className="space-y-3">
        {snapshot.salesOrders.map((so) => (
          <li key={so.id} className="rounded-xl border p-4 flex justify-between items-center bg-white dark:bg-[#0f1424]">
            <div><p className="font-bold">{so.reference_no}</p><p className="text-sm">{formatBdt(Number(so.total_amount))} · {so.status}</p></div>
            {so.status === 'confirmed' && <button type="button" disabled={pending} onClick={() => onDeliver(so.id)} className="deshi-btn-primary px-3 py-1.5 text-xs font-bold">Deliver</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeliveryView({ snapshot }: { snapshot: SoftwareDemoSessionSnapshot }) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Delivery</h1>
      <DemoTable headers={['SO Ref', 'Amount', 'Status']} rows={snapshot.salesOrders.map((s) => [s.reference_no, formatBdt(Number(s.total_amount)), s.status])} />
    </div>
  );
}

function ReportsView({ snapshot, flags }: { snapshot: SoftwareDemoSessionSnapshot; flags: SoftwareFeatureFlags }) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Reports</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <ReportCard title="Sales Summary" value={formatBdt(snapshot.metrics.totalSales)} />
        <ReportCard title="Purchase Summary" value={formatBdt(snapshot.metrics.totalPurchases)} />
        <ReportCard title="Profit / Loss" value={formatBdt(snapshot.metrics.profitEstimate)} highlight />
        <ReportCard title="Stock Value" value={formatBdt(snapshot.metrics.totalStockValue)} />
        {flags.production && <ReportCard title="Production Runs" value={String(snapshot.productionOrders.length)} />}
        {flags.approval && <ReportCard title="Pending Requisitions" value={String(snapshot.requisitions.filter((r) => r.status === 'pending').length)} />}
      </div>
      <p className="text-xs text-amber-600 font-semibold">Demo sample reports — based on your session activity.</p>
    </div>
  );
}

function ReportCard({ title, value, highlight }: { title: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border p-4 bg-white dark:bg-[#0f1424]">
      <p className="text-xs text-text-secondary">{title}</p>
      <p className={cn('text-2xl font-black mt-1', highlight && 'text-emerald-600')}>{value}</p>
    </div>
  );
}

function DemoTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  if (!rows.length) return <p className="text-sm text-text-secondary">No records yet.</p>;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
      <table className="w-full text-sm min-w-[400px]">
        <thead><tr className="bg-slate-50 dark:bg-white/5">{headers.map((h) => <th key={h} className="text-left p-3 font-semibold">{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i} className="border-t border-slate-100 dark:border-white/5">{row.map((cell, j) => <td key={j} className="p-3">{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
