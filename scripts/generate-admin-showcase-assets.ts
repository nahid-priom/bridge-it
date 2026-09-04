/**
 * Generate design manifests + AVIF assets for admin software showcase.
 * Usage:
 *   npx tsx scripts/generate-admin-showcase-assets.ts [--slug=…] [--force]
 *     [--screens-only] [--covers-only] [--allow-svg-covers]
 *
 * Covers prefer cover.png → AVIF. Never overwrites cover.png with SVG.
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';
import type { SeedSoftwareProduct, SoftwareScreenSeed } from '../src/features/software-showcase/types';

const ROOT = path.join(process.cwd(), 'seed-assets/admin-systems');
const force = process.argv.includes('--force');
const screensOnly = process.argv.includes('--screens-only');
const coversOnly = process.argv.includes('--covers-only');
const allowSvgCovers = process.argv.includes('--allow-svg-covers');
const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.slice(7);

const CARD_W = 720;
const CARD_MAX = 50 * 1024;
const DETAIL_W = 1200;
const FONT = 'Inter,Segoe UI,Arial,sans-serif';
const COVER_DIRS = [
  'desktop-plus-phone',
  'laptop-ops-board',
  'pos-counter-dashboard',
  'multi-window-analytics',
  'tablet-field-ops',
  'ops-board-plus-charts',
] as const;

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function hashSlug(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function sideFill(t: SeedSoftwareProduct['theme']) {
  if (t.sidebar === 'dark') return '#0f172a';
  if (t.sidebar === 'brand') return t.primary;
  return '#f8fafc';
}
function sideText(t: SeedSoftwareProduct['theme']) {
  return t.sidebar === 'light' ? '#0f172a' : '#f8fafc';
}
function sideMuted(t: SeedSoftwareProduct['theme']) {
  return t.sidebar === 'light' ? '#64748b' : '#94a3b8';
}

function visualPersonality(p: SeedSoftwareProduct) {
  if (p.platformType === 'mobile') return 'mobile-ops-field';
  if (p.softwareType === 'POS') return 'retail-counter-precision';
  if (p.softwareType === 'CRM') return 'pipeline-relationship';
  if (p.softwareType === 'Healthcare') return 'clinical-clarity';
  if (p.softwareType === 'Manufacturing' || /mill|factory|production/i.test(p.industry))
    return 'industrial-ops';
  if (p.softwareType === 'SaaS') return 'multi-tenant-saas';
  return 'enterprise-control';
}

function themeDirection(p: SeedSoftwareProduct) {
  const dens = p.theme.density === 'compact' ? 'dense' : 'airy';
  return `${p.theme.sidebar}-sidebar-${dens}-${p.softwareType.toLowerCase().replace(/\s+/g, '-')}`;
}

function navigationStyle(p: SeedSoftwareProduct) {
  if (p.platformType === 'mobile') return 'bottom-tabs';
  if (p.softwareType === 'POS') return 'compact-top-rail';
  if (p.modules.length > 7) return 'grouped-sidebar';
  return 'flat-sidebar';
}

function dashboardLayout(p: SeedSoftwareProduct) {
  if (p.softwareType === 'POS') return 'kpi-strip-plus-live-sales';
  if (p.softwareType === 'CRM') return 'pipeline-kanban-focus';
  if (p.softwareType === 'Healthcare') return 'census-alerts-schedule';
  return 'kpi-row-chart-actions';
}

function chartPatterns(p: SeedSoftwareProduct) {
  const all = ['bar', 'line', 'donut', 'area'] as const;
  const h = hashSlug(p.slug);
  const a = all[h % 4];
  const b = all[(h >> 2) % 4];
  const c = all[(h >> 4) % 4];
  return [...new Set([a, b, c === a ? all[(h + 1) % 4] : c])];
}

function coverDirection(p: SeedSoftwareProduct) {
  return COVER_DIRS[hashSlug(p.slug) % COVER_DIRS.length];
}

function mobileStrategy(p: SeedSoftwareProduct) {
  if (p.platformType === 'mobile') return 'native-phone-bottom-nav';
  if (p.platformType === 'web-mobile') return 'responsive-drawer-plus-phone';
  return 'desktop-first-responsive-drawer';
}

/** Business-aware quick actions — not generic "New Module" only. */
function deriveQuickActions(p: SeedSoftwareProduct): string[] {
  const type = p.softwareType.toLowerCase();
  const ind = `${p.industry} ${p.businessType}`.toLowerCase();
  const terms = p.terminology;
  const mods = p.modules;
  const pick = (n: number) => terms[n % Math.max(terms.length, 1)] || mods[n % Math.max(mods.length, 1)] || 'Record';

  const typed: string[] = [];
  if (type === 'pos' || /retail|shop|pharmacy/.test(ind)) {
    typed.push('New Sale', 'Open Shift', `Add ${pick(0)}`, 'Cash Reconciliation');
  } else if (type === 'crm' || /sales force|pipeline/.test(ind)) {
    typed.push('New Lead', 'Log Call', 'Create Proposal', `Qualify ${pick(0)}`);
  } else if (type === 'manufacturing' || /mill|factory|batch|production|garment/.test(ind)) {
    typed.push('Production Batch', `New ${pick(0)}`, 'Issue Materials', 'QC Release');
  } else if (type === 'healthcare' || /clinic|hospital|pharmacy|patient/.test(ind)) {
    typed.push('New Appointment', `Admit ${pick(0)}`, 'Lab Order', 'Discharge Summary');
  } else if (type === 'hrm' || /payroll|recruit/.test(ind)) {
    typed.push('New Employee', 'Run Payroll', 'Leave Request', 'Attendance Sync');
  } else if (type === 'logistics' || /fleet|warehouse|dispatch/.test(ind)) {
    typed.push('New Shipment', 'Assign Vehicle', `Book ${pick(0)}`, 'Delivery Confirm');
  } else if (type === 'agro' || /farm|dairy|poultry|cattle/.test(ind)) {
    typed.push(`New ${pick(0)}`, 'Record Collection', 'Feed Issue', 'Sale Entry');
  } else if (type === 'education' || /school|college|student/.test(ind)) {
    typed.push('New Admission', 'Fee Collection', 'Mark Attendance', `Add ${pick(0)}`);
  } else if (type === 'hospitality' || /hotel|restaurant/.test(ind)) {
    typed.push('New Booking', 'Check-in Guest', 'Kitchen Order', 'Folio Close');
  } else if (type === 'saas' || type === 'automation') {
    typed.push('New Tenant', 'Invite User', 'Create Workflow', 'View Usage');
  } else {
    typed.push(
      `New ${pick(0)}`,
      `Create ${mods[0] || pick(1)}`,
      `Post ${pick(2)}`,
      `${mods[1] || 'Run'} Report`
    );
  }

  // Prefer module-aware labels when still too generic
  return typed.slice(0, 4).map((a, i) => {
    if (/^New Module/i.test(a) && mods[i]) return `New ${mods[i]}`;
    return a;
  });
}

