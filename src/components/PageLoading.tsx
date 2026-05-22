import React from 'react';
import { SearchSkeletonCard } from './search/SearchSkeletonCard';

interface PageLoadingProps {
  variant?: 'grid' | 'minimal';
}

export const PageLoading: React.FC<PageLoadingProps> = ({ variant = 'grid' }) => {
  if (variant === 'minimal') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-bridge-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[4.5rem] md:pt-20 pb-16 bg-bridge-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-32 glass-card rounded-2xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SearchSkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
