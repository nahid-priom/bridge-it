'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { slugify } from '@/lib/catalog/slugify';
import {
  upsertBitpProductAction,
  deleteBitpProductAction,
  upsertBitpPackageAction,
  deleteBitpPackageAction,
  upsertBitpPackageFeatureAction,
  deleteBitpPackageFeatureAction,
  getBitpProductForEditAction,
} from '@/app/actions/bitp-admin';
import { ProductCoverSection } from '@/components/admin/bitp/ProductCoverSection';
import type {
  BitpCategory,
  BitpProduct,
  BitpProductDetail,
  BitpProductPackage,
  BitpPackageFeature,
  PricingType,
  ProductStatus,
  ProductType,
} from '@/types/bitp';
import { cn } from '@/lib/cn';

type PackageDraft = BitpProductPackage & { features: BitpPackageFeature[]; _local?: boolean };

type BitpProductEditorProps = {
  productId?: string | null;
  categories: BitpCategory[];
  defaultCategoryId?: string;
  onClose: () => void;
  onSaved: () => void;
};

const PRODUCT_TYPES: ProductType[] = [
  'service',
  'software',
  'website',
  'marketing',
  'creative',
  'digital_product',
  'subscription',
];

const PRICING_TYPES: PricingType[] = [
  'fixed',
  'starting_from',
  'package',
  'custom_quote',
  'subscription',
];

const STATUSES: ProductStatus[] = ['draft', 'published', 'archived'];

function emptyProduct(defaultCategoryId?: string): Partial<BitpProduct> {
  return {
    category_id: defaultCategoryId ?? '',
    name: '',
    slug: '',
    short_description: '',
    full_description: '',
    product_type: 'service',
    pricing_type: 'starting_from',
    starting_price: 0,
    currency: 'BDT',
    delivery_time: '',
    status: 'draft',
    featured: false,
    popular: false,
    sort_order: 0,
    keywords: [],
    thumbnail: null,
    cover_image: null,
  };
}