function buildManifest(product: SeedSoftwareProduct) {
  const quickActions = deriveQuickActions(product);
  return {
    premiumUpgradeVersion: 2,
    productName: product.title,
    businessType: product.businessType,
    targetUser: product.primaryUser,
    visualPersonality: visualPersonality(product),
    themeDirection: themeDirection(product),
    navigationStyle: navigationStyle(product),
    dashboardLayout: dashboardLayout(product),
    primaryKPIs: product.dashboardKPIs,
    quickActions,
    businessModules: product.modules,
    tablePatterns: product.terminology.slice(0, 6),
    chartPatterns: chartPatterns(product),
    mobileStrategy: mobileStrategy(product),
    coverDirection: coverDirection(product),
    screenList: product.screens.map((s) => ({ key: s.key, name: s.name, category: s.category })),
    // retained catalog context
    brandName: product.title,
    primaryUser: product.primaryUser,
    solutionGroup: product.solutionGroup,
    softwareType: product.softwareType,
    platformType: product.platformType,
    modules: product.modules,
    dashboardKPIs: product.dashboardKPIs,
    navigation: product.screens.map((s) => s.name),
    tableTypes: product.terminology.slice(0, 4),
    chartTypes: chartPatterns(product),
    workflow: product.modules.slice(0, 5),
    terminology: product.terminology,
    visualStyle: visualPersonality(product),
    theme: product.theme,
    mobileBehavior: mobileStrategy(product),
    industry: product.industry,
    screens: product.screens,
  };
}

function kpiValues(i: number) {
  return i === 0 ? '128' : i === 1 ? '94.2%' : i === 2 ? '৳2.4L' : '18';
}

function statusLabel(r: number) {
  return r % 3 === 0 ? 'Active' : r % 3 === 1 ? 'Pending' : 'Closed';
}

