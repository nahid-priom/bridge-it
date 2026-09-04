'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { BridgeLogo } from '@/components/brand/BridgeLogo';
import { SocialLinks } from '@/components/shared/SocialLinks';
import {
  FOOTER_BRAND_DESCRIPTION,
  FOOTER_BRAND_HEADLINE,
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
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="min-w-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">{title}</h3>
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
            <p className="mt-3 max-w-sm font-display text-lg font-bold leading-snug text-white">
              {FOOTER_BRAND_HEADLINE}
            </p>
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-400">
              {FOOTER_BRAND_DESCRIPTION}
            </p>

            <div className="mt-5 flex max-w-sm gap-2.5 text-sm leading-relaxed text-slate-400">
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
              <FooterColumn title="Legal" links={FOOTER_COLUMNS.legal} />
            </div>
            <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-wider text-white">
              Follow Us
            </h3>
            <SocialLinks
              size="sm"
              className="grid w-full grid-cols-8 gap-1.5 sm:max-w-[12.5rem] sm:grid-cols-4 sm:gap-2"
              linkClassName="h-8 w-8 sm:h-10 sm:w-10"
            />
          </div>
        </div>

        <div className="mt-8 flex max-w-full min-w-0 flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Powered by{' '}
            <a
              href="https://www.codebondhuit.com"
              target="_blank"
              rel="noopener"
              className="footer-powered-glow font-semibold tracking-wide text-[#7dd3fc] transition-colors hover:text-[#bae6fd]"
            >
              CODE BONDHU IT
            </a>
          </p>
          <nav
            className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500"
            aria-label="Legal"
          >
            <Link href={ROUTES.privacy} className="transition-colors hover:text-[#60a5fa]">
              Privacy Policy
            </Link>
            <Link href={ROUTES.terms} className="transition-colors hover:text-[#60a5fa]">
              Terms & Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
