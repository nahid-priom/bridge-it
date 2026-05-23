'use client';

import { Award, Briefcase, Clock, Smile, Truck } from 'lucide-react';
import type { MarketplaceSeller } from '@/types/marketplaceSeller';

type SellerStatsProps = {
  seller: MarketplaceSeller;
};

export function SellerStats({ seller }: SellerStatsProps) {
  const items = [
    { icon: Briefcase, label: 'Years Experience', value: `${seller.experienceYears}+` },
    { icon: Smile, label: 'Happy Clients', value: seller.happyClients.toLocaleString() },
    { icon: Award, label: 'Total Orders', value: seller.totalOrders.toLocaleString() },
    { icon: Truck, label: 'Delivery Rate', value: `${seller.deliveryRate}%` },
    { icon: Clock, label: 'Response Time', value: seller.responseTime },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/60 p-4 text-center shadow-sm"
        >
          <Icon className="w-6 h-6 mx-auto mb-2 text-deshi-green" aria-hidden />
          <p className="text-lg font-black text-text-primary">{value}</p>
          <p className="text-[11px] text-text-muted mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}
