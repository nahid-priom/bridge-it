'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import { AdminFilterBar } from '../../../components/admin/AdminFilterBar';
import { AdminDataTable } from '../../../components/admin/AdminDataTable';
import { AdminStatusBadge } from '../../../components/admin/AdminStatusBadge';
import { AdminActionMenu } from '../../../components/admin/AdminActionMenu';
import { initialAdminSellers, formatCurrency, type AdminSeller } from '@/data/adminData';

export const AdminSellersSection: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('revenue');
  const [filter, setFilter] = useState('all');
  const [sellers, setSellers] = useState(initialAdminSellers);

  const filtered = useMemo(() => {
    let list = sellers.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.company.toLowerCase().includes(search.toLowerCase())
    );
    if (filter !== 'all') list = list.filter((s) => s.status === filter);
    list = [...list].sort((a, b) => {
      if (sort === 'revenue') return b.revenue - a.revenue;
      if (sort === 'orders') return b.totalOrders - a.totalOrders;
      if (sort === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [sellers, search, sort, filter]);

  const columns = [
    {
      key: 'name',
      header: 'Seller',
      render: (row: AdminSeller) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-bridge-gray">{row.company}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (row: AdminSeller) => row.category },
    {
      key: 'status',
      header: 'Status',
      render: (row: AdminSeller) => <AdminStatusBadge status={row.status} />,
    },
    { key: 'orders', header: 'Orders', render: (row: AdminSeller) => row.totalOrders },
    {
      key: 'revenue',
      header: 'Revenue',
      render: (row: AdminSeller) => formatCurrency(row.revenue),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (row: AdminSeller) => (
        <span className="flex items-center gap-1 text-bridge-gold">
          <Star className="w-3.5 h-3.5 fill-current" /> {row.rating}
        </span>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (row: AdminSeller) =>
        row.featured ? (
          <Sparkles className="w-4 h-4 text-bridge-gold" />
        ) : (
          <span className="text-bridge-gray">—</span>
        ),
    },
    {
      key: 'actions',
      header: '',
      render: (row: AdminSeller) => (
        <AdminActionMenu
          actions={[
            {
              label: row.featured ? 'Remove Featured' : 'Mark Featured',
              onClick: () =>
                setSellers((prev) =>
                  prev.map((s) => (s.id === row.id ? { ...s, featured: !s.featured } : s))
                ),
            },
            { label: 'View Profile', onClick: () => {} },
            {
              label: 'Suspend',
              variant: 'danger',
              onClick: () =>
                setSellers((prev) =>
                  prev.map((s) => (s.id === row.id ? { ...s, status: 'suspended' as const } : s))
                ),
            },
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
        searchPlaceholder="Search sellers..."
        sortValue={sort}
        onSortChange={setSort}
        sortOptions={[
          { value: 'revenue', label: 'Sort: Revenue' },
          { value: 'orders', label: 'Sort: Orders' },
          { value: 'rating', label: 'Sort: Rating' },
          { value: 'name', label: 'Sort: Name' },
        ]}
        filterValue={filter}
        onFilterChange={setFilter}
        filterOptions={[
          { value: 'all', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'pending', label: 'Pending' },
          { value: 'suspended', label: 'Suspended' },
        ]}
      />
      <AdminDataTable columns={columns} data={filtered} keyExtractor={(r) => r.id} emptyMessage="No sellers found" />
    </motion.div>
  );
};
