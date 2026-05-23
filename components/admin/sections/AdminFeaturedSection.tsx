'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar } from 'lucide-react';
import { AdminStatusBadge } from '../../../components/admin/AdminStatusBadge';
import type { FeaturedItem } from '@/types/admin';
import { useAdminData } from '@/components/admin/AdminDataContext';

export const AdminFeaturedSection: React.FC = () => {
  const { featured: initialFeatured } = useAdminData();
  const [items, setItems] = useState(initialFeatured);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Featured Sellers', count: items.filter((i) => i.type === 'seller').length },
          { label: 'Featured Services', count: items.filter((i) => i.type === 'service').length },
          { label: 'Active Promotions', count: items.filter((i) => i.promotionStatus === 'active').length },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-4 border border-white/8">
            <p className="text-xs text-bridge-gray">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <FeaturedRow key={item.id} item={item} onToggleStatus={() => {
            setItems((prev) =>
              prev.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      promotionStatus:
                        i.promotionStatus === 'active' ? 'expired' : ('active' as FeaturedItem['promotionStatus']),
                    }
                  : i
              )
            );
          }} />
        ))}
      </div>

      <div className="glass-card rounded-2xl p-5 border border-white/8 border-dashed">
        <h3 className="text-sm font-semibold text-white mb-3">Placement Options</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-bridge-gray">
          <label className="flex items-center gap-2 p-3 rounded-xl glass cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-bridge-primary" /> Homepage spotlight
          </label>
          <label className="flex items-center gap-2 p-3 rounded-xl glass cursor-pointer">
            <input type="checkbox" className="accent-bridge-primary" /> Category page banner
          </label>
          <label className="flex items-center gap-2 p-3 rounded-xl glass cursor-pointer">
            <input type="checkbox" className="accent-bridge-primary" /> Search results boost
          </label>
          <label className="flex items-center gap-2 p-3 rounded-xl glass cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-bridge-primary" /> Top sellers carousel
          </label>
        </div>
      </div>
    </motion.div>
  );
};

function FeaturedRow({ item, onToggleStatus }: { item: FeaturedItem; onToggleStatus: () => void }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/8 flex flex-col lg:flex-row lg:items-center gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="p-2.5 rounded-xl bg-bridge-gold/15 text-bridge-gold">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white capitalize">{item.type}: {item.name}</p>
          <p className="text-xs text-bridge-gray">{item.subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="text-bridge-gray">Placement: <span className="text-white capitalize">{item.placement}</span></span>
        <AdminStatusBadge status={item.promotionStatus} />
      </div>
      <div className="flex items-center gap-2 text-xs text-bridge-gray">
        <Calendar className="w-4 h-4" />
        {item.startDate} → {item.endDate}
      </div>
      <button type="button" onClick={onToggleStatus} className="px-3 py-2 rounded-xl text-sm bg-bridge-primary/20 text-bridge-primary-light hover:bg-bridge-primary/30 cursor-pointer shrink-0">
        Toggle Status
      </button>
    </div>
  );
}
