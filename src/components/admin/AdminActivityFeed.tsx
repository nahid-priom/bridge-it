import React from 'react';
import { ShieldCheck, ShoppingBag, Scale, Store, CreditCard } from 'lucide-react';
import type { AdminActivity } from '../../data/adminData';

const typeIcons = {
  verification: ShieldCheck,
  order: ShoppingBag,
  dispute: Scale,
  seller: Store,
  payment: CreditCard,
};

const typeColors = {
  verification: 'text-bridge-primary-light bg-bridge-primary/15',
  order: 'text-bridge-cyan bg-bridge-cyan/15',
  dispute: 'text-bridge-accent bg-bridge-accent/15',
  seller: 'text-bridge-secondary bg-bridge-secondary/15',
  payment: 'text-bridge-gold bg-bridge-gold/15',
};

interface AdminActivityFeedProps {
  activities: AdminActivity[];
  loading?: boolean;
}

export const AdminActivityFeed: React.FC<AdminActivityFeedProps> = ({ activities, loading }) => (
  <div className="glass-card rounded-2xl border border-white/8 overflow-hidden">
    <div className="px-5 py-4 border-b border-white/10">
      <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
    </div>
    <div className="divide-y divide-white/5 max-h-[320px] overflow-y-auto">
      {loading
        ? [1, 2, 3, 4].map((i) => (
            <div key={i} className="px-5 py-4 flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-lg bg-white/10 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 bg-white/10 rounded" />
                <div className="h-3 w-full bg-white/10 rounded" />
              </div>
            </div>
          ))
        : activities.map((activity) => {
            const Icon = typeIcons[activity.type];
            return (
              <div
                key={activity.id}
                className="px-5 py-3.5 flex gap-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className={`p-2 rounded-lg shrink-0 ${typeColors[activity.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                  <p className="text-xs text-bridge-gray line-clamp-2">{activity.description}</p>
                  <p className="text-[10px] text-bridge-gray/80 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
    </div>
  </div>
);
