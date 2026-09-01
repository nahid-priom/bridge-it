'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatBdt } from '@/lib/format/currency';
import { deleteBitpProductAction } from '@/app/actions/bitp-admin';
import { BitpCategoryForm } from '@/components/admin/bitp/BitpCategoryForm';
import { BitpProductEditor } from '@/components/admin/bitp/BitpProductEditor';
import { ProductCoverBulkPanel } from '@/components/admin/bitp/ProductCoverBulkPanel';
import { BitpOrderManager } from '@/components/admin/bitp/BitpOrderManager';
import { BitpProjectManager } from '@/components/admin/bitp/BitpProjectManager';
import { BitpPaymentManager } from '@/components/admin/bitp/BitpPaymentManager';
import { BitpSoftwareDemoEditor } from '@/components/admin/bitp/BitpSoftwareDemoEditor';
import { AdminBitpConsultationsSection } from '@/components/admin/sections/AdminBitpConsultationsSection';
import type { BitpProduct, BitpOrder, BitpCategory } from '@/types/bitp';
import { cn } from '@/lib/cn';

export function AdminBitpProductsSection() {
  const [products, setProducts] = useState<BitpProduct[]>([]);
  const [categories, setCategories] = useState<BitpCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      fetch('/api/admin/bitp/products').then((r) => r.json()),
      fetch('/api/admin/bitp/categories').then((r) => r.json()),
    ]);
    setProducts(prodRes.products ?? []);
    setCategories(catRes.categories ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return products;
    return products.filter((p) => p.category?.slug === categoryFilter || p.category_id === categoryFilter);
  }, [products, categoryFilter]);

  const defaultCategoryId = useMemo(() => {
    if (categoryFilter === 'all') return categories[0]?.id;
    const cat = categories.find((c) => c.slug === categoryFilter || c.id === categoryFilter);
    return cat?.id;
  }, [categories, categoryFilter]);

  const openCreate = () => {
    setEditingId(null);
    setEditorOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setEditorOpen(true);
  };

  const handleDelete = async (product: BitpProduct) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    const result = await deleteBitpProductAction(product.id);
    if (result.error) alert(result.error);
    else load();
  };

  if (loading) return <p className="text-text-secondary">Loading products...</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">Products & Services</h2>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoryFilter('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-semibold border',
            categoryFilter === 'all'
              ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
              : 'border-white/10 text-white/60 hover:text-white'
          )}
        >
          All ({products.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategoryFilter(c.slug)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold border',
              categoryFilter === c.slug
                ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                : 'border-white/10 text-white/60 hover:text-white'
            )}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <ProductCoverBulkPanel onComplete={load} />

      {filtered.length === 0 ? (
        <p className="text-text-secondary">No products in this category.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/60">
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-3 font-medium text-white">{p.name}</td>
                  <td className="p-3 text-white/70">{p.category?.name ?? '—'}</td>
                  <td className="p-3 text-white/80">{formatBdt(Number(p.starting_price))}</td>
                  <td className="p-3 capitalize text-white/70">{p.status}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(p.id)}
                        className="p-2 rounded-lg text-white/60 hover:text-emerald-400 hover:bg-white/5"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-white/5"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editorOpen && (
        <BitpProductEditor
          productId={editingId}
          categories={categories}
          defaultCategoryId={defaultCategoryId}
          onClose={() => setEditorOpen(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}

export function AdminBitpCategoriesSection() {
  const [categories, setCategories] = useState<BitpCategory[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BitpCategory | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/bitp/categories').then((r) => r.json());
    setCategories(res.categories ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Categories</h2>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className={cn(
              'rounded-xl border p-4',
              c.is_active ? 'border-white/10' : 'border-white/5 opacity-60'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-2xl">{c.icon}</span>
                <p className="font-bold text-white mt-2">{c.name}</p>
                <p className="text-sm text-white/50 font-mono">{c.slug}</p>
                {!c.is_active && <p className="text-xs text-amber-400 mt-1">Inactive</p>}
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditing(c);
                  setFormOpen(true);
                }}
                className="p-2 rounded-lg text-white/60 hover:text-emerald-400 hover:bg-white/5"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <BitpCategoryForm
          category={editing}
          onClose={() => setFormOpen(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}

export function AdminBitpOrdersSection() {
  const [orders, setOrders] = useState<BitpOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/bitp/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-text-secondary">Loading orders...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Order Management</h2>
      <BitpOrderManager orders={orders} onRefresh={load} />
    </div>
  );
}

export { AdminBitpConsultationsSection };

export function AdminBitpContentSection() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/admin/bitp/settings').then((r) => r.json()).then((d) => setSettings(d.settings ?? {}));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Site Content</h2>
      <div className="space-y-2">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="rounded-xl border border-white/10 p-3">
            <p className="text-xs text-white/50 font-mono">{key}</p>
            <p className="text-sm text-white/80 mt-1">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminBitpProjectsSection() {
  const [projects, setProjects] = useState<import('@/types/bitp').BitpProject[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/bitp/projects')
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-text-secondary">Loading projects...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Project Management</h2>
      <BitpProjectManager projects={projects} onRefresh={load} />
    </div>
  );
}

export function AdminBitpPaymentsSection() {
  const [payments, setPayments] = useState<import('@/types/bitp').BitpPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/bitp/payments')
      .then((r) => r.json())
      .then((d) => setPayments(d.payments ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-text-secondary">Loading payments...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Payment Verification</h2>
      <BitpPaymentManager payments={payments} onRefresh={load} />
    </div>
  );
}

export function AdminBitpSoftwareSection() {
  return (
    <div className="space-y-4">
      <BitpSoftwareDemoEditor />
    </div>
  );
}

export function AdminBitpEcommerceDemoSection() {
  const [configs, setConfigs] = useState<{ id: string; demo_slug: string; active: boolean; products: { slug: string; name: string } | null }[]>([]);

  useEffect(() => {
    fetch('/api/admin/bitp/ecommerce-demos').then((r) => r.json()).then((d) => setConfigs(d.configs ?? []));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">E-commerce Demo Configs</h2>
      <p className="text-sm text-white/60">Read-only list. Edit product showroom fields in Products & Services.</p>
      {configs.length === 0 ? (
        <p className="text-text-secondary">No demo configs found.</p>
      ) : (
        <ul className="space-y-2">
          {configs.map((c) => (
            <li key={c.id} className="rounded-xl border border-white/10 p-4 flex justify-between items-center gap-3">
              <div>
                <p className="font-semibold text-white">{c.demo_slug}</p>
                <p className="text-sm text-white/60">{c.products?.name ?? 'Unlinked product'}</p>
              </div>
              <span className={cn('text-xs font-bold uppercase', c.active ? 'text-emerald-400' : 'text-white/40')}>
                {c.active ? 'Active' : 'Inactive'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AdminBitpGenericSection({ title, endpoint }: { title: string; endpoint: string }) {
  const [data, setData] = useState<unknown[]>([]);
  useEffect(() => {
    fetch(endpoint).then((r) => r.json()).then((d) => setData(Object.values(d)[0] as unknown[] ?? []));
  }, [endpoint]);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {data.length === 0 ? <p className="text-text-secondary">No records yet.</p> : (
        <pre className="text-xs overflow-auto p-4 rounded-xl bg-black/30 text-white/80">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
