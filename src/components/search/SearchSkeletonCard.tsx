import React from 'react';

export const SearchSkeletonCard: React.FC = () => {
  return (
    <div className="bg-bridge-dark-2 rounded-2xl overflow-hidden border border-white/5 animate-pulse">
      <div className="aspect-[4/3] bg-bridge-dark-3" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-bridge-dark-3 rounded w-1/3" />
        <div className="h-4 bg-bridge-dark-3 rounded w-full" />
        <div className="h-3 bg-bridge-dark-3 rounded w-4/5" />
        <div className="h-8 bg-bridge-dark-3 rounded-xl w-full mt-2" />
      </div>
    </div>
  );
};
