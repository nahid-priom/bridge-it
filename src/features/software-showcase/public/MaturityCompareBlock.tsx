import Link from 'next/link';
import { Fragment } from 'react';
import { productPath } from '@/src/features/catalog/utils/paths';
import {
  compareGroupsForIndustry,
  ladderForIndustry,
  type CompareFeatureGroup,
  type LadderStep,
} from '../config/maturity-ladder';
import type { SoftwareProjectCard } from '../types';

export function MaturityCompareBlock({
  industrySlug,
  products,
}: {
  industrySlug: string;
  products: SoftwareProjectCard[];
}) {
  const ladder = ladderForIndustry(industrySlug);
  const groups = compareGroupsForIndustry(industrySlug);
  if (!ladder || !groups) return null;

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const steps = ladder.filter((step) => bySlug.has(step.slug));
  if (steps.length < 2) return null;

  return (
    <section
      className="mt-10 rounded-2xl border border-border-subtle bg-surface px-4 py-5 sm:px-6 sm:py-6"
      aria-labelledby="compare-solutions"
    >
      <h2 id="compare-solutions" className="font-display text-lg font-bold text-[#0f2744] dark:text-white">
        Compare solutions
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        Pick the maturity that matches your operation — each product is a full solution with its own price.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="py-2 pr-3 font-semibold text-text-secondary">Capability</th>
              {steps.map((step) => {
                const product = bySlug.get(step.slug)!;
                return (
                  <th key={step.slug} className="px-2 py-2 text-center font-semibold text-text-primary">
                    <Link
                      href={product.canonical_path || productPath('software', industrySlug, step.slug)}
                      className="hover:text-[#2563eb] hover:underline"
                    >
                      {step.shortLabel}
                    </Link>
                    <div className="mt-0.5 text-xs font-medium text-text-muted">{step.priceLabel}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <CompareGroupRows key={group.group} group={group} steps={steps} ladder={ladder} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CompareGroupRows({
  group,
  steps,
  ladder,
}: {
  group: CompareFeatureGroup;
  steps: LadderStep[];
  ladder: LadderStep[];
}) {
  return (
    <Fragment>
      <tr className="border-b border-border-subtle bg-background-soft/60">
        <td
          colSpan={steps.length + 1}
          className="py-2 pr-3 text-xs font-bold uppercase tracking-wide text-text-muted"
        >
          {group.group}
        </td>
      </tr>
      {group.features.map((feature) => (
        <tr key={feature.label} className="border-b border-border-subtle last:border-0">
          <td className="py-2.5 pr-3 text-text-primary">{feature.label}</td>
          {steps.map((step) => {
            const ladderIndex = ladder.findIndex((s) => s.slug === step.slug);
            const included = ladderIndex >= feature.fromIndex;
            return (
              <td key={step.slug} className="px-2 py-2.5 text-center">
                {included ? (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    ✓
                  </span>
                ) : (
                  <span className="text-text-muted">—</span>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </Fragment>
  );
}
