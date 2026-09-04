'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { formatBdt } from '@/lib/format/currency';
import { deleteBitpProductAction } from '@/app/actions/bitp-admin';
import { BitpProductEditor } from '@/components/admin/bitp/BitpProductEditor';
import type { BitpProduct, BitpCategory } from '@/types/bitp';
import type { EcommerceProjectCard } from '@/src/features/ecommerce-showcase/types';
import { BITP_ECOMMERCE_SOLUTIONS_SLUG } from '@/src/features/ecommerce-showcase/config/constants';
import { INDUSTRIES } from '@/src/features/ecommerce-showcase/config/constants';
import { cn } from '@/lib/cn';
import { DataTableSkeleton } from '@/src/components/skeletons/DataTableSkeleton';

type ShowcaseCatalogCard = EcommerceProjectCard & {
  catalog_category_slug?: string;
  catalog_category_name?: string;
};

type CatalogRow = {
  key: string;
  source: 'bitp' | 'ecommerce_project';
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  industry: string | null;
  startingPrice: number;
  cover: string | null;
  published: boolean;
  featured: boolean;
  editHref: string;
  previewHref: string;
};

function industryLabel(value: string | null | undefined) {
  if (!value) return null;
  return INDUSTRIES.find((item) => item.id === value)?.label ?? value;
}

function toBitpRow(product: BitpProduct): CatalogRow {
  return {
    key: `bitp:${product.id}`,
    source: 'bitp',
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryName: product.category?.name ?? '—',
    categorySlug: product.category?.slug ?? '',
    industry: null,
    startingPrice: Number(product.starting_price),
    cover: product.cover_image || product.thumbnail,
    published: product.status === 'published',
    featured: Boolean(product.featured),
    editHref: '',
    previewHref: `/solutions/${product.slug}`,
  };
}

function toShowcaseRow(project: ShowcaseCatalogCard): CatalogRow {
  return {
    key: `showcase:${project.id}`,
    source: 'ecommerce_project',
    id: project.id,
    name: project.title,
    slug: project.slug,
    categoryName: project.catalog_category_name ?? 'E-commerce Solutions',
    categorySlug: project.catalog_category_slug ?? BITP_ECOMMERCE_SOLUTIONS_SLUG,
    industry: industryLabel(project.industry),
    startingPrice: Number(project.starting_price),
    cover: project.cover_fallback_url || project.cover_image_url,
    published: Boolean(project.published),
    featured: Boolean(project.featured),
    editHref: `/admin/ecommerce-projects/${project.id}`,
    previewHref: project.published ? `/websites/${project.slug}` : `/websites/${project.slug}?preview=1`,
  };
}

