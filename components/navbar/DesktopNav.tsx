'use client';

import { usePathname } from 'next/navigation';
import { DesktopNavLink } from '@/components/navbar/DesktopNavLink';
import { ServiceCategoryDropdown } from '@/components/navbar/ServiceCategoryDropdown';
import { ProductCategoryDropdown } from '@/components/navbar/ProductCategoryDropdown';
import { MAIN_NAV_LINKS } from '@/components/navbar/constants';
import { ROUTES, isNavActive } from '@/lib/routes';
import { cn } from '@/lib/cn';

type DesktopNavProps = {
  servicesOpen: boolean;
  productsOpen: boolean;
  onServicesOpen: () => void;
  onServicesToggle: () => void;
  onServicesClose: () => void;
  onProductsOpen: () => void;
  onProductsToggle: () => void;
  onProductsClose: () => void;
  className?: string;
};

export function DesktopNav({
  servicesOpen,
  productsOpen,
  onServicesOpen,
  onServicesToggle,
  onServicesClose,
  onProductsOpen,
  onProductsToggle,
  onProductsClose,
  className,
}: DesktopNavProps) {
  const pathname = usePathname();
  const isActive = (href: string) => isNavActive(pathname, href);

  return (
    <div className={cn('hidden xl:flex items-center gap-0.5 shrink-0', className)}>
      <ProductCategoryDropdown
        active={isActive(ROUTES.websites) || pathname.startsWith('/websites')}
        open={productsOpen}
        onOpen={onProductsOpen}
        onToggle={onProductsToggle}
        onClose={onProductsClose}
      />

      <ServiceCategoryDropdown
        active={isActive(ROUTES.search) || pathname.startsWith('/search')}
        open={servicesOpen}
        onOpen={onServicesOpen}
        onToggle={onServicesToggle}
        onClose={onServicesClose}
      />

      {MAIN_NAV_LINKS.map((link) => (
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
