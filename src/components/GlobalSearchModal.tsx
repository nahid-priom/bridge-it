import React, { useEffect, useRef } from 'react';
import { Search, X, Command } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigateToSearch } from '../hooks/useNavigateToSearch';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchModalOpen, closeSearchModal, searchQuery, setSearchQuery } = useStore();
  const { goToSearch } = useNavigateToSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [isSearchModalOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        useStore.getState().openSearchModal();
      }
      if (e.key === 'Escape') closeSearchModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeSearchModal]);

  if (!isSearchModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center pt-[12vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
        onClick={closeSearchModal}
        aria-label="Close search"
      />
      <div className="relative w-full max-w-2xl glass-strong rounded-2xl border border-white/15 shadow-2xl shadow-bridge-primary/20 overflow-hidden animate-scale-in">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToSearch(searchQuery);
          }}
          className="flex items-center gap-3 p-4 border-b border-white/10"
        >
          <Search className="w-5 h-5 text-bridge-primary-light flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services, products, sellers..."
            className="flex-1 bg-transparent text-white placeholder-bridge-gray text-base focus:outline-none focus:ring-0"
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] text-bridge-gray border border-white/10 rounded-lg">
            <Command className="w-3 h-3" /> K
          </kbd>
          <button
            type="button"
            onClick={closeSearchModal}
            className="p-2 text-bridge-gray hover:text-white rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </form>
        <div className="p-4 flex flex-wrap gap-2">
          {['2D Animation', 'Digital Products', 'Courses', 'UI/UX', 'Web Dev'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => goToSearch(tag)}
              className="px-3 py-1.5 text-xs rounded-full bg-bridge-dark-2 border border-white/10 text-bridge-gray hover:text-white hover:border-bridge-primary/40 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/30"
            >
              {tag}
            </button>
          ))}
        </div>
        <p className="px-4 pb-4 text-xs text-bridge-gray">
          Press Enter to search Bridge marketplace. Empty search shows featured results.
        </p>
      </div>
    </div>
  );
};
