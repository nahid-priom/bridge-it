'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { BridgeLogo } from '@/components/brand/BridgeLogo';
import { SocialLinks } from '@/components/shared/SocialLinks';
import {
  FOOTER_BRAND_DESCRIPTION,
  FOOTER_BRAND_TAGLINE,
  FOOTER_COLUMNS,
} from '@/data/homeContent';
import { BRANDING, whatsappUrl } from '@/lib/config/branding';
import { OFFICIAL_WEBSITE } from '@/lib/config/social-links';
import { ROUTES } from '@/lib/routes';

const FOOTER_ADDRESS =
  '2nd Floor, Anwar Yusuf Palace, House # 12 Rd 16/A, Dhaka 1212';

function FooterColumn({
  title,
  links,
}: {
  title?: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="min-w-0">
      {title ? (
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">{title}</h3>
      ) : null}
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-[#60a5fa]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExternalTextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-slate-400 transition-colors hover:text-[#60a5fa]"
    >
      {children}
    </a>
  );
}

export function Footer() {
  const wa = whatsappUrl('Hi Bridge IT Park — I need a free consultation.');

  return (
    <footer className="deshi-footer max-w-full min-w-0 overflow-x-hidden text-slate-300">
      <div className="mx-auto w-full max-w-[1480px] min-w-0 px-4 py-10 sm:px-6 md:py-12 lg:px-8 xl:px-10">
        <div className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-12 lg:gap-8">
          <div className="col-span-2 min-w-0 lg:col-span-3">
            <BridgeLogo variant="footer" theme="dark" className="mb-3" />
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#60a5fa]">
              {FOOTER_BRAND_TAGLINE}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              {FOOTER_BRAND_DESCRIPTION}
            </p>

            <div className="mt-4 flex max-w-sm gap-2.5 text-sm leading-relaxed text-slate-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#60a5fa]" aria-hidden />
              <address className="not-italic">{FOOTER_ADDRESS}</address>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-2">
            <FooterColumn title="Services" links={FOOTER_COLUMNS.services} />
          </div>
          <div className="min-w-0 lg:col-span-2">
            <FooterColumn title="Explore" links={FOOTER_COLUMNS.explore} />
          </div>
          <div className="min-w-0 lg:col-span-2">
            <FooterColumn title="Popular Solutions" links={FOOTER_COLUMNS.popular} />
          </div>

          <div className="col-span-2 min-w-0 lg:col-span-3">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Contact</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={ROUTES.consultation}
                  className="text-sm text-slate-400 transition-colors hover:text-[#60a5fa]"
                >
                  Free Consultation
                </Link>
              </li>
              {BRANDING.whatsappNumber ? (
                <li>
                  <ExternalTextLink href={wa}>WhatsApp</ExternalTextLink>
                </li>
              ) : null}
              <li>
                <ExternalTextLink href={OFFICIAL_WEBSITE}>Website</ExternalTextLink>
              </li>
              {BRANDING.supportEmail ? (
                <li>
                  <a
                    href={`mailto:${BRANDING.supportEmail}`}
                    className="text-sm text-slate-400 transition-colors hover:text-[#60a5fa]"
                  >
                    {BRANDING.supportEmail}
                  </a>
                </li>
              ) : null}
            </ul>

            <div className="mt-6">
              <FooterColumn links={FOOTER_COLUMNS.legal} />
            </div>
          </div>
        </div>

        <div className="mt-10 flex max-w-full min-w-0 flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="shrink-0 text-xs text-slate-500">
            Powered by{' '}
            <a
              href="https://www.codebondhuit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="powered-by-brand font-semibold tracking-wide"
            >
              Code Bondhu IT
            </a>
          </p>

          <div className="flex min-w-0 items-center gap-3">
            <p className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-white/80 sm:text-xs">
              Follow Us
            </p>
            <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <SocialLinks
                size="sm"
                className="flex flex-nowrap items-center gap-2"
                linkClassName="h-9 w-9 shrink-0"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
