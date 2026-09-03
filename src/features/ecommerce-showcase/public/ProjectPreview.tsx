'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DevicePreview } from './DevicePreview';
import { PackageCards } from './PackageCards';
import { CardTechIcons } from './CardTechIcons';
import { LeadForm } from './LeadForm';
import type { EcommerceProjectDetail } from '../types';
import { INDUSTRIES } from '../config/constants';

function industryLabel(value: string | null | undefined) {
  if (!value) return null;
  return INDUSTRIES.find((item) => item.id === value)?.label ?? value;
}

export function ProjectPreview({ project }: { project: EcommerceProjectDetail }) {
  const [packageId, setPackageId] = useState(
    project.packages.find((item) => item.is_popular)?.id ?? project.packages[0]?.id
  );
  const [leadOpen, setLeadOpen] = useState(false);
  const category = project.category?.name ?? industryLabel(project.industry) ?? 'E-commerce Solutions';
  const orderHref = `/websites/${project.slug}/order${packageId ? `?package=${packageId}` : ''}`;

  const info = (
    <div className="flex min-w-0 flex-col">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#2563eb] dark:text-[#60a5fa]">{category}</p>
      <h1 className="mt-2 font-display text-[1.75rem] font-black leading-tight text-text-primary sm:text-3xl lg:text-[1.85rem] xl:text-3xl">
        {project.title}
      </h1>
      {project.short_description ? (
        <p className="mt-3 text-sm leading-relaxed text-text-secondary lg:text-[15px]">{project.short_description}</p>
      ) : null}
      <div className="mt-4 flex min-w-0 max-w-full flex-col gap-1.5 lg:hidden">
        <p className="flex min-h-5 items-baseline gap-2 text-sm leading-none">
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
            Delivery
          </span>
          <span className="font-semibold text-text-primary">3–7 Days</span>
        </p>
        <div className="min-w-0">
          <CardTechIcons
            seed={project.id}
            stack={project.technology_stack}
            count={Math.max(project.technology_stack.length, 4)}
            size="sm"
            showLabels
            scrollable
          />
        </div>
      </div>
      <dl className="mt-5 hidden space-y-4 lg:block">
        <div>
          <dt className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">Technology</dt>
          <dd>
            <CardTechIcons
              seed={project.id}
              stack={project.technology_stack}
              count={4}
              size="md"
              showLabels
            />
          </dd>
        </div>
        <div>
          <dt className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">Delivery time</dt>
          <dd className="text-sm font-semibold text-text-primary">3–7 Days</dd>
        </div>
      </dl>
      <div className="mt-5 hidden flex-col gap-2.5 lg:flex">
        <Link
          href={orderHref}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2563eb] px-5 py-3 text-center font-semibold text-white hover:bg-[#1d4ed8]"
        >
          Order website
        </Link>
        <button
          type="button"
          onClick={() => setLeadOpen(true)}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold text-text-primary hover:bg-slate-50 dark:border-white/20 dark:hover:bg-white/5"
        >
          Free consultation
        </button>
      </div>
    </div>
  );

  return (
    <div className="pb-28 lg:pb-16">
      <div className="mx-auto w-full max-w-[1480px] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 xl:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(280px,0.3fr)] lg:items-start lg:gap-8 xl:gap-10">
          <aside className="min-w-0 lg:order-2 lg:sticky lg:top-[calc(var(--header-offset)+0.75rem)]">
            {info}
          </aside>
          <section className="min-w-0 lg:order-1" aria-label="Live website preview">
            <DevicePreview pages={project.pages} projectId={project.id} projectTitle={project.title} fillWidth />
          </section>
        </div>

        {project.packages.length > 0 ? (
          <section className="mt-10 lg:mt-14">
            <h2 className="mb-4 font-display text-xl font-black">Packages</h2>
            <PackageCards packages={project.packages} selectedId={packageId} onSelect={setPackageId} />
          </section>
        ) : null}

        {project.full_description ? (
          <section className="mt-10 max-w-3xl lg:mt-14">
            <h2 className="mb-3 font-display text-2xl font-black">About this design</h2>
            <p className="whitespace-pre-line leading-relaxed text-text-secondary">{project.full_description}</p>
          </section>
        ) : null}
      </div>

      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border-subtle bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <Link href={orderHref} className="flex-1 rounded-xl bg-[#2563eb] py-3 text-center font-semibold text-white">
            Order website
          </Link>
          <button
            type="button"
            onClick={() => setLeadOpen(true)}
            className="flex-1 rounded-xl border border-slate-300 py-3 font-semibold dark:border-white/20"
          >
            Consult
          </button>
        </div>
      </div>

      {leadOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Free Consultation</h3>
              <button type="button" onClick={() => setLeadOpen(false)} className="text-sm text-text-muted">
                Close
              </button>
            </div>
            <LeadForm
              projectId={project.id}
              packages={project.packages}
              defaultPackageId={packageId}
              onClose={() => setLeadOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
