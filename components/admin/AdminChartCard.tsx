'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface AdminChartCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  data: number[];
  labels?: string[];
  color?: 'primary' | 'secondary' | 'cyan';
  loading?: boolean;
}

const colorMap = {
  primary: 'from-bridge-primary to-bridge-primary-light',
  secondary: 'from-bridge-secondary to-bridge-cyan',
  cyan: 'from-bridge-cyan to-bridge-secondary',
};

export const AdminChartCard: React.FC<AdminChartCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  data,
  labels,
  color = 'primary',
  loading,
}) => {
  const max = Math.max(...data, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 border border-white/8 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-bridge-gray mt-0.5">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-bridge-primary/10 text-bridge-primary-light">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      {loading ? (
        <div className="flex h-40 items-end gap-2 animate-pulse motion-reduce:animate-none">
          {[40, 55, 35, 70, 45, 60, 50, 75, 42, 58, 48, 65].map((height, i) => (
            <div key={i} className="flex-1 rounded-t-md bg-white/10" style={{ height: `${height}%` }} />
          ))}
        </div>
      ) : (
        <div className="h-40 flex items-end gap-1 sm:gap-1.5">
          {data.map((value, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
              <div
                className={`w-full rounded-t-md bg-gradient-to-t ${colorMap[color]} opacity-80 hover:opacity-100 transition-opacity`}
                style={{ height: `${(value / max) * 100}%`, minHeight: '4px' }}
                title={String(value)}
              />
              {labels?.[i] && (
                <span className="text-[9px] text-bridge-gray truncate w-full text-center">{labels[i]}</span>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] text-bridge-gray mt-3 text-center">Chart placeholder — connect analytics API</p>
    </motion.div>
  );
};
