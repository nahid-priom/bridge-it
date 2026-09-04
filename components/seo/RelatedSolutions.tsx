import Link from 'next/link';
import type { EcommerceProjectCard } from '@/src/features/ecommerce-showcase/types';
import type { SoftwareProjectCard } from '@/src/features/software-showcase/types';
import type { CreativeMarketingProjectCard } from '@/src/features/creative-marketing-showcase/types';
import { ProjectCard } from '@/src/features/ecommerce-showcase/public/ProjectCard';
import { SoftwareCard } from '@/src/features/software-showcase/public/SoftwareCard';
import { CreativeMarketingCard } from '@/src/features/creative-marketing-showcase/public/CreativeMarketingCard';
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
    <section className="mx-auto w-full max-w-[1480px] px-4 py-10 sm:px-6 lg:px-8 xl:px-10" aria-labelledby="related-solutions">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h2 id="related-solutions" className="font-display text-xl font-black text-text-primary md:text-2xl">
          Related Solutions
        </h2>
        <Link
          href={props.viewAllHref ?? (
            props.kind === 'website'
              ? ROUTES.websites
              : props.kind === 'software'
                ? ROUTES.softwareShowroom
                : ROUTES.creativeMarketingShowroom
          )}
          className="text-sm font-semibold text-[#2563eb] hover:underline"
        >
          {props.viewAllLabel ?? 'View all'} →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 min-[320px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {props.kind === 'website'
          ? props.items.map((project) => <ProjectCard key={project.id} project={project} variant="home" />)
          : null}
        {props.kind === 'software'
          ? props.items.map((project) => <SoftwareCard key={project.id} project={project} variant="home" />)
          : null}
        {props.kind === 'creative'
          ? props.items.map((project) => (
              <CreativeMarketingCard key={project.id} project={project} />
            ))
          : null}
      </div>
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
