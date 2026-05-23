'use client';

import React from 'react';
import { Heart, Mail, Phone, MapPin, ArrowUpRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Category } from '@/types';
import { productsUrl } from '@/lib/routes';
import { BridgeLogo } from '@/components/brand/BridgeLogo';
import { useAppNavigation } from '@/hooks/useAppNavigation';

const DEVELOPMENT_PARTNER = {
  name: 'Code Bondhu IT',
  url: 'https://www.codebondhuit.com',
  displayUrl: 'www.codebondhuit.com',
} as const;

function FooterDevelopmentPartner() {
  return (
    <div className="flex flex-col items-center text-center py-8 border-t border-border-subtle">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted/70 mb-2.5">
        Development Partner
      </p>
      <p className="text-sm font-semibold font-display tracking-tight bg-gradient-to-r from-bridge-primary via-bridge-secondary to-bridge-primary bg-clip-text text-transparent mb-2">
        {DEVELOPMENT_PARTNER.name}
      </p>
      <a
        href={DEVELOPMENT_PARTNER.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-bridge-secondary transition-colors group"
        aria-label={`Visit ${DEVELOPMENT_PARTNER.name} website`}
      >
        <span>{DEVELOPMENT_PARTNER.displayUrl}</span>
        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
      </a>
    </div>
  );
}

export const Footer: React.FC<{ categories: Category[] }> = ({ categories }) => {
  const { navigate, goToDashboard, goToMessages, goHome, goToSearch, goToCategories, goToAbout, goToProducts } = useAppNavigation();

  return (
    <footer className="relative border-t border-border-subtle">
      <div className="absolute inset-0 hero-gradient opacity-20"></div>

      <div className="relative container  mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <BridgeLogo iconSize="sm" textVisibility="always" />
            </div>
            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Bangladesh's premier Smart Virtual IT Park. Buy, sell & discover premium digital services.
            </p>
            <div className="flex gap-2">
              {[
                { label: 'F', color: '#1877F2' },
                { label: 'In', color: '#E4405F' },
                { label: 'Li', color: '#0A66C2' },
                { label: 'Y', color: '#FF0000' },
              ].map((s, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg flex items-center justify-center text-text-primary text-[10px] font-bold transition-all hover:scale-110" style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link
                    href={productsUrl(cat.id)}
                    className="text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-sm">{cat.icon}</span> {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', page: 'home' as const },
                { label: 'Products', page: 'products' as const },
                { label: 'Search', page: 'search' as const },
                { label: 'All Categories', page: 'categories' as const },
                { label: 'About Us', page: 'about' as const },
                { label: 'Dashboard', page: 'dashboard' as const },
                { label: 'Messages', page: 'messages' as const },
              ].map(link => (
                <li key={link.page}>
                  <button onClick={() => { const m: Record<string, () => void> = { home: goHome, products: goToProducts, search: () => goToSearch(), categories: goToCategories, about: goToAbout, dashboard: goToDashboard, messages: goToMessages }; m[link.page]?.(); }} className="text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer flex items-center gap-1">
                    {link.label} <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2.5 mb-5">
              <li className="flex items-center gap-2 text-xs text-text-muted">
                <Mail className="w-3.5 h-3.5 text-bridge-primary" /> support@bridge.app
              </li>
              <li className="flex items-center gap-2 text-xs text-text-muted">
                <Phone className="w-3.5 h-3.5 text-bridge-secondary" /> +880 1XXX-XXXXXX
              </li>
              <li className="flex items-center gap-2 text-xs text-text-muted">
                <MapPin className="w-3.5 h-3.5 text-bridge-accent" /> Dhaka, Bangladesh
              </li>
            </ul>
            <div className="flex gap-1.5">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 min-w-0 px-3 py-2 bg-surface border border-border-subtle rounded-lg text-[11px] text-text-primary placeholder-text-muted focus:outline-none focus:border-bridge-primary"
              />
              <button className="px-3 py-2 bg-bridge-primary text-white text-[11px] font-bold rounded-lg hover:bg-bridge-primary-light transition-colors cursor-pointer">
                Join
              </button>
            </div>
          </div>
        </div>

        <FooterDevelopmentPartner />

        {/* Bottom */}
        <div className="pt-6 border-t border-border-subtle">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-text-muted flex items-center gap-1">
              © 2024 Bridge Smart IT Park. Made with <Heart className="w-3 h-3 text-bridge-accent fill-bridge-accent" /> in Bangladesh
            </p>
            <div className="flex gap-4 text-[11px] text-text-muted">
              <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-text-primary transition-colors">Refund</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
