'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatBdt } from '@/lib/format/currency';
import {
  purgeProjectAction,
  restoreProjectAction,
  softDeleteProjectAction,
  toggleProjectFlagAction,
} from '@/app/actions/ecommerce-showcase';
import type { EcommerceProjectCard } from '../types';
import { isShowcaseEditorRole, isSuperAdminRole } from '../config/roles';
import type { AuthProfile } from '@/lib/auth/types';
import { FieldSelect } from '@/components/ui/FieldSelect';
import { cmsInput } from './ui';

export function ProjectList({
  projects,
  deletedProjects = [],
  profile,
}: {
  projects: EcommerceProjectCard[];
  deletedProjects?: EcommerceProjectCard[];
  profile: AuthProfile;
}) {
  const router = useRouter();
  const canEdit = isShowcaseEditorRole(profile.role);
  const isSuperAdmin = isSuperAdminRole(profile.role);
  const [q, setQ] = useState('');
  const [published, setPublished] = useState<'all' | 'yes' | 'no'>('all');
  const [featured, setFeatured] = useState<'all' | 'yes' | 'no'>('all');
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return projects.filter((item) => {
      if (q && !`${item.title} ${item.industry ?? ''} ${item.category_name ?? ''}`.toLowerCase().includes(q.toLowerCase())) {
        return false;
      }
      if (published === 'yes' && !item.published) return false;
      if (published === 'no' && item.published) return false;
      if (featured === 'yes' && !item.featured) return false;
      if (featured === 'no' && item.featured) return false;
      return true;
    });
  }, [projects, q, published, featured]);

  const stats = {
    total: projects.length,
    published: projects.filter((item) => item.published).length,
    drafts: projects.filter((item) => !item.published).length,
    featured: projects.filter((item) => item.featured).length,
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-black">E-commerce Projects</h1>
          <p className="text-sm text-text-muted mt-1">Manage showcase websites, screenshots, packages, and SEO.</p>
        </div>
        {canEdit ? (
          <Link
            href="/admin/ecommerce-projects/new"
            className="inline-flex justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add New Project
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          ['Total', stats.total],
          ['Published', stats.published],
          ['Drafts', stats.drafts],
          ['Featured', stats.featured],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-border-subtle bg-surface p-4">
            <p className="text-xs text-text-muted">{label}</p>
            <p className="text-2xl font-black mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search projects"
          className={`${cmsInput} min-w-[200px]`}
        />
        <FieldSelect
          value={published}
          onChange={(event) => setPublished(event.target.value as typeof published)}
        >
          <option value="all">Published: all</option>
          <option value="yes">Published</option>
          <option value="no">Draft</option>
        </FieldSelect>
        <FieldSelect
          value={featured}
          onChange={(event) => setFeatured(event.target.value as typeof featured)}
        >
          <option value="all">Featured: all</option>
          <option value="yes">Featured</option>
          <option value="no">Not featured</option>
        </FieldSelect>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead className="text-left text-text-muted border-b border-border-subtle">
            <tr>
              <th className="p-3">Cover</th>
              <th className="p-3">Project</th>
              <th className="p-3">Category</th>
              <th className="p-3">Industry</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((project) => (
              <tr key={project.id} className="border-b border-border-subtle">
                <td className="p-3">
                  {project.cover_image_url ? (
                    <img
                      src={project.cover_fallback_url || project.cover_image_url}
                      alt=""
                      className="h-12 w-[4.5rem] rounded-md object-contain bg-[#eef2f6]"
                    />
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs text-text-muted">Cover image not uploaded</p>
                      {canEdit ? (
                        <Link href={`/admin/ecommerce-projects/${project.id}`} className="text-xs text-emerald-600">
                          Upload Cover
                        </Link>
                      ) : null}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <p className="font-semibold">{project.title}</p>
                  <p className="text-xs text-text-muted">{project.slug}</p>
                </td>
                <td className="p-3">{project.category_name ?? 'E-commerce Solutions'}</td>
                <td className="p-3">{project.industry ?? '—'}</td>
                <td className="p-3">{formatBdt(project.starting_price)}</td>
                <td className="p-3">
                  <span className={project.published ? 'text-emerald-600' : 'text-amber-600'}>
                    {project.published ? 'Published' : 'Draft'}
                  </span>
                  {project.featured ? <span className="ml-2 text-xs text-emerald-600">Featured</span> : null}
                </td>
                <td className="p-3 text-right space-x-2 whitespace-nowrap">
                  <Link href={`/admin/ecommerce-projects/${project.id}`} className="text-emerald-600">
                    Edit
                  </Link>
                  {project.published ? (
                    <Link href={`/websites/${project.slug}`} className="text-text-muted" target="_blank">
                      Preview
                    </Link>
                  ) : (
                    <Link href={`/websites/${project.slug}?preview=1`} className="text-text-muted" target="_blank">
                      Preview
                    </Link>
                  )}
                  {canEdit ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          const result = await toggleProjectFlagAction(project.id, 'published', !project.published);
                          if (result.error) alert(result.error);
                          else router.refresh();
                        })
                      }
                      className="text-text-muted"
                    >
                      {project.published ? 'Unpublish' : 'Publish'}
                    </button>
                  ) : null}
                  {canEdit ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          await softDeleteProjectAction(project.id);
                          router.refresh();
                        })
                      }
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? <p className="p-6 text-sm text-text-muted">No projects match.</p> : null}
      </div>

      {isSuperAdmin && deletedProjects.length > 0 ? (
        <div className="mt-10">
          <h2 className="font-display text-lg font-bold mb-3">Deleted projects</h2>
          <div className="overflow-x-auto rounded-2xl border border-border-subtle">
            <table className="w-full text-sm">
              <tbody>
                {deletedProjects.map((project) => (
                  <tr key={project.id} className="border-b border-border-subtle">
                    <td className="p-3">
                      <p className="font-semibold">{project.title}</p>
                      <p className="text-xs text-text-muted">{project.slug}</p>
                    </td>
                    <td className="p-3 text-right space-x-3">
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() =>
                          startTransition(async () => {
                            await restoreProjectAction(project.id);
                            router.refresh();
                          })
                        }
                        className="text-emerald-600"
                      >
                        Restore
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() =>
                          startTransition(async () => {
                            await purgeProjectAction(project.id);
                            router.refresh();
                          })
                        }
                        className="text-red-500"
                      >
                        Purge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
