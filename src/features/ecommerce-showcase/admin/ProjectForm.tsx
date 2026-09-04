'use client';

import { useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { SHOWCASE_LISTING_KEY } from '@/lib/query/client';
import {
  createProjectAction,
  ensureDraftProjectAction,
  syncProjectHomepageSectionsAction,
  toggleProjectFlagAction,
  updateProjectAction,
} from '@/app/actions/ecommerce-showcase';
import { FieldSelect } from '@/components/ui/FieldSelect';
import { HOMEPAGE_SECTION_MAX, HOMEPAGE_SECTIONS, INDUSTRIES, TECHNOLOGY_OPTIONS, WEBSITE_TYPES } from '../config/constants';
import type { DeviceViewport } from '../config/constants';
import { defaultPreviewPage, pageHasImage } from '../config/page-types';
import { projectFormSchema, slugifyTitle, type ProjectFormValues } from '../schemas/project';
import type {
  EcommerceCategory,
  EcommercePackage,
  EcommerceProjectDetail,
  EcommerceProjectPage,
  HomepageSectionKey,
} from '../types';
import { isShowcaseEditorRole } from '../config/roles';
import type { AuthProfile } from '@/lib/auth/types';
import { AdminLivePreview } from './AdminLivePreview';
import { PackageManager } from './PackageManager';
import { PageScreenshotManager } from './PageScreenshotManager';
import { ProjectImageUploader } from './ProjectImageUploader';
import { SeoEditor } from './SeoEditor';
import { cmsInput, cmsSection } from './ui';

function applyPagePreviews(
  pages: EcommerceProjectPage[],
  previews: Record<string, string>
): EcommerceProjectPage[] {
  const next = pages.map((page) => {
    const overlay = previews[page.id] || previews[page.page_type];
    if (!overlay) return page;
    return { ...page, image_url: overlay, thumbnail_url: overlay, fallback_url: null };
  });
  if (previews.homepage && !next.some((page) => page.page_type === 'homepage')) {
    next.unshift({
      id: 'local-homepage',
      project_id: '',
      page_type: 'homepage',
      page_name: 'Homepage',
      slug: 'homepage',
      image_url: previews.homepage,
      image_path: null,
      fallback_url: null,
      fallback_path: null,
      thumbnail_url: previews.homepage,
      thumbnail_path: null,
      image_width: null,
      image_height: null,
      sort_order: 0,
      is_featured: false,
      published: true,
      created_at: '',
      updated_at: '',
      deleted_at: null,
    });
  }
  return next;
}

export function ProjectForm({
  profile,
  categories,
  project,
  homepageSections = [],
}: {
  profile: AuthProfile;
  categories: EcommerceCategory[];
  project?: EcommerceProjectDetail | null;
  homepageSections?: HomepageSectionKey[];
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const canEdit = isShowcaseEditorRole(profile.role);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pagePreviews, setPagePreviews] = useState<Record<string, string>>({});
  const [previewPageId, setPreviewPageId] = useState<string | undefined>(
    defaultPreviewPage(project?.pages ?? [])?.id
  );
  const [device, setDevice] = useState<DeviceViewport>('desktop');
  const [draftId, setDraftId] = useState<string | null>(project?.id ?? null);
  const draftIdRef = useRef<string | null>(project?.id ?? null);
  const ensuringRef = useRef<Promise<string | null> | null>(null);
  const homepageInputRef = useRef<HTMLInputElement | null>(null);
  const [values, setValues] = useState<ProjectFormValues>({
    title: project?.title ?? '',
    slug: project?.slug ?? '',
    short_description: project?.short_description ?? '',
    full_description: project?.full_description ?? '',
    category_id: project?.category_id ?? categories[0]?.id ?? '',
    technology_stack: project?.technology_stack ?? ['Next.js'],
    website_type: project?.website_type ?? WEBSITE_TYPES[0].id,
    industry: project?.industry ?? INDUSTRIES[0].id,
    starting_price: project?.starting_price ?? 0,
    currency: project?.currency ?? 'BDT',
    featured: project?.featured ?? false,
    published: project?.published ?? false,
    seo_title: project?.seo_title ?? '',
    seo_description: project?.seo_description ?? '',
    seo_keywords: project?.seo_keywords ?? [],
    sort_order: project?.sort_order ?? 0,
  });
  const [homeSections, setHomeSections] = useState<HomepageSectionKey[]>(homepageSections);

  const patch = (next: Partial<ProjectFormValues>) => setValues((current) => ({ ...current, ...next }));
  const pages = applyPagePreviews(project?.pages ?? [], pagePreviews);
  const packages: EcommercePackage[] = project?.packages ?? [];
  const projectId = project?.id ?? draftId;

  const seoPreviewTitle = useMemo(
    () => values.seo_title || values.title,
    [values.seo_title, values.title]
  );

  const canPublish = Boolean(
    values.title.trim() &&
      values.category_id &&
      Number(values.starting_price) > 0 &&
      (coverPreview || project?.cover_image_url) &&
      pages.some((page) => page.page_type === 'homepage' && pageHasImage(page))
  );

  const ensureProjectId = async () => {
    if (project?.id) return project.id;
    if (draftIdRef.current) return draftIdRef.current;
    if (ensuringRef.current) return ensuringRef.current;
    ensuringRef.current = (async () => {
      const result = await ensureDraftProjectAction({
        title: values.title,
        slug: values.slug,
        short_description: values.short_description,
        full_description: values.full_description,
        category_id: values.category_id,
        technology_stack: values.technology_stack,
        website_type: values.website_type,
        industry: values.industry,
        starting_price: values.starting_price,
        currency: values.currency,
      });
      ensuringRef.current = null;
      if (result.error || !result.data) {
        setError(result.error ?? 'Could not create draft');
        return null;
      }
      draftIdRef.current = result.data.id;
      setDraftId(result.data.id);
      return result.data.id;
    })();
    return ensuringRef.current;
  };

  const onAssetComplete = async () => {
    await queryClient.invalidateQueries({ queryKey: [SHOWCASE_LISTING_KEY] });
    const id = project?.id ?? draftIdRef.current;
    if (id && !project) {
      router.replace(`/admin/ecommerce-projects/${id}`);
      return;
    }
    router.refresh();
  };

  const save = () => {
    const parsed = projectFormSchema.safeParse({
      ...values,
      slug: values.slug || slugifyTitle(values.title),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Check the form');
      return;
    }
    setError(null);
    startTransition(async () => {
      if (!project && !draftIdRef.current) {
        const result = await createProjectAction(parsed.data);
        if (result.error) {
          setError(result.error);
          return;
        }
        if (result.data?.id) {
          const home = await syncProjectHomepageSectionsAction(result.data.id, homeSections);
          if ('error' in home && home.error) {
            setError(home.error);
            return;
          }
        }
        router.push(`/admin/ecommerce-projects/${result.data?.id}`);
        return;
      }
      const id = project?.id ?? draftIdRef.current;
      if (!id) return;
      const result = await updateProjectAction(id, parsed.data);
      if (result.error) {
        setError(result.error);
        return;
      }
      const home = await syncProjectHomepageSectionsAction(id, homeSections);
      if ('error' in home && home.error) setError(home.error);
      else await onAssetComplete();
    });
  };

  const techToggle = (name: string) => {
    patch({
      technology_stack: values.technology_stack.includes(name)
        ? values.technology_stack.filter((item) => item !== name)
        : [...values.technology_stack, name],
    });
  };

  const heading = project ? project.title : 'New project';
  const formColumn = (
    <div className="space-y-6 min-w-0">
      <section className={cmsSection}>
        <h2 className="font-display font-bold">Basic Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="text-sm">
            Project title
            <input
              value={values.title}
              disabled={!canEdit}
              onChange={(event) => {
                const title = event.target.value;
                patch({
                  title,
                  slug: project ? values.slug : slugifyTitle(title),
                });
              }}
              className={`mt-1 ${cmsInput}`}
            />
          </label>
          <label className="text-sm">
            Slug
            <input
              value={values.slug}
              disabled={!canEdit}
              onChange={(event) => patch({ slug: event.target.value })}
              className={`mt-1 ${cmsInput}`}
            />
          </label>
        </div>
        <label className="text-sm block">
          Short description
          <textarea
            value={values.short_description}
            disabled={!canEdit}
            onChange={(event) => patch({ short_description: event.target.value })}
            rows={2}
            className={`mt-1 ${cmsInput}`}
          />
        </label>
        <label className="text-sm block">
          Full description
          <textarea
            value={values.full_description}
            disabled={!canEdit}
            onChange={(event) => patch({ full_description: event.target.value })}
            rows={5}
            className={`mt-1 ${cmsInput}`}
          />
        </label>
        <label className="text-sm inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.featured}
            disabled={!canEdit}
            onChange={(event) => patch({ featured: event.target.checked })}
          />
          Featured
        </label>
      </section>

      <section className={cmsSection}>
        <h2 className="font-display font-bold">Homepage Visibility</h2>
        <p className="text-sm text-text-muted">
          Show this template in curated homepage sections. Each section allows at most{' '}
          {HOMEPAGE_SECTION_MAX} templates.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {HOMEPAGE_SECTIONS.map((section) => {
            const checked = homeSections.includes(section.key);
            return (
              <label key={section.key} className="text-sm inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!canEdit}
                  onChange={(event) => {
                    setHomeSections((current) =>
                      event.target.checked
                        ? [...current, section.key]
                        : current.filter((key) => key !== section.key)
                    );
                  }}
                />
                {section.title}
              </label>
            );
          })}
        </div>
      </section>

      <section className={cmsSection}>
        <h2 className="font-display font-bold">Pricing & Category</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="text-sm">
            Starting price
            <input
              type="number"
              min={0}
              value={values.starting_price}
              disabled={!canEdit}
              onChange={(event) => patch({ starting_price: Number(event.target.value) })}
              className={`mt-1 ${cmsInput}`}
            />
          </label>
          <label className="text-sm">
            Currency
            <FieldSelect
              className="mt-1"
              value={values.currency}
              disabled={!canEdit}
              onChange={(event) => patch({ currency: event.target.value })}
            >
              <option value="BDT">BDT</option>
              <option value="USD">USD</option>
            </FieldSelect>
          </label>
          <label className="text-sm">
            Category
            <FieldSelect
              className="mt-1"
              value={values.category_id}
              disabled={!canEdit}
              onChange={(event) => patch({ category_id: event.target.value })}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </FieldSelect>
          </label>
          <label className="text-sm">
            Website type
            <FieldSelect
              className="mt-1"
              value={values.website_type}
              disabled={!canEdit}
              onChange={(event) => patch({ website_type: event.target.value })}
            >
              {WEBSITE_TYPES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </FieldSelect>
          </label>
          <label className="text-sm">
            Industry
            <FieldSelect
              className="mt-1"
              value={values.industry}
              disabled={!canEdit}
              onChange={(event) => patch({ industry: event.target.value })}
            >
              {INDUSTRIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </FieldSelect>
          </label>
        </div>
        <div>
          <p className="text-sm mb-2">Technology stack</p>
          <div className="flex flex-wrap gap-2">
            {TECHNOLOGY_OPTIONS.map((tech) => (
              <button
                key={tech.slug}
                type="button"
                disabled={!canEdit}
                onClick={() => techToggle(tech.id)}
                className={`rounded-full px-3 py-1 text-xs border ${
                  values.technology_stack.includes(tech.id)
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-border-subtle'
                }`}
              >
                {tech.id}
              </button>
            ))}
          </div>
        </div>
      </section>

      <ProjectImageUploader
        projectId={projectId}
        coverUrl={project?.cover_image_url ?? null}
        fallbackUrl={project?.cover_fallback_url ?? null}
        previewUrl={coverPreview}
        canEdit={canEdit}
        onEnsureProject={ensureProjectId}
        onPreview={setCoverPreview}
        onComplete={onAssetComplete}
      />

      <PageScreenshotManager
        projectId={projectId}
        pages={pages}
        previews={pagePreviews}
        canEdit={canEdit}
        onEnsureProject={ensureProjectId}
        onPreview={(key, url) => {
          setPagePreviews((current) => {
            const next = { ...current };
            if (!url) delete next[key];
            else next[key] = url;
            return next;
          });
        }}
        onSelectPreview={setPreviewPageId}
        onComplete={onAssetComplete}
        homepageInputRef={homepageInputRef}
      />

      <SeoEditor
        title={seoPreviewTitle}
        seoTitle={values.seo_title ?? ''}
        seoDescription={values.seo_description ?? ''}
        seoKeywords={values.seo_keywords}
        slug={values.slug}
        canEdit={canEdit}
        onChange={(next) => patch(next)}
      />

      {projectId ? (
        <PackageManager projectId={projectId} packages={packages} canEdit={canEdit} />
      ) : (
        <p className="text-sm text-text-muted">Upload a cover or homepage to unlock packages.</p>
      )}
    </div>
  );

  const previewColumn = (
    <div className="min-w-0 max-w-full overflow-hidden xl:sticky xl:top-4">
      <AdminLivePreview
        pages={pages}
        projectId={project?.id}
        selectedPageId={previewPageId}
        onSelectPage={setPreviewPageId}
        device={device}
        onDeviceChange={setDevice}
        canEdit={canEdit}
        onUploadHomepage={() => homepageInputRef.current?.click()}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black">{heading}</h1>
          <p className="text-sm text-text-muted">
            {project ? (project.published ? 'Published' : 'Draft') : 'Add details, upload cover and homepage, then preview live.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project ? (
            <Link
              href={`/websites/${project.slug}${project.published ? '' : '?preview=1'}`}
              className="rounded-xl border border-border-subtle px-4 py-2 text-sm"
              target="_blank"
            >
              Preview
            </Link>
          ) : null}
          {canEdit && project ? (
            <button
              type="button"
              disabled={pending || (!project.published && !canPublish)}
              title={
                !project.published && !canPublish
                  ? 'Add title, category, starting price, cover, and homepage screenshot before publishing.'
                  : undefined
              }
              onClick={() =>
                startTransition(async () => {
                  const result = await toggleProjectFlagAction(project.id, 'published', !project.published);
                  if (result.error) setError(result.error);
                  else router.refresh();
                })
              }
              className="rounded-xl border border-border-subtle px-4 py-2 text-sm disabled:opacity-50"
            >
              {project.published ? 'Unpublish' : 'Publish'}
            </button>
          ) : null}
          {canEdit ? (
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? 'Saving…' : project ? 'Save details' : 'Create project'}
            </button>
          ) : null}
        </div>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-w-0">
        {formColumn}
        {previewColumn}
      </div>
    </div>
  );
}
