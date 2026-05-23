'use client';

import { ROUTES, isNavActive } from '@/lib/routes';
import { usePathname } from 'next/navigation';
import { DesktopNavLink } from '@/components/navbar/DesktopNavLink';
import { CategoryDropdown } from '@/components/navbar/CategoryDropdown';
import { MAIN_NAV_LINKS } from '@/components/navbar/constants';
import { cn } from '@/lib/cn';

type DesktopNavProps = {
  categoriesOpen: boolean;
  onCategoriesOpen: () => void;
  onCategoriesToggle: () => void;
  onCategoriesClose: () => void;
  className?: string;
};

export function DesktopNav({
  categoriesOpen,
  onCategoriesOpen,
  onCategoriesToggle,
  onCategoriesClose,
  className,
}: DesktopNavProps) {
  const pathname = usePathname();
  const isActive = (href: string) => isNavActive(pathname, href);

  return (
    <div className={cn('hidden xl:flex items-center gap-0.5 shrink-0', className)}>
      <DesktopNavLink label="Home" href={ROUTES.home} active={isActive(ROUTES.home)} />

      <CategoryDropdown
        active={isActive(ROUTES.categories) || pathname.startsWith('/products')}
        open={categoriesOpen}
        onOpen={onCategoriesOpen}
        onToggle={onCategoriesToggle}
        onClose={onCategoriesClose}
      />

      {MAIN_NAV_LINKS.filter((l) => l.label !== 'Home').map((link) => (
        <DesktopNavLink
          key={link.href}
          label={link.label}
          href={link.href}
          active={isActive(link.href)}
        />
      ))}
    </div>
  );
}
