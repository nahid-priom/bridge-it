import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import type { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  accent?: 'primary' | 'secondary' | 'cyan' | 'gold' | 'accent';
  loading?: boolean;
}

const accentMap = {
  primary: 'from-bridge-primary/20 to-bridge-primary-light/5 text-bridge-primary-light',
  secondary: 'from-bridge-secondary/20 to-bridge-secondary/5 text-bridge-secondary',
  cyan: 'from-bridge-cyan/20 to-bridge-cyan/5 text-bridge-cyan',
  gold: 'from-bridge-gold/20 to-bridge-gold/5 text-bridge-gold',
  accent: 'from-bridge-accent/20 to-bridge-accent/5 text-bridge-accent',
};

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  label,
  value,
  change,
  icon: Icon,
  accent = 'primary',
  loading,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card rounded-2xl p-4 sm:p-5 border border-white/8 hover:border-bridge-primary/25 transition-all group"
  >
    {loading ? (
      <div className="space-y-3 animate-pulse">
        <div className="h-10 w-10 rounded-xl bg-white/10" />
        <div className="h-4 w-24 rounded bg-white/10" />
        <div className="h-7 w-20 rounded bg-white/10" />
      </div>
    ) : (
      <>
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              'p-2.5 rounded-xl bg-gradient-to-br border border-white/10',
              accentMap[accent]
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          {change && (
            <span className="text-xs font-medium text-bridge-secondary bg-bridge-secondary/10 px-2 py-0.5 rounded-full">
              {change}
            </span>
          )}
        </div>
        <p className="text-xs text-bridge-gray mt-4 mb-1">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-white font-display">{value}</p>
      </>
    )}
  </motion.div>
);