function statusColor(r: number) {
  return r % 3 === 0 ? '#16a34a' : r % 3 === 1 ? '#d97706' : '#64748b';
}

function navItems(product: SeedSoftwareProduct, activeKey: string) {
  return product.screens
    .slice(0, 8)
    .map((s, i) => {
      const y = 108 + i * 36;
      const active = s.key === activeKey;
      return `<rect x="12" y="${y}" width="196" height="32" rx="8" fill="${active ? product.theme.accent : 'transparent'}" opacity="${active ? 0.22 : 0}"/>
        <circle cx="28" cy="${y + 16}" r="4" fill="${active ? product.theme.accent : sideMuted(product.theme)}"/>
        <text x="42" y="${y + 21}" font-family="${FONT}" font-size="13" fill="${active ? sideText(product.theme) : sideMuted(product.theme)}">${esc(s.name)}</text>`;
    })
    .join('');
}

function chrome(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const side = sideFill(product.theme);
  const text = sideText(product.theme);
  return `<rect x="0" y="0" width="220" height="640" fill="${side}"/>
  <text x="24" y="42" font-family="${FONT}" font-size="15" font-weight="800" fill="${text}">${esc(product.title)}</text>
  <text x="24" y="64" font-family="${FONT}" font-size="11" fill="${sideMuted(product.theme)}">${esc(product.softwareType)} · ${esc(product.industry)}</text>
  ${navItems(product, screen.key)}
  <rect x="220" y="0" width="804" height="64" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="244" y="40" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">${esc(screen.name)}</text>
  <rect x="680" y="16" width="220" height="32" rx="16" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="700" y="37" font-family="${FONT}" font-size="12" fill="#94a3b8">Search ${esc(product.terminology[0] || 'records')}…</text>
  <circle cx="940" cy="32" r="12" fill="${product.theme.accent}" opacity="0.3"/>`;
}

function kpiCards(product: SeedSoftwareProduct) {
  return product.dashboardKPIs
    .slice(0, 4)
    .map((kpi, i) => {
      const x = 244 + i * 178;
      return `<rect x="${x}" y="88" width="168" height="92" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="${x + 16}" y="116" font-family="${FONT}" font-size="12" fill="#64748b">${esc(kpi)}</text>
        <text x="${x + 16}" y="148" font-family="${FONT}" font-size="26" font-weight="700" fill="#0f172a">${kpiValues(i)}</text>
        <rect x="${x + 16}" y="160" width="72" height="6" rx="3" fill="${product.theme.primary}" opacity="0.25"/>`;
    })
    .join('');
}

