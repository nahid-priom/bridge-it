import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { useNavigateToSearch } from '../hooks/useNavigateToSearch';
import { Search, ShoppingCart, MessageCircle, Menu, X, Bell, User, Shield, Package } from 'lucide-react';

export const Navbar: React.FC = () => {
  const currentPage = useStore((s) => s.currentPage);
  const cart = useStore((s) => s.cart);
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const setPage = useStore((s) => s.setPage);
  const setCategory = useStore((s) => s.setCategory);
  const toggleMenu = useStore((s) => s.toggleMenu);
  const isMenuOpen = useStore((s) => s.isMenuOpen);
  const toggleChat = useStore((s) => s.toggleChat);
  const openSearchModal = useStore((s) => s.openSearchModal);
  const { goToSearch } = useNavigateToSearch();

  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearchModal]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    goToSearch();
  };

  const navItems = [
    { label: 'Home', page: 'home' as const },
    { label: 'Categories', page: 'categories' as const },
    { label: 'Products', page: 'products' as const },
    { label: 'About', page: 'about' as const },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong shadow-2xl shadow-bridge-primary/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => {
              setPage('home');
              setCategory(null);
            }}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40 rounded-xl"
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <div className="absolute inset-0 bg-gradient-to-br from-bridge-primary to-bridge-secondary rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-bridge-dark rounded-xl flex items-center justify-center">
                <span className="text-2xl font-black gradient-text font-display">B</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-black font-display tracking-tight">
                <span className="gradient-text">Bridge</span>
              </h1>
              <p className="text-[10px] text-bridge-gray -mt-1 tracking-widest uppercase">Smart IT Park</p>
            </div>
          </button>

          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bridge-gray group-focus-within:text-bridge-primary transition-colors" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, sellers, products..."
                aria-label="Search marketplace"
                className="w-full pl-11 pr-20 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-sm text-white placeholder-bridge-gray focus:outline-none focus:border-bridge-primary focus:ring-2 focus:ring-bridge-primary/20 transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden xl:inline-flex px-1.5 py-0.5 text-[10px] text-bridge-gray border border-white/10 rounded pointer-events-none">
                ⌘K
              </kbd>
            </div>
          </form>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/30 ${
                  currentPage === item.page
                    ? 'text-white bg-bridge-primary/20 border border-bridge-primary/30'
                    : 'text-bridge-gray hover:text-white hover:bg-white/5'
                }`}
              >
                {item.page === 'products' ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" /> {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => {
                openSearchModal();
                setShowSearch(true);
              }}
              className="lg:hidden p-2 text-bridge-gray hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40 rounded-lg"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={toggleChat}
              className="relative p-2 text-bridge-gray hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40 rounded-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-bridge-secondary rounded-full" />
            </button>

            <button className="relative p-2 text-bridge-gray hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-bridge-accent rounded-full animate-pulse" />
            </button>

            <button
              onClick={() => setPage('cart')}
              className="relative p-2 text-bridge-gray hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40 rounded-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-bridge-accent text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setPage('admin-dashboard')}
              className="hidden lg:flex items-center gap-2 px-3 py-2 glass border border-white/10 text-bridge-gray hover:text-white hover:border-bridge-primary/30 rounded-xl text-sm font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/30"
              title="Admin Control Center"
            >
              <Shield className="w-4 h-4 text-bridge-primary-light" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => setPage('dashboard')}
              className="hidden md:flex items-center gap-2 pl-3 pr-4 py-2 bg-gradient-to-r from-bridge-primary to-bridge-primary-light rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-bridge-primary/30 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <User className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-bridge-gray hover:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {showSearch && (
          <form onSubmit={handleSearch} className="lg:hidden pb-3 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bridge-gray" />
              <input
                ref={mobileSearchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, sellers..."
                aria-label="Search marketplace"
                className="w-full pl-11 pr-4 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-sm text-white placeholder-bridge-gray focus:outline-none focus:border-bridge-primary focus:ring-2 focus:ring-bridge-primary/20 transition-all"
                autoFocus
              />
            </div>
          </form>
        )}
      </div>

      {isMenuOpen && (
        <div className="md:hidden glass-strong border-t border-white/10 animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentPage === item.page
                    ? 'text-white bg-bridge-primary/20 border border-bridge-primary/30'
                    : 'text-bridge-gray hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => goToSearch()}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-bridge-gray hover:text-white glass border border-white/10 cursor-pointer"
            >
              🔍 Search Bridge
            </button>
            <button
              onClick={() => setPage('dashboard')}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-bridge-primary to-bridge-primary-light cursor-pointer"
            >
              ⚡ Dashboard
            </button>
            <button
              onClick={() => setPage('admin-dashboard')}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-bridge-gray hover:text-white glass border border-white/10 cursor-pointer flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-bridge-primary-light" />
              Admin Control Center
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
