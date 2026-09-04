'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';
import { AdminDataProvider } from '@/components/admin/AdminDataContext';
import type { AdminSection } from '@/types/admin';
import type { AdminDashboardData } from '@/types/admin';
import type { SellerApplicationRow } from '@/lib/db/seller-applications';

const sectionLoading = () => (
  <div className="h-64 animate-pulse rounded-2xl bg-white/5" aria-hidden />
);

const AdminOverviewSection = dynamic(
  () =>
    import('./sections/AdminOverviewSection').then((mod) => mod.AdminOverviewSection),
  { loading: sectionLoading }
);
const AdminBitpOverviewSection = dynamic(
  () =>
    import('./sections/AdminBitpOverviewSection').then((mod) => mod.AdminBitpOverviewSection),
  { loading: sectionLoading }
);
const AdminBitpProductsSection = dynamic(
  () =>
    import('./sections/AdminBitpSections').then((mod) => mod.AdminBitpProductsSection),
  { loading: sectionLoading }
);
const AdminBitpOrdersSection = dynamic(
  () =>
    import('./sections/AdminBitpSections').then((mod) => mod.AdminBitpOrdersSection),
  { loading: sectionLoading }
);
const AdminBitpCategoriesSection = dynamic(
  () =>
    import('./sections/AdminBitpSections').then((mod) => mod.AdminBitpCategoriesSection),
  { loading: sectionLoading }
);
const AdminBitpConsultationsSection = dynamic(
  () =>
    import('./sections/AdminBitpSections').then((mod) => mod.AdminBitpConsultationsSection),
  { loading: sectionLoading }
);
const AdminBitpContentSection = dynamic(
  () =>
    import('./sections/AdminBitpSections').then((mod) => mod.AdminBitpContentSection),
  { loading: sectionLoading }
);
const AdminBitpGenericSection = dynamic(
  () =>
    import('./sections/AdminBitpSections').then((mod) => mod.AdminBitpGenericSection),
  { loading: sectionLoading }
);
const AdminBitpProjectsSection = dynamic(
  () =>
    import('./sections/AdminBitpSections').then((mod) => mod.AdminBitpProjectsSection),
  { loading: sectionLoading }
);
const AdminBitpPaymentsSection = dynamic(
  () =>
    import('./sections/AdminBitpSections').then((mod) => mod.AdminBitpPaymentsSection),
  { loading: sectionLoading }
);
const AdminBitpSoftwareSection = dynamic(
  () =>
    import('./sections/AdminBitpSections').then((mod) => mod.AdminBitpSoftwareSection),
  { loading: sectionLoading }
);
const AdminBitpEcommerceDemoSection = dynamic(
  () =>
    import('./sections/AdminBitpSections').then((mod) => mod.AdminBitpEcommerceDemoSection),
  { loading: sectionLoading }
);

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
