import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Store, Users, ShoppingBag, FolderTree } from 'lucide-react';
import { buildSearchResults } from '../../data/adminData';

const groupIcons = {
  sellers: Store,
  customers: Users,
  orders: ShoppingBag,
  categories: FolderTree,
};

interface AdminSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export const AdminSearchModal: React.FC<AdminSearchModalProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const results = buildSearchResults(query);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[91] sm:w-full sm:max-w-xl"
          >
            <div className="glass-strong rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <Search className="w-5 h-5 text-bridge-gray shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sellers, customers, orders, categories..."
                  className="flex-1 bg-transparent text-white text-sm placeholder-bridge-gray focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-bridge-gray hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {query.trim() === '' ? (
                  <p className="text-sm text-bridge-gray text-center py-8">
                    Type to search across the admin panel
                  </p>
                ) : results.length === 0 ? (
                  <p className="text-sm text-bridge-gray text-center py-8">No results for &quot;{query}&quot;</p>
                ) : (
                  results.map((group) => {
                    const Icon = groupIcons[group.type];
                    return (
                      <div key={group.type} className="mb-3">
                        <p className="text-xs font-semibold text-bridge-gray uppercase tracking-wider px-3 py-2 flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5" />
                          {group.label}
                        </p>
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <p className="text-sm text-white font-medium">{item.title}</p>
                            <p className="text-xs text-bridge-gray">{item.subtitle}</p>
                          </button>
                        ))}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
