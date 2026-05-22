import React, { useEffect, Suspense, lazy } from 'react';
import { useStore } from './store/useStore';
import type { PageType } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBanner } from './components/TrustBanner';
import { CategoriesSection } from './components/CategoriesSection';
import { FeaturedServices } from './components/FeaturedServices';
import { TopSellers } from './components/TopSellers';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { Notification } from './components/Notification';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { PageLoading } from './components/PageLoading';

const ServiceDetail = lazy(() =>
  import('./components/ServiceDetail').then((m) => ({ default: m.ServiceDetail }))
);
const SellerProfile = lazy(() =>
  import('./components/SellerProfile').then((m) => ({ default: m.SellerProfile }))
);
const CartPage = lazy(() => import('./components/CartPage').then((m) => ({ default: m.CartPage })));
const MessagesPage = lazy(() =>
  import('./components/MessagesPage').then((m) => ({ default: m.MessagesPage }))
);
const Dashboard = lazy(() => import('./components/Dashboard').then((m) => ({ default: m.Dashboard })));
const CategoryDetail = lazy(() =>
  import('./components/CategoryDetail').then((m) => ({ default: m.CategoryDetail }))
);
const CategoriesPage = lazy(() =>
  import('./components/CategoriesPage').then((m) => ({ default: m.CategoriesPage }))
);
const SearchPage = lazy(() => import('./components/SearchPage').then((m) => ({ default: m.SearchPage })));
const ProductsPage = lazy(() =>
  import('./components/ProductsPage').then((m) => ({ default: m.ProductsPage }))
);
const AboutPage = lazy(() => import('./components/AboutPage').then((m) => ({ default: m.AboutPage })));
const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);

const App: React.FC = () => {
  const currentPage = useStore((s) => s.currentPage);
  const isAdminDashboard = currentPage === 'admin-dashboard';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero />
            <TrustBanner />
            <CategoriesSection />
            <FeaturedServices />
            <HowItWorks />
            <TopSellers />
            <Testimonials />
            <CTASection />
          </>
        );
      case 'categories':
        return <CategoriesPage />;
      case 'category-detail':
        return <CategoryDetail />;
      case 'service-detail':
        return <ServiceDetail />;
      case 'seller-profile':
        return <SellerProfile />;
      case 'cart':
        return <CartPage />;
      case 'messages':
        return <MessagesPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'search':
        return <SearchPage />;
      case 'products':
        return <ProductsPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <Hero />;
    }
  };

  const lazyPages: PageType[] = [
    'categories',
    'category-detail',
    'service-detail',
    'seller-profile',
    'cart',
    'messages',
    'dashboard',
    'admin-dashboard',
    'search',
    'products',
    'about',
  ];
  const useSuspense = lazyPages.includes(currentPage);

  return (
    <div className="min-h-screen bg-bridge-dark text-white">
      {!isAdminDashboard && <Navbar />}
      <main>
        {useSuspense ? (
          <Suspense fallback={<PageLoading />}>{renderPage()}</Suspense>
        ) : (
          renderPage()
        )}
      </main>
      {!isAdminDashboard && <Footer />}
      {!isAdminDashboard && <ChatWidget />}
      {!isAdminDashboard && <GlobalSearchModal />}
      <Notification />
    </div>
  );
};

export default App;
