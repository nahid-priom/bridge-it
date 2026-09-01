#!/usr/bin/env tsx
/**
 * Generates branded SVG cover artwork for E-commerce flagships.
 * Run: npx tsx scripts/generate-flagship-covers.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public/showroom/covers');

const NAVY = '#0f2744';
const EMERALD = '#10B981';
const TEAL = '#0d9488';
const WHITE = '#ffffff';
const MUTED = '#94a3b8';

type CoverSpec = {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  visual: string;
};

const COVERS: CoverSpec[] = [
  {
    slug: 'single-product-landing',
    title: 'Landing Commerce',
    subtitle: 'Single Product + COD Form',
    price: '৳2,000',
    visual: `
      <rect x="180" y="80" width="200" height="360" rx="16" fill="${WHITE}" opacity="0.95"/>
      <rect x="195" y="100" width="170" height="120" rx="8" fill="${EMERALD}" opacity="0.3"/>
      <rect x="195" y="240" width="170" height="12" rx="4" fill="${MUTED}" opacity="0.4"/>
      <rect x="195" y="260" width="120" height="12" rx="4" fill="${MUTED}" opacity="0.3"/>
      <rect x="195" y="300" width="170" height="36" rx="8" fill="${EMERALD}"/>
      <text x="280" y="323" text-anchor="middle" fill="white" font-size="11" font-weight="700">ORDER NOW</text>
    `,
  },
  {
    slug: 'starter-ecommerce',
    title: 'Starter Store',
    subtitle: 'Catalog + Cart + Checkout',
    price: '৳5,000',
    visual: `
      <rect x="60" y="100" width="140" height="100" rx="8" fill="${WHITE}" opacity="0.9"/>
      <rect x="70" y="110" width="120" height="60" rx="4" fill="${EMERALD}" opacity="0.25"/>
      <rect x="220" y="100" width="140" height="100" rx="8" fill="${WHITE}" opacity="0.9"/>
      <rect x="230" y="110" width="120" height="60" rx="4" fill="${TEAL}" opacity="0.25"/>
      <rect x="380" y="100" width="140" height="100" rx="8" fill="${WHITE}" opacity="0.9"/>
      <rect x="390" y="110" width="120" height="60" rx="4" fill="${EMERALD}" opacity="0.25"/>
      <rect x="200" y="230" width="180" height="80" rx="10" fill="${EMERALD}" opacity="0.8"/>
      <text x="290" y="278" text-anchor="middle" fill="white" font-size="14" font-weight="700">🛒 Cart</text>
    `,
  },
  {
    slug: 'standard-ecommerce',
    title: 'Standard Store',
    subtitle: 'Accounts + Wishlist + Analytics',
    price: '৳10,000',
    visual: `
      <rect x="80" y="90" width="200" height="140" rx="10" fill="${WHITE}" opacity="0.92"/>
      <rect x="95" y="105" width="80" height="50" rx="4" fill="${EMERALD}" opacity="0.3"/>
      <rect x="185" y="105" width="80" height="50" rx="4" fill="${TEAL}" opacity="0.3"/>
      <rect x="320" y="90" width="160" height="200" rx="10" fill="${WHITE}" opacity="0.85"/>
      <rect x="335" y="110" width="130" height="20" rx="4" fill="${MUTED}" opacity="0.3"/>
      <rect x="335" y="140" width="130" height="20" rx="4" fill="${EMERALD}" opacity="0.4"/>
      <rect x="335" y="170" width="130" height="20" rx="4" fill="${MUTED}" opacity="0.3"/>
      <text x="400" y="220" text-anchor="middle" fill="${NAVY}" font-size="10" font-weight="600">My Orders</text>
    `,
  },
  {
    slug: 'automated-ecommerce',
    title: 'Automated Store',
    subtitle: 'Courier + Fraud + Pixel',
    price: '৳20,000',
    visual: `
      <rect x="70" y="100" width="180" height="120" rx="10" fill="${WHITE}" opacity="0.9"/>
      <rect x="280" y="80" width="220" height="160" rx="10" fill="${WHITE}" opacity="0.92"/>
      <rect x="295" y="100" width="60" height="30" rx="6" fill="${EMERALD}"/>
      <text x="325" y="120" text-anchor="middle" fill="white" font-size="9" font-weight="700">New</text>
      <rect x="365" y="100" width="60" height="30" rx="6" fill="${TEAL}"/>
      <text x="395" y="120" text-anchor="middle" fill="white" font-size="9" font-weight="700">Ship</text>
      <rect x="435" y="100" width="50" height="30" rx="6" fill="${NAVY}"/>
      <text x="460" y="120" text-anchor="middle" fill="white" font-size="9" font-weight="700">Done</text>
      <path d="M325 145 L395 145 L460 145" stroke="${EMERALD}" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
      <rect x="150" y="260" width="240" height="40" rx="8" fill="${EMERALD}" opacity="0.7"/>
      <text x="270" y="286" text-anchor="middle" fill="white" font-size="12" font-weight="700">Courier Flow Demo</text>
    `,
  },
  {
    slug: 'premium-ecommerce',
    title: 'Business Suite',
    subtitle: 'ERP + Analytics + Reports',
    price: '৳50,000',
    visual: `
      <rect x="60" y="70" width="480" height="280" rx="12" fill="${WHITE}" opacity="0.93"/>
      <rect x="75" y="85" width="100" height="250" rx="6" fill="${NAVY}" opacity="0.9"/>
      <rect x="190" y="85" width="330" height="110" rx="6" fill="${EMERALD}" opacity="0.15"/>
      <rect x="200" y="100" width="80" height="40" rx="4" fill="${EMERALD}" opacity="0.5"/>
      <rect x="290" y="100" width="80" height="40" rx="4" fill="${TEAL}" opacity="0.5"/>
      <rect x="380" y="100" width="80" height="40" rx="4" fill="${NAVY}" opacity="0.3"/>
      <rect x="190" y="210" width="160" height="125" rx="6" fill="${TEAL}" opacity="0.12"/>
      <rect x="360" y="210" width="160" height="125" rx="6" fill="${EMERALD}" opacity="0.12"/>
      <polyline points="200,280 230,250 260,265 290,230 320,240" stroke="${EMERALD}" stroke-width="2" fill="none"/>
    `,
  },
];

const SOFTWARE_COVERS: CoverSpec[] = [
  {
    slug: 'software-basic-stock-management',
    title: 'Basic Stock',
    subtitle: 'Purchase · Sales · Stock',
    price: '৳10,000',
    visual: `
      <rect x="100" y="90" width="440" height="220" rx="12" fill="${WHITE}" opacity="0.92"/>
      <rect x="120" y="110" width="120" height="60" rx="6" fill="${EMERALD}" opacity="0.35"/>
      <rect x="260" y="110" width="120" height="60" rx="6" fill="${TEAL}" opacity="0.35"/>
      <rect x="400" y="110" width="120" height="60" rx="6" fill="${NAVY}" opacity="0.25"/>
      <rect x="120" y="190" width="400" height="90" rx="8" fill="${EMERALD}" opacity="0.12"/>
      <text x="320" y="240" text-anchor="middle" fill="${NAVY}" font-size="12" font-weight="700">Stock Dashboard</text>
    `,
  },
  {
    slug: 'software-business-management-software',
    title: 'Business Mgmt',
    subtitle: 'Ledger · Due · Collection',
    price: '৳20,000',
    visual: `
      <rect x="80" y="80" width="220" height="260" rx="10" fill="${WHITE}" opacity="0.9"/>
      <rect x="330" y="80" width="230" height="120" rx="10" fill="${WHITE}" opacity="0.9"/>
      <rect x="330" y="220" width="230" height="120" rx="10" fill="${WHITE}" opacity="0.9"/>
      <rect x="95" y="100" width="190" height="20" rx="4" fill="${EMERALD}" opacity="0.4"/>
      <rect x="95" y="130" width="190" height="20" rx="4" fill="${MUTED}" opacity="0.3"/>
      <text x="445" y="145" text-anchor="middle" fill="${NAVY}" font-size="11" font-weight="600">Due Report</text>
      <text x="445" y="285" text-anchor="middle" fill="${NAVY}" font-size="11" font-weight="600">P&amp;L</text>
    `,
  },
  {
    slug: 'software-advanced-business-erp',
    title: 'Advanced ERP',
    subtitle: 'Transfer · Accounts · Roles',
    price: '৳50,000',
    visual: `
      <rect x="60" y="70" width="520" height="280" rx="12" fill="${WHITE}" opacity="0.93"/>
      <rect x="75" y="85" width="90" height="250" rx="6" fill="${NAVY}" opacity="0.9"/>
      <rect x="180" y="85" width="380" height="110" rx="6" fill="${EMERALD}" opacity="0.15"/>
      <rect x="180" y="210" width="180" height="125" rx="6" fill="${TEAL}" opacity="0.12"/>
      <rect x="380" y="210" width="180" height="125" rx="6" fill="${EMERALD}" opacity="0.12"/>
    `,
  },
  {
    slug: 'software-manufacturing-production-erp',
    title: 'Manufacturing ERP',
    subtitle: 'RM → BOM → Production',
    price: '৳100,000',
    visual: `
      <rect x="70" y="100" width="120" height="80" rx="8" fill="${WHITE}" opacity="0.9"/>
      <rect x="220" y="100" width="120" height="80" rx="8" fill="${WHITE}" opacity="0.9"/>
      <rect x="370" y="100" width="120" height="80" rx="8" fill="${WHITE}" opacity="0.9"/>
      <path d="M190 140 L220 140" stroke="${EMERALD}" stroke-width="3"/>
      <path d="M340 140 L370 140" stroke="${EMERALD}" stroke-width="3"/>
      <rect x="200" y="220" width="240" height="70" rx="10" fill="${EMERALD}" opacity="0.75"/>
      <text x="320" y="262" text-anchor="middle" fill="white" font-size="12" font-weight="700">Factory Flow</text>
    `,
  },
  {
    slug: 'software-enterprise-business-automation',
    title: 'Enterprise',
    subtitle: 'Approval · SO · Delivery',
    price: '৳200,000+',
    visual: `
      <rect x="60" y="80" width="520" height="260" rx="12" fill="${WHITE}" opacity="0.92"/>
      <rect x="80" y="100" width="140" height="50" rx="6" fill="${EMERALD}"/>
      <text x="150" y="132" text-anchor="middle" fill="white" font-size="10" font-weight="700">Requisition</text>
      <rect x="240" y="100" width="140" height="50" rx="6" fill="${TEAL}"/>
      <text x="310" y="132" text-anchor="middle" fill="white" font-size="10" font-weight="700">Approval</text>
      <rect x="400" y="100" width="140" height="50" rx="6" fill="${NAVY}"/>
      <text x="470" y="132" text-anchor="middle" fill="white" font-size="10" font-weight="700">Delivery</text>
      <rect x="120" y="190" width="400" height="120" rx="8" fill="${EMERALD}" opacity="0.12"/>
      <text x="320" y="255" text-anchor="middle" fill="${NAVY}" font-size="13" font-weight="700">Management KPIs</text>
    `,
  },
];

const ALL_COVERS = [...COVERS, ...SOFTWARE_COVERS];

function renderCover(spec: CoverSpec): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${NAVY}"/>
      <stop offset="100%" style="stop-color:#132f52"/>
    </linearGradient>
    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6" fill="${EMERALD}"/>
    </marker>
  </defs>
  <rect width="640" height="400" fill="url(#bg)"/>
  <text x="32" y="48" fill="${EMERALD}" font-size="13" font-weight="700" font-family="system-ui,sans-serif">BRIDGE IT PARK</text>
  <text x="32" y="78" fill="${WHITE}" font-size="26" font-weight="800" font-family="system-ui,sans-serif">${spec.title}</text>
  <text x="32" y="104" fill="${MUTED}" font-size="14" font-family="system-ui,sans-serif">${spec.subtitle}</text>
  <text x="32" y="360" fill="${EMERALD}" font-size="22" font-weight="800" font-family="system-ui,sans-serif">${spec.price}</text>
  ${spec.visual}
</svg>`;
}

mkdirSync(OUT, { recursive: true });

for (const spec of ALL_COVERS) {
  const svgPath = join(OUT, `${spec.slug}.svg`);
  writeFileSync(svgPath, renderCover(spec));
  console.log(`Generated ${svgPath}`);
}

console.log(`Done — ${ALL_COVERS.length} flagship covers generated.`);
