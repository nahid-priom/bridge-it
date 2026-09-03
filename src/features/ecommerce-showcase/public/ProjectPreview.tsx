'use client';

import { useState } from 'react';
import { formatBdt } from '@/lib/format/currency';
import { DevicePreview } from './DevicePreview';
import { PackageCards } from './PackageCards';
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

  return (
    <div className="pb-24">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{category}</p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-display text-3xl md:text-4xl font-black text-text-primary">{project.title}</h1>
            <p className="mt-2 text-text-secondary max-w-2xl">{project.short_description}</p>
            <p className="mt-3 text-lg font-semibold text-text-primary">Starting {formatBdt(project.starting_price)}</p>
          </div>
          <button
            type="button"
            onClick={() => setLeadOpen(true)}
            className="shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3"
          >
            Request Website
          </button>
        </div>
      </header>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <DevicePreview pages={project.pages} projectId={project.id} />
      </section>

      {project.packages.length > 0 ? (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 max-w-4xl">
          <h2 className="font-display text-xl font-black mb-4">Packages</h2>
          <PackageCards packages={project.packages} selectedId={packageId} onSelect={setPackageId} />
        </section>
      ) : null}

      {project.full_description ? (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 max-w-3xl">
          <h2 className="font-display text-2xl font-black mb-3">About this design</h2>
          <p className="text-text-secondary leading-relaxed whitespace-pre-line">{project.full_description}</p>
        </section>
      ) : null}

      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border-subtle bg-background/95 backdrop-blur px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setLeadOpen(true)}
          className="w-full rounded-xl bg-emerald-600 text-white font-semibold py-3"
        >
          Request Website
        </button>
      </div>

      {leadOpen ? (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface border border-border-subtle p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-lg">Free Consultation</h3>
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
