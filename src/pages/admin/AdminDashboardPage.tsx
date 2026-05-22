import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import type { AdminSection } from '../../data/adminData';
import { AdminOverviewSection } from './sections/AdminOverviewSection';
import { AdminVerificationSection } from './sections/AdminVerificationSection';
import { AdminSellersSection } from './sections/AdminSellersSection';
import { AdminCustomersSection } from './sections/AdminCustomersSection';
import { AdminOrdersSection } from './sections/AdminOrdersSection';
import { AdminDisputesSection } from './sections/AdminDisputesSection';
import { AdminCategoriesSection } from './sections/AdminCategoriesSection';
import { AdminFeaturedSection } from './sections/AdminFeaturedSection';
import { AdminReportsSection } from './sections/AdminReportsSection';
import { AdminSettingsSection } from './sections/AdminSettingsSection';

export const AdminDashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverviewSection onNavigate={setActiveSection} />;
      case 'seller-verification':
        return <AdminVerificationSection />;
      case 'sellers':
        return <AdminSellersSection />;
      case 'customers':
        return <AdminCustomersSection />;
      case 'orders':
        return <AdminOrdersSection />;
      case 'disputes':
        return <AdminDisputesSection />;
      case 'categories':
        return <AdminCategoriesSection />;
      case 'featured':
        return <AdminFeaturedSection />;
      case 'reports':
        return <AdminReportsSection />;
      case 'settings':
        return <AdminSettingsSection />;
      default:
        return <AdminOverviewSection onNavigate={setActiveSection} />;
    }
  };

  return (
    <AdminDashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <AnimatePresence mode="wait">
        <div key={activeSection}>{renderSection()}</div>
      </AnimatePresence>
    </AdminDashboardLayout>
  );
};
