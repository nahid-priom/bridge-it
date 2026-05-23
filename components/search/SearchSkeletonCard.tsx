'use client';

import React from 'react';

export const SearchSkeletonCard: React.FC = () => {
  return (
    <div className="bg-surface rounded-xl overflow-hidden border border-border-subtle animate-pulse">
      <div className="aspect-[5/3] bg-surface-elevated" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-surface-elevated rounded w-1/3" />
        <div className="h-3 bg-surface-elevated rounded w-full" />
        <div className="h-2.5 bg-surface-elevated rounded w-4/5" />
        <div className="h-7 bg-surface-elevated rounded-lg w-full mt-1" />
      </div>
    </div>
  );
};
