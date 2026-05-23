'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => (
  <div className="glass-card rounded-2xl p-8 sm:p-12 text-center border border-white/8">
    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-bridge-primary/10 border border-bridge-primary/20 flex items-center justify-center">
      <Icon className="w-7 h-7 text-bridge-primary-light" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-bridge-gray max-w-md mx-auto mb-6">{description}</p>
    {action}
  </div>
);
