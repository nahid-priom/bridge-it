import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import { SearchFilters } from '../../types';
import { SearchFilterSidebar } from './SearchFilterSidebar';

interface MobileSearchFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onClearAll: () => void;
  activeCount: number;
}

export const MobileSearchFilterDrawer: React.FC<MobileSearchFilterDrawerProps> = ({
  open,
  onClose,
  filters,
  onChange,
  onClearAll,
  activeCount,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed top-0 left-0 bottom-0 z-[70] w-[min(100%,320px)] bg-bridge-dark border-r border-white/10 overflow-y-auto lg:hidden"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-bridge-dark border-b border-white/10">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-bridge-primary-light" />
                <span className="font-semibold text-white">Filters</span>
                {activeCount > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-bridge-primary text-white">
                    {activeCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-bridge-gray hover:text-white cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <SearchFilterSidebar
                filters={filters}
                onChange={onChange}
                onClearAll={() => {
                  onClearAll();
                  onClose();
                }}
                className="!bg-transparent !border-0 !shadow-none p-0"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const MobileFilterButton: React.FC<{
  onClick: () => void;
  activeCount: number;
}> = ({ onClick, activeCount }) => (
  <button
    onClick={onClick}
    className="lg:hidden flex items-center gap-2 px-4 py-2.5 glass border border-white/10 rounded-xl text-sm text-white cursor-pointer"
  >
    <Filter className="w-4 h-4" />
    Filters
    {activeCount > 0 && (
      <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-bridge-primary text-white font-bold">
        {activeCount}
      </span>
    )}
  </button>
);
