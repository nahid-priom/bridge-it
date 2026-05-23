'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Unlock, RotateCcw, Clock } from 'lucide-react';
import { AdminFilterBar } from '../../../components/admin/AdminFilterBar';
import { AdminDataTable } from '../../../components/admin/AdminDataTable';
import { AdminStatCard } from '../../../components/admin/AdminStatCard';
import { AdminStatusBadge } from '../../../components/admin/AdminStatusBadge';
import { AdminActionMenu } from '../../../components/admin/AdminActionMenu';
import { formatCurrency, type AdminOrder } from '@/types/admin';
import { useAdminData } from '@/components/admin/AdminDataContext';

export const AdminOrdersSection: React.FC = () => {
  const { orders } = useAdminData();
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          o.customer.toLowerCase().includes(search.toLowerCase()) ||
          o.seller.toLowerCase().includes(search.toLowerCase())
      ),
    [orders, search]
  );

  const escrowSummary = {
    held: orders.filter((o) => o.escrowStatus === 'held').reduce((s, o) => s + o.amount, 0),
    released: orders.filter((o) => o.escrowStatus === 'released').reduce((s, o) => s + o.amount, 0),
    refunded: orders.filter((o) => o.escrowStatus === 'refunded').reduce((s, o) => s + o.amount, 0),
    pending: orders.filter((o) => o.deliveryStatus === 'pending').length,
  };

  const columns = [
    { key: 'id', header: 'Order ID', render: (row: AdminOrder) => <span className="font-mono text-bridge-primary-light">{row.id}</span> },
    { key: 'customer', header: 'Customer', render: (row: AdminOrder) => row.customer },
    { key: 'seller', header: 'Seller', render: (row: AdminOrder) => row.seller, hideOnMobile: true },
    { key: 'service', header: 'Service', render: (row: AdminOrder) => <span className="line-clamp-2 max-w-[180px]">{row.service}</span> },
    { key: 'amount', header: 'Amount', render: (row: AdminOrder) => formatCurrency(row.amount) },
    { key: 'payment', header: 'Payment', render: (row: AdminOrder) => <AdminStatusBadge status={row.paymentStatus} /> },
    { key: 'escrow', header: 'Escrow', render: (row: AdminOrder) => <AdminStatusBadge status={row.escrowStatus} /> },
    { key: 'delivery', header: 'Delivery', render: (row: AdminOrder) => <AdminStatusBadge status={row.deliveryStatus} />, hideOnMobile: true },
    { key: 'dispute', header: 'Dispute', render: (row: AdminOrder) => <AdminStatusBadge status={row.disputeStatus} /> },
    {
      key: 'actions',
      header: 'Action',
      render: () => (
        <AdminActionMenu
          actions={[
            { label: 'Release Escrow', onClick: () => {} },
            { label: 'Refund', variant: 'danger', onClick: () => {} },
            { label: 'View Details', onClick: () => {} },
          ]}
        />
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="In Escrow" value={formatCurrency(escrowSummary.held)} icon={Wallet} accent="primary" />
        <AdminStatCard label="Released" value={formatCurrency(escrowSummary.released)} icon={Unlock} accent="secondary" />
        <AdminStatCard label="Refunded" value={formatCurrency(escrowSummary.refunded)} icon={RotateCcw} accent="accent" />
        <AdminStatCard label="Pending Delivery" value={String(escrowSummary.pending)} icon={Clock} accent="gold" />
      </div>
      <AdminFilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search orders..." />
      <AdminDataTable columns={columns} data={filtered} keyExtractor={(r) => r.id} />
    </motion.div>
  );
};
