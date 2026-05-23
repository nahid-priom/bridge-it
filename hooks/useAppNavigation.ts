'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { unlockBodyScroll } from '@/hooks/useBodyScrollLock';
import { ROUTES, productsUrl, pathFromPageKey, isNavActive } from '@/lib/routes';
import { buildSearchUrl } from '@/lib/search/searchHelpers';
import { getServiceSlug } from '@/lib/slugs';
import { useStore } from '@/store/useStore';
import type { Service } from '@/types';
import type { CategoryType } from '@/types';

export function useAppNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const setCategory = useStore((s) => s.setCategory);
  const closeSearchModal = useStore((s) => s.closeSearchModal);

  const navigate = useCallback(
    (href: string) => {
      closeSearchModal();
      useStore.setState({ isMenuOpen: false });
      router.push(href);
    },
    [router, closeSearchModal]
  );

  const goHome = useCallback(() => navigate(ROUTES.home), [navigate]);
  const goToCategories = useCallback(() => navigate(ROUTES.categories), [navigate]);
  const goToCategory = useCallback(
    (categoryId: CategoryType) => {
      setCategory(categoryId);
      navigate(productsUrl(categoryId));
    },
    [navigate, setCategory]
  );
  const goToProducts = useCallback(() => navigate(ROUTES.products), [navigate]);
  const goToAbout = useCallback(() => navigate(ROUTES.about), [navigate]);
  const goToDashboard = useCallback(() => navigate(ROUTES.dashboard), [navigate]);
  const goToAdmin = useCallback(() => navigate(ROUTES.admin), [navigate]);
  const goToCart = useCallback(() => navigate(ROUTES.cart), [navigate]);
  const goToMessages = useCallback(() => navigate(ROUTES.messages), [navigate]);

  const goToSellers = useCallback(() => {
    useStore.getState().updateSearchFilter('resultType', 'seller');
    closeSearchModal();
    useStore.setState({ isMenuOpen: false });
    router.push(buildSearchUrl({ q: useStore.getState().searchQuery }));
  }, [router, closeSearchModal]);

  const goToSearch = useCallback(
    (query?: string) => {
      if (query !== undefined) setSearchQuery(query);
      const q = query !== undefined ? query : useStore.getState().searchQuery;
      closeSearchModal();
      useStore.setState({ isMenuOpen: false });
      unlockBodyScroll();
      router.push(buildSearchUrl({ q, page: 1 }));
    },
    [router, setSearchQuery, closeSearchModal]
  );

  const goToService = useCallback(
    (service: Service) => {
      navigate(ROUTES.service(getServiceSlug(service)));
    },
    [navigate]
  );

  const goToServiceBySlug = useCallback(
    (slug: string) => navigate(ROUTES.service(slug)),
    [navigate]
  );

  const goToSeller = useCallback(
    (sellerSlug: string) => navigate(ROUTES.seller(sellerSlug)),
    [navigate]
  );

  const goToPageKey = useCallback(
    (page: Parameters<typeof pathFromPageKey>[0]) => navigate(pathFromPageKey(page)),
    [navigate]
  );

  const isActive = useCallback((href: string) => isNavActive(pathname, href), [pathname]);

  return {
    pathname,
    router,
    navigate,
    goHome,
    goToCategories,
    goToCategory,
    goToProducts,
    goToAbout,
    goToDashboard,
    goToAdmin,
    goToCart,
    goToMessages,
    goToSellers,
    goToSearch,
    goToService,
    goToServiceBySlug,
    goToSeller,
    goToPageKey,
    isActive,
  };
}
