'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';
import { AdminDataProvider } from '@/components/admin/AdminDataContext';
import type { AdminSection } from '@/types/admin';
import type { AdminDashboardData } from '@/types/admin';
import { AdminOverviewSection } from './sections/AdminOverviewSection';
import { AdminBitpOverviewSection } from './sections/AdminBitpOverviewSection';
import {
  AdminBitpProductsSection,
  AdminBitpOrdersSection,
  AdminBitpCategoriesSection,
  AdminBitpConsultationsSection,
  AdminBitpContentSection,
  AdminBitpGenericSection,
  AdminBitpProjectsSection,
  AdminBitpPaymentsSection,
  AdminBitpSoftwareSection,
  AdminBitpEcommerceDemoSection,
} from './sections/AdminBitpSections';
import type { SellerApplicationRow } from '@/lib/db/seller-applications';

type AdminDashboardPageProps = {
  data: AdminDashboardData;
  sellerApplications?: SellerApplicationRow[];
};

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  data,
  sellerApplications: _sellerApplications = [],
}) => {
  void _sellerApplications;
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminBitpOverviewSection onNavigate={setActiveSection} />;
      case 'bitp-products':
        return <AdminBitpProductsSection />;
      case 'bitp-categories':
        return <AdminBitpCategoriesSection />;
      case 'bitp-orders':
        return <AdminBitpOrdersSection />;
      case 'bitp-projects':
        return <AdminBitpProjectsSection />;
      case 'bitp-quotations':
        return <AdminBitpGenericSection title="Quotations" endpoint="/api/admin/bitp/quotations" />;
      case 'bitp-clients':
        return <AdminBitpGenericSection title="Clients" endpoint="/api/admin/bitp/clients" />;
      case 'bitp-payments':
        return <AdminBitpPaymentsSection />;
      case 'bitp-consultations':
        return <AdminBitpConsultationsSection />;
      case 'bitp-portfolio':
        return <AdminBitpGenericSection title="Portfolio" endpoint="/api/admin/bitp/portfolio" />;
      case 'bitp-reviews':
        return <AdminBitpGenericSection title="Reviews" endpoint="/api/admin/bitp/reviews" />;
      case 'bitp-messages':
        return <AdminBitpGenericSection title="Messages" endpoint="/api/admin/bitp/messages" />;
      case 'bitp-content':
        return <AdminBitpContentSection />;
      case 'bitp-software':
        return (
          <div className="space-y-8">
            <AdminBitpSoftwareSection />
            <AdminBitpEcommerceDemoSection />
          </div>
        );
      default:
        return <AdminOverviewSection onNavigate={setActiveSection} />;
    }
  };

  return (
    <AdminDataProvider data={data}>
      <AdminDashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        <AnimatePresence mode="wait">
          <div key={activeSection}>{renderSection()}</div>
        </AnimatePresence>
      </AdminDashboardLayout>
    </AdminDataProvider>
  );
};
