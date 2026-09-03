'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { BitpCategoryForm } from '@/components/admin/bitp/BitpCategoryForm';
import { BitpOrderManager } from '@/components/admin/bitp/BitpOrderManager';
import { BitpProjectManager } from '@/components/admin/bitp/BitpProjectManager';
import { BitpPaymentManager } from '@/components/admin/bitp/BitpPaymentManager';
import { BitpSoftwareDemoEditor } from '@/components/admin/bitp/BitpSoftwareDemoEditor';
import { AdminBitpConsultationsSection } from '@/components/admin/sections/AdminBitpConsultationsSection';
import type { BitpOrder, BitpCategory } from '@/types/bitp';
import { cn } from '@/lib/cn';
import { DataTableSkeleton } from '@/src/components/skeletons/DataTableSkeleton';
import { ListSkeleton } from '@/src/components/skeletons/ListSkeleton';

export { AdminBitpProductsSection } from '@/components/admin/sections/AdminBitpProductsCatalog';


export function AdminBitpCategoriesSection() {
  const [categories, setCategories] = useState<BitpCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BitpCategory | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bitp/categories').then((r) => r.json());
      setCategories(res.categories ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Categories</h2>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <ListSkeleton rows={6} />
      ) : categories.length === 0 ? (
        <p className="text-sm text-white/50">No categories yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                  <p className="mt-2 font-bold text-white">{c.name}</p>
                  <p className="font-mono text-sm text-white/50">{c.slug}</p>
                  {!c.is_active && <p className="mt-1 text-xs text-amber-400">Inactive</p>}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(c);
                    setFormOpen(true);
                  }}
                  className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-emerald-400"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Order Management</h2>
        <DataTableSkeleton columns={5} rows={6} />
      </div>
    );
  }

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/bitp/settings')
      .then((r) => r.json())
      .then((d) => setSettings(d.settings ?? {}))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Site Content</h2>
      {loading ? (
        <ListSkeleton rows={4} />
      ) : Object.keys(settings).length === 0 ? (
        <p className="text-sm text-white/50">No content settings yet.</p>
      ) : (
        <div className="space-y-2">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="rounded-xl border border-white/10 p-3">
              <p className="font-mono text-xs text-white/50">{key}</p>
              <p className="mt-1 text-sm text-white/80">{value}</p>
            </div>
          ))}
        </div>
      )}
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

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Project Management</h2>
        <DataTableSkeleton columns={5} rows={6} />
      </div>
    );
  }

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

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Payment Verification</h2>
        <DataTableSkeleton columns={5} rows={6} />
      </div>
    );
  }

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
  const [configs, setConfigs] = useState<
    { id: string; demo_slug: string; active: boolean; products: { slug: string; name: string } | null }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/bitp/ecommerce-demos')
      .then((r) => r.json())
      .then((d) => setConfigs(d.configs ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">E-commerce Demo Configs</h2>
      <p className="text-sm text-white/60">Read-only list. Edit product showroom fields in Products & Services.</p>
      {loading ? (
        <ListSkeleton rows={4} />
      ) : configs.length === 0 ? (
        <p className="text-sm text-white/50">No demo configs found.</p>
      ) : (
        <ul className="space-y-2">
          {configs.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 p-4">
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(endpoint)
      .then((r) => r.json())
      .then((d) => setData((Object.values(d)[0] as unknown[]) ?? []))
      .finally(() => setLoading(false));
  }, [endpoint]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {loading ? (
        <DataTableSkeleton columns={4} rows={5} />
      ) : data.length === 0 ? (
        <p className="text-sm text-white/50">No records yet.</p>
      ) : (
        <pre className="overflow-auto rounded-xl bg-black/30 p-4 text-xs text-white/80">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
