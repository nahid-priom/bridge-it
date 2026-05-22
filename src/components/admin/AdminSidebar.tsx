import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/cn';
import { adminNavItems, type AdminSection } from '../../data/adminData';
import { useStore } from '../../store/useStore';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  mobileOpen,
  onMobileClose,
}) => {
  const { setPage } = useStore();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-bridge-primary to-bridge-secondary rounded-xl rotate-6" />
              <div className="absolute inset-0 bg-bridge-dark rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-bridge-primary-light" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-display">Bridge Admin</h2>
              <p className="text-[10px] text-bridge-gray">Control Center</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden p-2 text-bridge-gray hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSectionChange(item.id);
                onMobileClose();
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer',
                isActive
                  ? 'bg-bridge-primary/20 text-white border border-bridge-primary/30 shadow-lg shadow-bridge-primary/10'
                  : 'text-bridge-gray hover:text-white hover:bg-white/5 border border-transparent'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive && 'text-bridge-primary-light')} />
              <span className="truncate text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => setPage('home')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-bridge-gray hover:text-white glass border border-white/10 hover:border-bridge-primary/30 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bridge
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 xl:w-72 z-40 bg-bridge-dark-2 border-r border-white/10">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-bridge-dark-2 border-r border-white/10 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