export function BitpProductEditor({
  productId,
  categories,
  defaultCategoryId,
  onClose,
  onSaved,
}: BitpProductEditorProps) {
  const [tab, setTab] = useState<'core' | 'packages'>('core');
  const [form, setForm] = useState<Partial<BitpProduct>>(emptyProduct(defaultCategoryId));
  const [packages, setPackages] = useState<PackageDraft[]>([]);
  const [keywordsText, setKeywordsText] = useState('');
  const [loading, setLoading] = useState(Boolean(productId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const selectedCategory = categories.find((c) => c.id === form.category_id);

  const loadProduct = useCallback(async (id: string) => {
    setLoading(true);
    const result = await getBitpProductForEditAction(id);
    setLoading(false);
    if (result.error || !result.data) {
      setError(result.error ?? 'Failed to load product');
      return;
    }
    const p = result.data as BitpProductDetail;
    setForm(p);
    setKeywordsText((p.keywords ?? []).join(', '));
    setPackages(
      (p.packages ?? []).map((pkg) => ({
        ...pkg,
        features: pkg.features ?? [],
      }))
    );
  }, []);

  useEffect(() => {
    if (productId) loadProduct(productId);
  }, [productId, loadProduct]);

  const saveAll = async () => {
    setSaving(true);
    setError(null);

    const keywords = keywordsText
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const productPayload = {
      ...form,
      slug: form.slug?.trim() || slugify(form.name ?? ''),
      keywords,
    };

    const productResult = await upsertBitpProductAction(productPayload);
    if (productResult.error || !productResult.data) {
      setSaving(false);
      setError(productResult.error ?? 'Failed to save product');
      return;
    }

    const savedProduct = productResult.data;
    setForm(savedProduct);

    for (const pkg of packages) {
      const pkgResult = await upsertBitpPackageAction({
        id: pkg._local ? undefined : pkg.id,
        product_id: savedProduct.id,
        name: pkg.name,
        subtitle: pkg.subtitle,
        price: pkg.price,
        old_price: pkg.old_price,
        currency: pkg.currency ?? 'BDT',
        billing_type: pkg.billing_type ?? 'one_time',
        delivery_days: pkg.delivery_days,
        revision_count: pkg.revision_count,
        highlighted: pkg.highlighted,
        badge_text: pkg.badge_text,
        sort_order: pkg.sort_order,
        active: pkg.active,
      });

      if (pkgResult.error || !pkgResult.data) {
        setSaving(false);
        setError(pkgResult.error ?? `Failed to save package "${pkg.name}"`);
        return;
      }

      const savedPkg = pkgResult.data;
      for (const feat of pkg.features ?? []) {
        const featResult = await upsertBitpPackageFeatureAction({
          id: feat.id?.startsWith('local-') ? undefined : feat.id,
          package_id: savedPkg.id,
          feature_text: feat.feature_text,
          included: feat.included,
          sort_order: feat.sort_order,
        });
        if (featResult.error) {
          setSaving(false);
          setError(featResult.error);
          return;
        }
      }
    }

    setSaving(false);
    setSavedMsg('Product saved successfully.');
    onSaved();
    await loadProduct(savedProduct.id);
  };

  const handleDelete = async () => {
    if (!form.id) return;
    if (!confirm(`Delete product "${form.name}"?`)) return;
    setSaving(true);
    const result = await deleteBitpProductAction(form.id);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onSaved();
    onClose();
  };

  const addPackage = () => {
    setPackages((prev) => [
      ...prev,
      {
        id: `local-pkg-${Date.now()}`,
        product_id: form.id ?? '',
        name: 'New Package',
        subtitle: '',
        price: 0,
        old_price: null,
        currency: 'BDT',
        billing_type: 'one_time',
        delivery_days: null,
        revision_count: null,
        highlighted: false,
        badge_text: null,
        sort_order: prev.length + 1,
        active: true,
        created_at: '',
        updated_at: '',
        features: [],
        _local: true,
      },
    ]);
  };

  const removePackage = async (pkg: PackageDraft, index: number) => {
    if (!pkg._local && pkg.id) {
      const result = await deleteBitpPackageAction(pkg.id);
      if (result.error) {
        setError(result.error);
        return;
      }
    }
    setPackages((prev) => prev.filter((_, i) => i !== index));
  };

  const addFeature = (pkgIndex: number) => {
    setPackages((prev) =>
      prev.map((pkg, i) => {
        if (i !== pkgIndex) return pkg;
        const nextOrder = (pkg.features?.length ?? 0) + 1;
        return {
          ...pkg,
          features: [
            ...(pkg.features ?? []),
            {
              id: `local-feat-${Date.now()}`,
              package_id: pkg.id,
              feature_text: '',
              included: true,
              sort_order: nextOrder,
              created_at: '',
            },
          ],
        };
      })
    );
  };

  const removeFeature = async (pkgIndex: number, feat: BitpPackageFeature, featIndex: number) => {
    if (feat.id && !feat.id.startsWith('local-')) {
      const result = await deleteBitpPackageFeatureAction(feat.id);
      if (result.error) {
        setError(result.error);
        return;
      }
    }
    setPackages((prev) =>
      prev.map((pkg, i) =>
        i === pkgIndex
          ? { ...pkg, features: pkg.features?.filter((_, fi) => fi !== featIndex) ?? [] }
          : pkg
      )
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
        <p className="text-white">Loading product…</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 pt-10 pb-10">
      <button type="button" className="fixed inset-0 bg-black/60" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-bridge-dark shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-bridge-dark/95 backdrop-blur px-6 py-4">
          <h3 className="text-lg font-bold text-white">{productId ? 'Edit Product' : 'Add Product'}</h3>
          <button type="button" onClick={onClose} className="p-1 text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 px-6 pt-4 border-b border-white/5 pb-0">
          {(['core', 'packages'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2 text-sm font-semibold capitalize border-b-2 -mb-px',
                tab === t ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-white/50'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {savedMsg && <p className="text-sm text-emerald-400">{savedMsg}</p>}

          {tab === 'core' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-xs text-white/60 sm:col-span-2">
                Category
                <select
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={form.category_id ?? ''}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-white/60">
                Name
                <input
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={form.name ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                      slug: productId ? form.slug : slugify(e.target.value),
                    })
                  }
                />
              </label>
              <label className="block text-xs text-white/60">
                Slug
                <input
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white font-mono text-sm"
                  value={form.slug ?? ''}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </label>
              <label className="block text-xs text-white/60 sm:col-span-2">
                Short description
                <textarea
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white min-h-[60px]"
                  value={form.short_description ?? ''}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                />
              </label>
              <label className="block text-xs text-white/60 sm:col-span-2">
                Full description
                <textarea
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white min-h-[100px]"
                  value={form.full_description ?? ''}
                  onChange={(e) => setForm({ ...form, full_description: e.target.value })}
                />
              </label>
              <label className="block text-xs text-white/60">
                Product type
                <select
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={form.product_type ?? 'service'}
                  onChange={(e) => setForm({ ...form, product_type: e.target.value as ProductType })}
                >
                  {PRODUCT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-white/60">
                Pricing type
                <select
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={form.pricing_type ?? 'starting_from'}
                  onChange={(e) => setForm({ ...form, pricing_type: e.target.value as PricingType })}
                >
                  {PRICING_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-white/60">
                Starting price (BDT)
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={form.starting_price ?? 0}
                  onChange={(e) => setForm({ ...form, starting_price: Number(e.target.value) })}
                />
              </label>
              <label className="block text-xs text-white/60">
                Delivery time
                <input
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={form.delivery_time ?? ''}
                  onChange={(e) => setForm({ ...form, delivery_time: e.target.value })}
                />
              </label>
              <label className="block text-xs text-white/60">
                Status
                <select
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={form.status ?? 'draft'}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-white/60">
                Sort order
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={form.sort_order ?? 0}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                />
              </label>
              <label className="block text-xs text-white/60 sm:col-span-2">
                Keywords (comma-separated)
                <input
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={keywordsText}
                  onChange={(e) => setKeywordsText(e.target.value)}
                />
              </label>
              <div className="flex gap-4 sm:col-span-2">
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={form.featured ?? false}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={form.popular ?? false}
                    onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                  />
                  Popular
                </label>
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={form.showroom_featured ?? false}
                    onChange={(e) => setForm({ ...form, showroom_featured: e.target.checked })}
                  />
                  Showroom featured
                </label>
              </div>
              <label className="block text-xs text-white/60 sm:col-span-2">
                Target customer (best for)
                <input
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={form.target_customer ?? ''}
                  onChange={(e) => setForm({ ...form, target_customer: e.target.value })}
                />
              </label>
              <label className="block text-xs text-white/60">
                Internal demo slug
                <input
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white font-mono text-sm"
                  value={form.internal_demo_slug ?? ''}
                  onChange={(e) => setForm({ ...form, internal_demo_slug: e.target.value })}
                  placeholder="e.g. basic-stock"
                />
              </label>
              <label className="block text-xs text-white/60">
                Promotional price (BDT)
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={form.promotional_price ?? ''}
                  onChange={(e) => setForm({ ...form, promotional_price: e.target.value ? Number(e.target.value) : null })}
                />
              </label>
              <label className="block text-xs text-white/60">
                Demo URL
                <input
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={form.demo_url ?? ''}
                  onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
                />
              </label>
              <label className="block text-xs text-white/60">
                Preview URL
                <input
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={form.preview_url ?? ''}
                  onChange={(e) => setForm({ ...form, preview_url: e.target.value })}
                />
              </label>
              <ProductCoverSection
                form={form}
                categoryName={selectedCategory?.name}
                onUpdated={(updates) => {
                  setForm((prev) => ({ ...prev, ...updates }));
                  onSaved();
                }}
              />
            </div>
          )}

          {tab === 'packages' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-white/60">Manage pricing packages and feature matrix.</p>
                <button
                  type="button"
                  onClick={addPackage}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white"
                >
                  <Plus className="w-3.5 h-3.5" /> Add package
                </button>
              </div>
              {packages.length === 0 ? (
                <p className="text-sm text-white/40">No packages yet.</p>
              ) : (
                packages.map((pkg, pkgIndex) => (
                  <div key={pkg.id} className="rounded-xl border border-white/10 p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="grid sm:grid-cols-2 gap-2 flex-1">
                        <input
                          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm"
                          placeholder="Package name"
                          value={pkg.name}
                          onChange={(e) =>
                            setPackages((prev) =>
                              prev.map((p, i) => (i === pkgIndex ? { ...p, name: e.target.value } : p))
                            )
                          }
                        />
                        <input
                          type="number"
                          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm"
                          placeholder="Price"
                          value={pkg.price}
                          onChange={(e) =>
                            setPackages((prev) =>
                              prev.map((p, i) =>
                                i === pkgIndex ? { ...p, price: Number(e.target.value) } : p
                              )
                            )
                          }
                        />
                        <input
                          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm sm:col-span-2"
                          placeholder="Subtitle"
                          value={pkg.subtitle ?? ''}
                          onChange={(e) =>
                            setPackages((prev) =>
                              prev.map((p, i) => (i === pkgIndex ? { ...p, subtitle: e.target.value } : p))
                            )
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePackage(pkg, pkgIndex)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-semibold text-white/50 uppercase">Features</p>
                        <button
                          type="button"
                          onClick={() => addFeature(pkgIndex)}
                          className="text-xs text-emerald-400 hover:underline"
                        >
                          + Add feature
                        </button>
                      </div>
                      {(pkg.features ?? []).map((feat, featIndex) => (
                        <div key={feat.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={feat.included}
                            onChange={(e) =>
                              setPackages((prev) =>
                                prev.map((p, i) =>
                                  i === pkgIndex
                                    ? {
                                        ...p,
                                        features: p.features?.map((f, fi) =>
                                          fi === featIndex ? { ...f, included: e.target.checked } : f
                                        ),
                                      }
                                    : p
                                )
                              )
                            }
                          />
                          <input
                            className="flex-1 rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-white text-sm"
                            value={feat.feature_text}
                            onChange={(e) =>
                              setPackages((prev) =>
                                prev.map((p, i) =>
                                  i === pkgIndex
                                    ? {
                                        ...p,
                                        features: p.features?.map((f, fi) =>
                                          fi === featIndex ? { ...f, feature_text: e.target.value } : f
                                        ),
                                      }
                                    : p
                                )
                              )
                            }
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(pkgIndex, feat, featIndex)}
                            className="p-1 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 flex gap-2 justify-end border-t border-white/10 bg-bridge-dark/95 backdrop-blur px-6 py-4">
          {form.id && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-sm text-red-400 border border-red-400/30 mr-auto"
            >
              Delete product
            </button>
          )}
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-white/70 border border-white/10">
            Cancel
          </button>
          <button
            type="button"
            onClick={saveAll}
            disabled={saving}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500',
              saving && 'opacity-60'
            )}
          >
            {saving ? 'Saving…' : 'Save product'}
          </button>
        </div>
      </div>
    </div>
  );
}
