'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AdminFilterBar } from '../../../components/admin/AdminFilterBar';
import { AdminDataTable } from '../../../components/admin/AdminDataTable';
import { AdminStatusBadge } from '../../../components/admin/AdminStatusBadge';
import { AdminActionMenu } from '../../../components/admin/AdminActionMenu';
import { formatCurrency, type AdminCustomer } from '@/types/admin';
import { useAdminData } from '@/components/admin/AdminDataContext';

export const AdminCustomersSection: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('spending');
  const { customers } = useAdminData();

  const filtered = useMemo(() => {
    let list = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      if (sort === 'spending') return b.totalSpending - a.totalSpending;
      if (sort === 'orders') return b.orders - a.orders;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [customers, search, sort]);

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      render: (row: AdminCustomer) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-bridge-gray">{row.email}</p>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (row: AdminCustomer) => row.phone, hideOnMobile: true },
    { key: 'orders', header: 'Orders', render: (row: AdminCustomer) => row.orders },
    {
      key: 'spending',
      header: 'Total Spending',
      render: (row: AdminCustomer) => formatCurrency(row.totalSpending),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: AdminCustomer) => <AdminStatusBadge status={row.status} />,
    },
    { key: 'join', header: 'Joined', render: (row: AdminCustomer) => row.joinDate, hideOnMobile: true },
    {
      key: 'actions',
      header: '',
      render: () => (
        <AdminActionMenu
          actions={[
            { label: 'View Orders', onClick: () => {} },
            { label: 'Send Message', onClick: () => {} },
            { label: 'Suspend', variant: 'danger', onClick: () => {} },
          ]}
        />
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <AdminFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search customers..."
        sortValue={sort}
        onSortChange={setSort}
        sortOptions={[
          { value: 'spending', label: 'Sort: Spending' },
          { value: 'orders', label: 'Sort: Orders' },
          { value: 'name', label: 'Sort: Name' },
        ]}
      />
      <AdminDataTable columns={columns} data={filtered} keyExtractor={(r) => r.id} />
    </motion.div>
  );
};
