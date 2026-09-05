import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { CatalogCategoryRoot, CatalogIndustry } from '../types';
import { industryPath } from '../utils/paths';

export function IndustryCard({
  industry,
  root,
  className,
}: {
  industry: CatalogIndustry;
  root: CatalogCategoryRoot;
  className?: string;
}) {
  const href = industryPath(root, industry.slug);
  const desc = industry.short_description?.trim() || industry.seo_intro?.trim();

  return (
    <article
      className={cn(
        'group flex h-full flex-col rounded-2xl border border-border-subtle bg-surface p-3 sm:p-4',
        'transition-[border-color,box-shadow] duration-300 hover:border-[#2563eb]/45',
        className
      )}
    >
      <h3 className="font-display text-sm font-bold leading-snug text-[#0f2744] dark:text-white sm:text-base">
        <Link href={href} className="hover:text-[#2563eb]">
          {industry.name}
        </Link>
      </h3>
      {desc ? (
        <p className="mt-1.5 line-clamp-2 flex-1 text-xs text-text-secondary sm:text-sm">{desc}</p>
      ) : (
        <div className="flex-1" />
      )}
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#2563eb] sm:text-sm"
      >
        Browse
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </article>
  );
}
