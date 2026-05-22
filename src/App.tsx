import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
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
import { ServiceDetail } from './components/ServiceDetail';
import { SellerProfile } from './components/SellerProfile';
import { CartPage } from './components/CartPage';
import { MessagesPage } from './components/MessagesPage';
import { Dashboard } from './components/Dashboard';
import { CategoryDetail } from './components/CategoryDetail';
import { CategoriesPage } from './components/CategoriesPage';
import { SearchPage } from './components/SearchPage';
import { AboutPage } from './components/AboutPage';
import { ChatWidget } from './components/ChatWidget';
import { Notification } from './components/Notification';

const App: React.FC = () => {
  const { currentPage } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            {/* 1. Slideshow Hero + Ad Display + Search */}
            <Hero />
            {/* 2. Scrolling Trust Marquee */}
            <TrustBanner />
            {/* 3. Iconic Floating Category Grid */}
            <CategoriesSection />
            {/* 4. Featured Services (2-per-row) */}
            <FeaturedServices />
            {/* 5. How It Works (Timeline) */}
            <HowItWorks />
            {/* 6. Top Sellers */}
            <TopSellers />
            {/* 7. Testimonials (Carousel) */}
            <Testimonials />
            {/* 8. CTA Section */}
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
      case 'search':
        return <SearchPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <Hero />;
    }
  };

  return (
    <div className="min-h-screen bg-bridge-dark text-white">
      <Navbar />
      <main>
        {renderPage()}
      </main>
      <Footer />
      <ChatWidget />
      <Notification />
    </div>
  );
};

export default App;
