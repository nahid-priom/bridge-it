import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Search, ShoppingCart, MessageCircle, Menu, X, Bell, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, setPage, cart, toggleMenu, isMenuOpen, searchQuery, setSearchQuery, setCategory, toggleChat } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setPage('search');
    }
  };

  const navItems = [
    { label: 'Home', page: 'home' as const },
    { label: 'Categories', page: 'categories' as const },
    { label: 'About', page: 'about' as const },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'glass-strong shadow-2xl shadow-bridge-primary/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button 
            onClick={() => { setPage('home'); setCategory(null); }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <div className="absolute inset-0 bg-gradient-to-br from-bridge-primary to-bridge-secondary rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
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

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bridge-gray group-focus-within:text-bridge-primary transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, sellers, products..."
                className="w-full pl-11 pr-4 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-sm text-white placeholder-bridge-gray focus:outline-none focus:border-bridge-primary focus:ring-2 focus:ring-bridge-primary/20 transition-all"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                  currentPage === item.page
                    ? 'text-white bg-bridge-primary/20 border border-bridge-primary/30'
                    : 'text-bridge-gray hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="lg:hidden p-2 text-bridge-gray hover:text-white transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Chat */}
            <button 
              onClick={toggleChat}
              className="relative p-2 text-bridge-gray hover:text-white transition-colors cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-bridge-secondary rounded-full"></span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-bridge-gray hover:text-white transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-bridge-accent rounded-full animate-pulse"></span>
            </button>

            {/* Cart */}
            <button 
              onClick={() => setPage('cart')}
              className="relative p-2 text-bridge-gray hover:text-white transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-bridge-accent text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>

            {/* User */}
            <button 
              onClick={() => setPage('dashboard')}
              className="hidden md:flex items-center gap-2 pl-3 pr-4 py-2 bg-gradient-to-r from-bridge-primary to-bridge-primary-light rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-bridge-primary/30 transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* Mobile Menu */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 text-bridge-gray hover:text-white cursor-pointer"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <form onSubmit={handleSearch} className="lg:hidden pb-3 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bridge-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, sellers..."
                className="w-full pl-11 pr-4 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-sm text-white placeholder-bridge-gray focus:outline-none focus:border-bridge-primary transition-all"
                autoFocus
              />
            </div>
          </form>
        )}
      </div>

      {/* Mobile Menu */}
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
              onClick={() => setPage('dashboard')}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-bridge-primary to-bridge-primary-light cursor-pointer"
            >
              ⚡ Dashboard
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