export function AdminBitpProductsSection() {
  const [products, setProducts] = useState<BitpProduct[]>([]);
  const [showcaseProjects, setShowcaseProjects] = useState<ShowcaseCatalogCard[]>([]);
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
    setShowcaseProjects(prodRes.showcaseProjects ?? []);
    setCategories(catRes.categories ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const catalog = useMemo(() => {
    const bitpRows = products
      .filter((product) => product.category?.slug !== BITP_ECOMMERCE_SOLUTIONS_SLUG)
      .map(toBitpRow);
    const showcaseRows = showcaseProjects.map(toShowcaseRow);
    return [...showcaseRows, ...bitpRows];
  }, [products, showcaseProjects]);

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return catalog;
    return catalog.filter((row) => row.categorySlug === categoryFilter);
  }, [catalog, categoryFilter]);

  const categoryChips = useMemo(() => {
    const preferredOrder = [
      BITP_ECOMMERCE_SOLUTIONS_SLUG,
      'software-solutions',
      'creative-digital-marketing',
      'web-app-solutions',
    ];
    const chips = categories.filter(
      (item) =>
        item.is_active !== false &&
        !['digital-marketing', 'graphics-creative'].includes(item.slug)
    );
    if (!chips.some((item) => item.slug === BITP_ECOMMERCE_SOLUTIONS_SLUG)) {
      chips.unshift({
        id: 'ecommerce-solutions-virtual',
        name: 'E-commerce Solutions',
        slug: BITP_ECOMMERCE_SOLUTIONS_SLUG,
        description: null,
        icon: '🛒',
        sort_order: 0,
        is_active: true,
        created_at: '',
        updated_at: '',
      });
    }
    const renamed = chips.map((item) => {
      if (item.slug === 'creative-digital-marketing') {
        return { ...item, name: 'Creative & Digital Marketing' };
      }
      if (item.slug === 'software-solutions') {
        return { ...item, name: 'Software Solutions' };
      }
      if (item.slug === 'web-app-solutions') {
        return { ...item, name: 'Web & App Solutions' };
      }
      return item;
    });
    return renamed.sort((a, b) => {
      const ai = preferredOrder.indexOf(a.slug);
      const bi = preferredOrder.indexOf(b.slug);
      if (ai === -1 && bi === -1) return a.sort_order - b.sort_order;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [categories]);

  const countFor = (slug: string) => {
    if (slug === 'all') return catalog.length;
    return catalog.filter((row) => row.categorySlug === slug).length;
  };

  const defaultCategoryId = useMemo(() => {
    if (categoryFilter === 'all' || categoryFilter === BITP_ECOMMERCE_SOLUTIONS_SLUG) {
      return categories.find((c) => c.slug !== BITP_ECOMMERCE_SOLUTIONS_SLUG)?.id ?? categories[0]?.id;
    }
    return categories.find((c) => c.slug === categoryFilter || c.id === categoryFilter)?.id;
  }, [categories, categoryFilter]);

  const openCreate = () => {
    if (categoryFilter === BITP_ECOMMERCE_SOLUTIONS_SLUG) {
      window.location.href = '/admin/ecommerce-projects/new';
      return;
    }
    setEditingId(null);
    setEditorOpen(true);
  };

  const openEditBitp = (id: string) => {
    setEditingId(id);
    setEditorOpen(true);
  };

  const handleDeleteBitp = async (product: CatalogRow) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    const result = await deleteBitpProductAction(product.id);
    if (result.error) alert(result.error);
    else load();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white">Products & Services</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/ecommerce-projects/homepage"
            className="inline-flex items-center rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
          >
            Homepage Curation
          </Link>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
        </div>
        <DataTableSkeleton columns={6} rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">Products & Services</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/ecommerce-projects/homepage"
            className="inline-flex items-center rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
          >
            Homepage Curation
          </Link>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
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
          All ({countFor('all')})
        </button>
        {categoryChips.map((c) => (
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
            {c.icon} {c.name} ({countFor(c.slug)})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 px-6 py-14 text-center">
          <p className="text-white/80">No products in this category.</p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/60">
                <th className="p-3">Cover</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Industry</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 w-36">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.key} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-3">
                    {row.cover ? (
                      <img src={row.cover} alt="" className="h-12 w-20 rounded-md object-cover bg-white/5" />
                    ) : (
                      <span className="text-xs text-white/40">Cover image not uploaded</span>
                    )}
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-white">{row.name}</p>
                    {row.featured ? <p className="text-[11px] text-emerald-400">Featured</p> : null}
                  </td>
                  <td className="p-3 text-white/70">{row.categoryName}</td>
                  <td className="p-3 text-white/70">{row.industry ?? '—'}</td>
                  <td className="p-3 text-white/80">{formatBdt(row.startingPrice)}</td>
                  <td className="p-3 capitalize text-white/70">{row.published ? 'Published' : 'Draft'}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {row.source === 'ecommerce_project' ? (
                        <Link
                          href={row.editHref}
                          className="p-2 rounded-lg text-white/60 hover:text-emerald-400 hover:bg-white/5"
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openEditBitp(row.id)}
                          className="p-2 rounded-lg text-white/60 hover:text-emerald-400 hover:bg-white/5"
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      <a
                        href={row.previewHref}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5"
                        aria-label="Preview"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      {row.source === 'bitp' ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteBitp(row)}
                          className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-white/5"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : null}
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
          categories={categories.filter((c) => c.slug !== BITP_ECOMMERCE_SOLUTIONS_SLUG)}
          defaultCategoryId={defaultCategoryId}
          onClose={() => setEditorOpen(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