function chartPanel(product: SeedSoftwareProduct, x: number, y: number, w: number, h: number, title: string) {
  const kind = chartPatterns(product)[0];
  const bars = [48, 72, 56, 88, 64, 96, 70];
  let body = '';
  if (kind === 'line' || kind === 'area') {
    const pts = bars.map((b, i) => `${x + 28 + i * ((w - 56) / 6)},${y + h - 28 - b}`).join(' ');
    if (kind === 'area') {
      body = `<polygon points="${x + 28},${y + h - 28} ${pts} ${x + w - 28},${y + h - 28}" fill="${product.theme.primary}" opacity="0.12"/>
        <polyline points="${pts}" fill="none" stroke="${product.theme.primary}" stroke-width="3"/>`;
    } else {
      body = `<polyline points="${pts}" fill="none" stroke="${product.theme.primary}" stroke-width="3"/>
        ${bars.map((b, i) => `<circle cx="${x + 28 + i * ((w - 56) / 6)}" cy="${y + h - 28 - b}" r="4" fill="${product.theme.accent}"/>`).join('')}`;
    }
  } else if (kind === 'donut') {
    const cx = x + w / 2;
    const cy = y + h / 2 + 8;
    body = `<circle cx="${cx}" cy="${cy}" r="54" fill="none" stroke="#e2e8f0" stroke-width="18"/>
      <circle cx="${cx}" cy="${cy}" r="54" fill="none" stroke="${product.theme.primary}" stroke-width="18" stroke-dasharray="220 340" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
      <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="#0f172a">68%</text>`;
  } else {
    body = bars
      .map((bh, i) => {
        const bx = x + 24 + i * ((w - 40) / 7);
        return `<rect x="${bx}" y="${y + h - 24 - bh}" width="22" height="${bh}" rx="5" fill="${product.theme.primary}" opacity="${0.4 + i * 0.08}"/>`;
      })
      .join('');
  }
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="${x + 20}" y="${y + 28}" font-family="${FONT}" font-size="14" font-weight="700" fill="#0f172a">${esc(title)}</text>${body}`;
}

function quickActionList(product: SeedSoftwareProduct, x: number, y: number) {
  const actions = deriveQuickActions(product);
  return `<rect x="${x}" y="${y}" width="262" height="220" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="${x + 24}" y="${y + 32}" font-family="${FONT}" font-size="14" font-weight="700" fill="#0f172a">Quick Actions</text>
    ${actions
      .map((a, i) => {
        const ay = y + 58 + i * 36;
        return `<rect x="${x + 24}" y="${ay}" width="214" height="28" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
          <text x="${x + 40}" y="${ay + 19}" font-family="${FONT}" font-size="12" fill="#334155">${esc(a)}</text>`;
      })
      .join('')}`;
}

function dashboardBlock(product: SeedSoftwareProduct) {
  return `${kpiCards(product)}${chartPanel(product, 244, 200, 450, 220, product.dashboardKPIs[0] || 'Overview')}${quickActionList(product, 714, 200)}`;
}

function listBlock(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const headers = product.terminology.slice(0, 4);
  const chips = product.terminology.slice(0, 3);
  const rows = Array.from({ length: 5 }, (_, r) => r);
  return `<rect x="244" y="88" width="732" height="512" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="268" y="122" font-family="${FONT}" font-size="16" font-weight="700" fill="#0f172a">${esc(screen.name)}</text>
    <rect x="268" y="140" width="280" height="32" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="284" y="161" font-family="${FONT}" font-size="12" fill="#94a3b8">Filter ${esc(headers[0] || 'records')}…</text>
    ${chips
      .map((c, i) => {
        const x = 568 + i * 100;
        return `<rect x="${x}" y="140" width="88" height="32" rx="16" fill="${i === 0 ? product.theme.primary : '#f1f5f9'}"/>
          <text x="${x + 44}" y="161" text-anchor="middle" font-family="${FONT}" font-size="11" fill="${i === 0 ? '#fff' : '#475569'}">${esc(c.slice(0, 10))}</text>`;
      })
      .join('')}
    ${headers
      .map((h, i) => `<text x="${268 + i * 150}" y="204" font-family="${FONT}" font-size="11" font-weight="600" fill="#64748b">${esc(h.toUpperCase())}</text>`)
      .join('')}
    <line x1="252" y1="214" x2="960" y2="214" stroke="#e2e8f0"/>
    ${rows
      .map((r) => {
        const y = 244 + r * 52;
        const cells = headers
          .map((h, i) => {
            if (i === 2) {
              return `<rect x="${268 + i * 150}" y="${y - 14}" width="64" height="22" rx="11" fill="${statusColor(r)}" opacity="0.15"/>
                <text x="${300 + i * 150}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="11" fill="${statusColor(r)}">${statusLabel(r)}</text>`;
            }
            const sample =
              i === 0
                ? `${h.slice(0, 3).toUpperCase()}-${1000 + r * 7}`
                : i === 1
                  ? product.terminology[(r + i) % product.terminology.length]
                  : `৳${(12 + r * 3).toLocaleString()}K`;
            return `<text x="${268 + i * 150}" y="${y}" font-family="${FONT}" font-size="13" fill="#0f172a">${esc(sample)}</text>`;
          })
          .join('');
        return `<line x1="252" y1="${y + 16}" x2="960" y2="${y + 16}" stroke="#f1f5f9"/>${cells}`;
      })
      .join('')}
    <text x="268" y="560" font-family="${FONT}" font-size="12" fill="#64748b">Showing 1–5 of 48 ${esc(headers[0] || 'records')}</text>
    <rect x="820" y="540" width="64" height="28" rx="8" fill="#f1f5f9"/><text x="852" y="559" text-anchor="middle" font-family="${FONT}" font-size="12" fill="#334155">Prev</text>
    <rect x="896" y="540" width="64" height="28" rx="8" fill="${product.theme.primary}"/><text x="928" y="559" text-anchor="middle" font-family="${FONT}" font-size="12" fill="#fff">Next</text>`;
}

function formBlock(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const fields = product.terminology.slice(0, 6);
  return `<rect x="244" y="88" width="732" height="512" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="268" y="128" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">${esc(screen.name)}</text>
    <text x="268" y="152" font-family="${FONT}" font-size="12" fill="#64748b">${esc(product.businessType)} · ${esc(product.terminology[0] || 'Record')}</text>
    ${fields
      .map((f, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 268 + col * 340;
        const y = 186 + row * 100;
        return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="12" fill="#64748b">${esc(f)}</text>
          <rect x="${x}" y="${y + 10}" width="300" height="40" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
          <text x="${x + 14}" y="${y + 36}" font-family="${FONT}" font-size="13" fill="#94a3b8">Enter ${esc(f.toLowerCase())}</text>`;
      })
      .join('')}
    <rect x="268" y="520" width="140" height="36" rx="10" fill="${product.theme.primary}"/>
    <text x="338" y="543" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="600" fill="#ffffff">Save ${esc(fields[0] || 'Record')}</text>`;
}

function reportsBlock(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const kpis = product.dashboardKPIs.slice(0, 3);
  return `<rect x="244" y="88" width="732" height="48" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="268" y="118" font-family="${FONT}" font-size="13" fill="#64748b">Date range</text>
    <rect x="360" y="100" width="120" height="28" rx="8" fill="#f8fafc" stroke="#e2e8f0"/><text x="420" y="119" text-anchor="middle" font-family="${FONT}" font-size="12" fill="#334155">01 Sep</text>
    <rect x="492" y="100" width="120" height="28" rx="8" fill="#f8fafc" stroke="#e2e8f0"/><text x="552" y="119" text-anchor="middle" font-family="${FONT}" font-size="12" fill="#334155">30 Sep</text>
    <rect x="760" y="98" width="88" height="32" rx="8" fill="#f1f5f9"/><text x="804" y="119" text-anchor="middle" font-family="${FONT}" font-size="12" fill="#334155">Export</text>
    <rect x="860" y="98" width="88" height="32" rx="8" fill="${product.theme.primary}"/><text x="904" y="119" text-anchor="middle" font-family="${FONT}" font-size="12" fill="#fff">PDF</text>
    ${kpis
      .map((k, i) => {
        const x = 244 + i * 248;
        return `<rect x="${x}" y="156" width="232" height="80" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
          <text x="${x + 16}" y="186" font-family="${FONT}" font-size="12" fill="#64748b">${esc(k)}</text>
          <text x="${x + 16}" y="216" font-family="${FONT}" font-size="22" font-weight="700" fill="#0f172a">${kpiValues(i)}</text>`;
      })
      .join('')}
    ${chartPanel(product, 244, 256, 732, 344, screen.name)}`;
}

function posBillingBlock(product: SeedSoftwareProduct) {
  const items = product.terminology.slice(0, 4);
  return `<rect x="244" y="88" width="480" height="512" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="268" y="124" font-family="${FONT}" font-size="16" font-weight="700" fill="#0f172a">Cart · ${esc(product.title)}</text>
    ${items
      .map((item, i) => {
        const y = 148 + i * 56;
        return `<rect x="260" y="${y}" width="448" height="48" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
          <text x="276" y="${y + 30}" font-family="${FONT}" font-size="13" fill="#0f172a">${esc(item)} × ${i + 1}</text>
          <text x="680" y="${y + 30}" text-anchor="end" font-family="${FONT}" font-size="13" font-weight="600" fill="#0f172a">৳${(120 + i * 45).toLocaleString()}</text>`;
      })
      .join('')}
    <rect x="744" y="88" width="232" height="512" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="860" y="130" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="700" fill="#0f172a">Total</text>
    <text x="860" y="178" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="800" fill="${product.theme.primary}">৳2,480</text>
    <rect x="768" y="220" width="184" height="48" rx="12" fill="${product.theme.primary}"/><text x="860" y="250" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="700" fill="#fff">Cash</text>
    <rect x="768" y="284" width="184" height="48" rx="12" fill="#f8fafc" stroke="#e2e8f0"/><text x="860" y="314" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="600" fill="#334155">Card / bKash</text>
    <rect x="768" y="520" width="184" height="48" rx="12" fill="${product.theme.accent}"/><text x="860" y="550" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="700" fill="#0f172a">Complete Sale</text>`;
}

function crmPipelineBlock(product: SeedSoftwareProduct) {
  const stages = ['New', 'Contacted', 'Proposal', 'Won'];
  return stages
    .map((stage, i) => {
      const x = 244 + i * 190;
      return `<rect x="${x}" y="88" width="176" height="512" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="${x + 16}" y="118" font-family="${FONT}" font-size="13" font-weight="700" fill="#0f172a">${esc(stage)}</text>
        ${[0, 1, 2]
          .map((c) => {
            const y = 140 + c * 100;
            const term = product.terminology[c % product.terminology.length];
            return `<rect x="${x + 12}" y="${y}" width="152" height="84" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
              <text x="${x + 24}" y="${y + 28}" font-family="${FONT}" font-size="12" font-weight="600" fill="#0f172a">${esc(term)}</text>
              <text x="${x + 24}" y="${y + 52}" font-family="${FONT}" font-size="11" fill="#64748b">৳${(80 + i * 20 + c * 15).toLocaleString()}K</text>`;
          })
          .join('')}`;
    })
    .join('');
}

function mobileScreenSvg(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const tabs = product.screens.slice(0, 4);
  const primary = product.theme.primary;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="860" viewBox="0 0 420 860">
  <rect width="420" height="860" fill="#0f172a"/>
  <rect x="16" y="16" width="388" height="828" rx="28" fill="#f8fafc"/>
  <rect x="16" y="16" width="388" height="72" rx="28" fill="${primary}"/>
  <rect x="16" y="56" width="388" height="32" fill="${primary}"/>
  <text x="210" y="58" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="#ffffff">${esc(screen.name)}</text>
  <text x="36" y="120" font-family="${FONT}" font-size="12" fill="#64748b">${esc(product.softwareType)} · ${esc(product.terminology[0] || product.industry)}</text>
  ${product.dashboardKPIs
    .slice(0, 2)
    .map((k, i) => {
      const x = 36 + i * 178;
      return `<rect x="${x}" y="140" width="168" height="72" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="${x + 14}" y="168" font-family="${FONT}" font-size="11" fill="#64748b">${esc(k)}</text>
        <text x="${x + 14}" y="196" font-family="${FONT}" font-size="20" font-weight="700" fill="#0f172a">${kpiValues(i)}</text>`;
    })
    .join('')}
  ${[0, 1, 2, 3]
    .map((i) => {
      const y = 232 + i * 100;
      const label = product.modules[i % product.modules.length] || product.terminology[i % product.terminology.length];
      const term = product.terminology[i % product.terminology.length];
      return `<rect x="36" y="${y}" width="348" height="84" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
        <circle cx="68" cy="${y + 42}" r="16" fill="${primary}" opacity="0.2"/>
        <text x="100" y="${y + 36}" font-family="${FONT}" font-size="14" font-weight="600" fill="#0f172a">${esc(label)}</text>
        <text x="100" y="${y + 58}" font-family="${FONT}" font-size="12" fill="#64748b">${esc(term)} · ${esc(screen.name)}</text>`;
    })
    .join('')}
  <rect x="16" y="760" width="388" height="84" fill="#ffffff" stroke="#e2e8f0"/>
  ${tabs
    .map((t, i) => {
      const x = 40 + i * 90;
      const on = t.key === screen.key || (i === 0 && !tabs.some((x) => x.key === screen.key));
      return `<text x="${x + 30}" y="810" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="${on ? 700 : 500}" fill="${on ? primary : '#94a3b8'}">${esc(t.name.slice(0, 8))}</text>
        <circle cx="${x + 30}" cy="785" r="5" fill="${on ? primary : '#cbd5e1'}"/>`;
    })
    .join('')}
</svg>`;
}

function screenContent(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const key = screen.key.toLowerCase();
  if (key.includes('pos-billing') || (product.softwareType === 'POS' && key.includes('billing'))) {
    return posBillingBlock(product);
  }
  if (key === 'pipeline' || (product.softwareType === 'CRM' && key.includes('pipeline'))) {
    return crmPipelineBlock(product);
  }
  if (screen.category === 'dashboard') return dashboardBlock(product);
  if (screen.category === 'reports') return reportsBlock(product, screen);
  if (screen.category === 'form' || screen.category === 'settings' || screen.category === 'users') {
    return formBlock(product, screen);
  }
  if (screen.category === 'list' || screen.category === 'stock' || screen.category === 'transaction' || screen.category === 'accounts' || screen.category === 'detail') {
    return listBlock(product, screen);
  }
  return listBlock(product, screen);
}

function screenSvg(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  if (product.platformType === 'mobile' || product.softwareType === 'Mobile App') {
    return mobileScreenSvg(product, screen);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="640" viewBox="0 0 1024 640">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f1f5f9"/><stop offset="100%" stop-color="#e2e8f0"/></linearGradient></defs>
  <rect width="1024" height="640" fill="url(#bg)"/>
  ${chrome(product, screen)}
  ${screenContent(product, screen)}
</svg>`;
}

function coverSvg(product: SeedSoftwareProduct) {
  const primary = product.theme.primary;
  const accent = product.theme.accent;
  const kpis = product.dashboardKPIs.slice(0, 3);
  const dir = coverDirection(product);
  const phoneX = dir.includes('phone') || dir.includes('pos') ? 960 : 940;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <defs>
    <linearGradient id="desk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.1"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.28"/>
    </filter>
  </defs>
  <rect width="1280" height="800" fill="url(#desk)"/>
  <rect x="80" y="90" width="820" height="520" rx="18" fill="#0f172a" filter="url(#shadow)"/>
  <rect x="96" y="106" width="788" height="464" rx="10" fill="#f8fafc"/>
  <rect x="96" y="106" width="180" height="464" fill="${sideFill(product.theme)}"/>
  <text x="116" y="140" font-family="${FONT}" font-size="14" font-weight="800" fill="${sideText(product.theme)}">${esc(product.title)}</text>
  ${product.screens
    .slice(0, 6)
    .map((s, i) => `<text x="116" y="${180 + i * 34}" font-family="${FONT}" font-size="12" fill="${sideMuted(product.theme)}">${esc(s.name)}</text>`)
    .join('')}
  <rect x="296" y="126" width="560" height="40" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="312" y="152" font-family="${FONT}" font-size="14" font-weight="700" fill="#0f172a">${esc(product.softwareType)} · ${esc(dir.replace(/-/g, ' '))}</text>
  ${kpis
    .map((k, i) => {
      const x = 296 + i * 188;
      return `<rect x="${x}" y="184" width="176" height="84" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="${x + 14}" y="210" font-family="${FONT}" font-size="11" fill="#64748b">${esc(k)}</text>
        <text x="${x + 14}" y="242" font-family="${FONT}" font-size="22" font-weight="800" fill="${primary}">${kpiValues(i)}</text>`;
    })
    .join('')}
  <rect x="296" y="288" width="560" height="250" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="316" y="320" font-family="${FONT}" font-size="13" font-weight="700" fill="#0f172a">${esc(product.terminology[0] || 'Records')}</text>
  ${[0, 1, 2, 3, 4]
    .map(
      (r) =>
        `<rect x="316" y="${344 + r * 34}" width="520" height="24" rx="6" fill="${r % 2 ? '#f8fafc' : '#ffffff'}" stroke="#f1f5f9"/>
         <text x="328" y="${361 + r * 34}" font-family="${FONT}" font-size="11" fill="#334155">${esc(product.terminology[r % product.terminology.length])} · ${esc(deriveQuickActions(product)[r % 4])}</text>`
    )
    .join('')}
  <rect x="${phoneX}" y="180" width="220" height="440" rx="28" fill="#0f172a" filter="url(#shadow)"/>
  <rect x="${phoneX + 12}" y="198" width="196" height="404" rx="20" fill="#f8fafc"/>
  <rect x="${phoneX + 12}" y="198" width="196" height="56" fill="${primary}"/>
  <text x="${phoneX + 110}" y="232" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="#ffffff">${esc(product.title.split(' ')[0])}</text>
  ${product.modules
    .slice(0, 5)
    .map((m, i) => {
      const y = 278 + i * 52;
      return `<rect x="${phoneX + 30}" y="${y}" width="160" height="40" rx="10" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="${phoneX + 110}" y="${y + 25}" text-anchor="middle" font-family="${FONT}" font-size="11" fill="#334155">${esc(m)}</text>`;
    })
    .join('')}
  <text x="640" y="760" text-anchor="middle" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">${esc(product.title)}</text>
  <text x="640" y="786" text-anchor="middle" font-family="${FONT}" font-size="13" fill="#64748b">${esc(product.shortDescription.slice(0, 90))}</text>
</svg>`;
}

async function svgToAvif(svg: string, outPath: string, width: number, quality: number) {
  const buf = await sharp(Buffer.from(svg))
    .resize({ width, withoutEnlargement: true })
    .avif({ quality, effort: 4 })
    .toBuffer();
  await writeFile(outPath, buf);
  return buf.length;
}

async function encodePngToAvif(
  inputPath: string,
  outPath: string,
  width: number,
  startQuality: number,
  maxBytes?: number
) {
  let quality = startQuality;
  let buf = await sharp(inputPath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .avif({ quality, effort: 5 })
    .toBuffer();
  if (maxBytes) {
    while (buf.length > maxBytes && quality > 28) {
      quality -= 4;
      buf = await sharp(inputPath)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .avif({ quality, effort: 5 })
        .toBuffer();
    }
  }
  await writeFile(outPath, buf);
  return { bytes: buf.length, quality };
}

async function writeCovers(product: SeedSoftwareProduct, dir: string) {
  const coverPng = path.join(dir, 'cover.png');
  const coverCard = path.join(dir, 'cover-card.avif');
  const coverDetail = path.join(dir, 'cover-detail.avif');
  const needCard = force || !(await exists(coverCard));
  const needDetail = force || !(await exists(coverDetail));
  if (!needCard && !needDetail) {
    console.log('  covers up-to-date');
    return;
  }

  const hasPng = await exists(coverPng);
  if (hasPng) {
    if (needCard) {
      const r = await encodePngToAvif(coverPng, coverCard, CARD_W, 52, CARD_MAX);
      console.log(`  cover-card ${(r.bytes / 1024).toFixed(1)}KB (png q=${r.quality})`);
    }
    if (needDetail) {
      const r = await encodePngToAvif(coverPng, coverDetail, DETAIL_W, 62);
      console.log(`  cover-detail ${(r.bytes / 1024).toFixed(1)}KB (png q=${r.quality})`);
    }
    return;
  }

  if (allowSvgCovers || (force && allowSvgCovers)) {
    const svg = coverSvg(product);
    if (needCard) {
      const n = await svgToAvif(svg, coverCard, CARD_W, 48);
      console.log(`  cover-card ${(n / 1024).toFixed(1)}KB (svg fallback)`);
    }
    if (needDetail) {
      const n = await svgToAvif(svg, coverDetail, DETAIL_W, 55);
      console.log(`  cover-detail ${(n / 1024).toFixed(1)}KB (svg fallback)`);
    }
    return;
  }

  console.warn(
    `  skip covers: missing cover.png for ${product.slug} (pass --allow-svg-covers to use SVG, or add cover.png)`
  );
}

async function writeScreens(product: SeedSoftwareProduct, dir: string) {
  for (const screen of product.screens) {
    const preview = path.join(dir, `${screen.key}.avif`);
    const thumb = path.join(dir, `${screen.key}-thumb.avif`);
    if (!force && (await exists(preview)) && (await exists(thumb))) continue;
    const svg = screenSvg(product, screen);
    const p = await svgToAvif(svg, preview, 960, 45);
    const t = await svgToAvif(svg, thumb, 480, 40);
    console.log(`  ${screen.key} preview ${(p / 1024).toFixed(1)}KB thumb ${(t / 1024).toFixed(1)}KB`);
  }
}

async function generateProduct(product: SeedSoftwareProduct) {
  const dir = path.join(ROOT, product.slug);
  await mkdir(dir, { recursive: true });

  const manifestPath = path.join(dir, 'design-manifest.json');
  await writeFile(manifestPath, JSON.stringify(buildManifest(product), null, 2));
  console.log('  wrote design-manifest.json (DNA v2)');

  if (!screensOnly) await writeCovers(product, dir);
  else console.log('  covers skipped (--screens-only)');

  if (!coversOnly) await writeScreens(product, dir);
  else console.log('  screens skipped (--covers-only)');
}

async function main() {
  await mkdir(ROOT, { recursive: true });
  const list = slugArg
    ? SOFTWARE_SEED_PRODUCTS.filter((p) => p.slug === slugArg)
    : SOFTWARE_SEED_PRODUCTS;
  if (!list.length) {
    console.error(slugArg ? `No product matched --slug=${slugArg}` : 'No products matched');
    process.exit(1);
  }
  const mode = screensOnly ? 'screens-only' : coversOnly ? 'covers-only' : 'manifest+covers+screens';
  console.log(`Generating (${mode}) for ${list.length} software systems → ${ROOT}`);
  if (force) console.log('Force enabled: regenerating existing assets where applicable');
  if (allowSvgCovers) console.log('SVG cover fallback allowed when cover.png is missing');

  for (const product of list) {
    console.log(`\n${product.slug}`);
    await generateProduct(product);
  }
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
