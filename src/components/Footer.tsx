import React from 'react';
import { useStore } from '../store/useStore';
import { Heart, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { categories } from '../data/categories';

export const Footer: React.FC = () => {
  const { setPage, setCategory } = useStore();

  return (
    <footer className="relative border-t border-white/[0.05]">
      <div className="absolute inset-0 hero-gradient opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-br from-bridge-primary to-bridge-secondary rounded-lg rotate-6"></div>
                <div className="absolute inset-0 bg-bridge-dark rounded-lg flex items-center justify-center">
                  <span className="text-lg font-black gradient-text font-display">B</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black font-display gradient-text leading-none">Bridge</h3>
                <p className="text-[9px] text-bridge-gray tracking-[0.2em] uppercase">Smart IT Park</p>
              </div>
            </div>
            <p className="text-xs text-bridge-gray leading-relaxed mb-4">
              Bangladesh's premier Smart Virtual IT Park. Buy, sell & discover premium digital services.
            </p>
            <div className="flex gap-2">
              {[
                { label: 'F', color: '#1877F2' },
                { label: 'In', color: '#E4405F' },
                { label: 'Li', color: '#0A66C2' },
                { label: 'Y', color: '#FF0000' },
              ].map((s, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold transition-all hover:scale-110" style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => { setCategory(cat.id); setPage('category-detail'); }}
                    className="text-xs text-bridge-gray hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="text-sm">{cat.icon}</span> {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', page: 'home' as const },
                { label: 'All Categories', page: 'categories' as const },
                { label: 'About Us', page: 'about' as const },
                { label: 'Dashboard', page: 'dashboard' as const },
                { label: 'Messages', page: 'messages' as const },
              ].map(link => (
                <li key={link.page}>
                  <button onClick={() => setPage(link.page)} className="text-xs text-bridge-gray hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                    {link.label} <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2.5 mb-5">
              <li className="flex items-center gap-2 text-xs text-bridge-gray">
                <Mail className="w-3.5 h-3.5 text-bridge-primary" /> support@bridge.app
              </li>
              <li className="flex items-center gap-2 text-xs text-bridge-gray">
                <Phone className="w-3.5 h-3.5 text-bridge-secondary" /> +880 1XXX-XXXXXX
              </li>
              <li className="flex items-center gap-2 text-xs text-bridge-gray">
                <MapPin className="w-3.5 h-3.5 text-bridge-accent" /> Dhaka, Bangladesh
              </li>
            </ul>
            <div className="flex gap-1.5">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 min-w-0 px-3 py-2 bg-bridge-dark-2 border border-white/[0.06] rounded-lg text-[11px] text-white placeholder-bridge-gray focus:outline-none focus:border-bridge-primary"
              />
              <button className="px-3 py-2 bg-bridge-primary text-white text-[11px] font-bold rounded-lg hover:bg-bridge-primary-light transition-colors cursor-pointer">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/[0.05]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-bridge-gray flex items-center gap-1">
              © 2024 Bridge Smart IT Park. Made with <Heart className="w-3 h-3 text-bridge-accent fill-bridge-accent" /> in Bangladesh
            </p>
            <div className="flex gap-4 text-[11px] text-bridge-gray">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Refund</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
