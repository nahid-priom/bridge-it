'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import type { AdminStatus } from '@/data/adminData';

const statusStyles: Record<string, string> = {
  active: 'bg-bridge-secondary/15 text-bridge-secondary border-bridge-secondary/30',
  approved: 'bg-bridge-secondary/15 text-bridge-secondary border-bridge-secondary/30',
  completed: 'bg-bridge-secondary/15 text-bridge-secondary border-bridge-secondary/30',
  released: 'bg-bridge-cyan/15 text-bridge-cyan border-bridge-cyan/30',
  resolved: 'bg-bridge-cyan/15 text-bridge-cyan border-bridge-cyan/30',
  pending: 'bg-bridge-gold/15 text-bridge-gold border-bridge-gold/30',
  'in-review': 'bg-bridge-primary/15 text-bridge-primary-light border-bridge-primary/30',
  held: 'bg-bridge-primary/15 text-bridge-primary-light border-bridge-primary/30',
  open: 'bg-bridge-accent/15 text-bridge-accent border-bridge-accent/30',
  rejected: 'bg-bridge-accent/15 text-bridge-accent border-bridge-accent/30',
  suspended: 'bg-bridge-accent/15 text-bridge-accent border-bridge-accent/30',
  cancelled: 'bg-white/5 text-bridge-gray border-white/10',
  refunded: 'bg-white/5 text-bridge-gray border-white/10',
  low: 'bg-bridge-secondary/15 text-bridge-secondary border-bridge-secondary/30',
  medium: 'bg-bridge-gold/15 text-bridge-gold border-bridge-gold/30',
  high: 'bg-bridge-accent/15 text-bridge-accent border-bridge-accent/30',
};

interface AdminStatusBadgeProps {
  status: AdminStatus | string;
  className?: string;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ status, className }) => (
  <span
    className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
      statusStyles[status] ?? 'bg-white/5 text-bridge-gray border-white/10',
      className
    )}
  >
    {status.replace(/-/g, ' ')}
  </span>
);
