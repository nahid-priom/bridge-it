import Link from 'next/link';
import type { EcommerceProjectCard } from '@/src/features/ecommerce-showcase/types';
import type { SoftwareProjectCard } from '@/src/features/software-showcase/types';
import type { CreativeMarketingProjectCard } from '@/src/features/creative-marketing-showcase/types';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import {
  PortfolioCard,
  normalizeWebsiteProject,
  normalizeSoftwareProject,
  normalizeMarketingProject,
} from '@/src/features/catalog/components/portfolio-card';
import { ROUTES } from '@/lib/routes';

type RelatedSolutionsProps =
  | {
      kind: 'website';
      items: EcommerceProjectCard[];
      viewAllHref?: string;
      viewAllLabel?: string;
    }
  | {
      kind: 'software';
      items: SoftwareProjectCard[];
      viewAllHref?: string;
      viewAllLabel?: string;
    }
  | {
      kind: 'creative';
      items: CreativeMarketingProjectCard[];
      viewAllHref?: string;
      viewAllLabel?: string;
    };

export function RelatedSolutions(props: RelatedSolutionsProps) {
  if (props.items.length === 0) return null;

  return (
    <section
      className="mx-auto w-full max-w-[1480px] px-4 py-10 sm:px-6 lg:px-8 xl:px-10"
      aria-labelledby="related-solutions"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h2 id="related-solutions" className="font-display text-xl font-black text-text-primary md:text-2xl">
          Related Solutions
        </h2>
        <Link
          href={
            props.viewAllHref ??
            (props.kind === 'website'
              ? ROUTES.websites
              : props.kind === 'software'
                ? ROUTES.softwareShowroom
                : ROUTES.creativeMarketingShowroom)
          }
          className="text-sm font-semibold text-[#2563eb] hover:underline"
        >
          {props.viewAllLabel ?? 'View all'} →
        </Link>
      </div>
      <ul className={CATALOG_LISTING_GRID_CLASS}>
        {props.kind === 'website'
          ? props.items.map((project) => (
              <li key={project.id} className="min-w-0 list-none">
                <PortfolioCard data={normalizeWebsiteProject(project)} />
              </li>
            ))
          : null}
        {props.kind === 'software'
          ? props.items.map((project) => (
              <li key={project.id} className="min-w-0 list-none">
                <PortfolioCard data={normalizeSoftwareProject(project)} />
              </li>
            ))
          : null}
        {props.kind === 'creative'
          ? props.items.map((project) => (
              <li key={project.id} className="min-w-0 list-none">
                <PortfolioCard data={normalizeMarketingProject(project)} />
              </li>
            ))
          : null}
      </ul>
      <p className="mt-6 text-sm text-text-secondary">
        Ready to tailor one of these for your business?{' '}
        <Link href={ROUTES.consultation} className="font-semibold text-[#2563eb] hover:underline">
          Request a free consultation
        </Link>
        .
      </p>
    </section>
  );
}
