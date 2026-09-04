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
const CHARTS = ['bar', 'line', 'donut', 'area'] as const;

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
  return t.sidebar === 'dark' ? '#0f172a' : t.sidebar === 'brand' ? t.primary : '#f8fafc';
}
function sideText(t: SeedSoftwareProduct['theme']) {
  return t.sidebar === 'light' ? '#0f172a' : '#f8fafc';
}
function sideMuted(t: SeedSoftwareProduct['theme']) {
  return t.sidebar === 'light' ? '#64748b' : '#94a3b8';
}
function kpiVal(i: number) {
  return i === 0 ? '128' : i === 1 ? '94.2%' : i === 2 ? '৳2.4L' : '18';
}
function statusOf(r: number) {
  return r % 3 === 0 ? (['Active', '#16a34a'] as const) : r % 3 === 1 ? (['Pending', '#d97706'] as const) : (['Closed', '#64748b'] as const);
}

function visualPersonality(p: SeedSoftwareProduct) {
  if (p.platformType === 'mobile') return 'mobile-ops-field';
  if (p.softwareType === 'POS') return 'retail-counter-precision';
  if (p.softwareType === 'CRM') return 'pipeline-relationship';
  if (p.softwareType === 'Healthcare') return 'clinical-clarity';
  if (p.softwareType === 'Manufacturing' || /mill|factory|production/i.test(p.industry)) return 'industrial-ops';
  if (p.softwareType === 'SaaS') return 'multi-tenant-saas';
  return 'enterprise-control';
}
function themeDirection(p: SeedSoftwareProduct) {
  return `${p.theme.sidebar}-sidebar-${p.theme.density === 'compact' ? 'dense' : 'airy'}-${p.softwareType.toLowerCase().replace(/\s+/g, '-')}`;
}
function navigationStyle(p: SeedSoftwareProduct) {
  if (p.platformType === 'mobile') return 'bottom-tabs';
  if (p.softwareType === 'POS') return 'compact-top-rail';
  return p.modules.length > 7 ? 'grouped-sidebar' : 'flat-sidebar';
}
function dashboardLayout(p: SeedSoftwareProduct) {
  if (p.softwareType === 'POS') return 'kpi-strip-plus-live-sales';
  if (p.softwareType === 'CRM') return 'pipeline-kanban-focus';
  if (p.softwareType === 'Healthcare') return 'census-alerts-schedule';
  return 'kpi-row-chart-actions';
}
function chartPatterns(p: SeedSoftwareProduct) {
  const h = hashSlug(p.slug);
  const pick = (n: number) => CHARTS[n & 3];
  return [...new Set([pick(h), pick(h >>> 2), pick(h >>> 4)])];
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
  const term = (n: number) => terms[n % Math.max(terms.length, 1)] || mods[n % Math.max(mods.length, 1)] || 'Record';

  let actions: string[];
  if (type === 'pos' || /retail|shop|pharmacy/.test(ind))
    actions = ['New Sale', 'Open Shift', `Add ${term(0)}`, 'Cash Reconciliation'];
  else if (type === 'crm' || /sales force|pipeline/.test(ind))
    actions = ['New Lead', 'Log Call', 'Create Proposal', `Qualify ${term(0)}`];
  else if (type === 'manufacturing' || /mill|factory|batch|production|garment/.test(ind))
    actions = ['Production Batch', `New ${term(0)}`, 'Issue Materials', 'QC Release'];
  else if (type === 'healthcare' || /clinic|hospital|patient/.test(ind))
    actions = ['New Appointment', `Admit ${term(0)}`, 'Lab Order', 'Discharge Summary'];
  else if (type === 'hrm' || /payroll|recruit/.test(ind))
    actions = ['New Employee', 'Run Payroll', 'Leave Request', 'Attendance Sync'];
  else if (type === 'logistics' || /fleet|warehouse|dispatch/.test(ind))
    actions = ['New Shipment', 'Assign Vehicle', `Book ${term(0)}`, 'Delivery Confirm'];
  else if (type === 'agro' || /farm|dairy|poultry|cattle/.test(ind))
    actions = [`New ${term(0)}`, 'Record Collection', 'Feed Issue', 'Sale Entry'];
  else if (type === 'education' || /school|college|student/.test(ind))
    actions = ['New Admission', 'Fee Collection', 'Mark Attendance', `Add ${term(0)}`];
  else if (type === 'hospitality' || /hotel|restaurant/.test(ind))
    actions = ['New Booking', 'Check-in Guest', 'Kitchen Order', 'Folio Close'];
  else if (type === 'saas' || type === 'automation')
    actions = ['New Tenant', 'Invite User', 'Create Workflow', 'View Usage'];
  else
    actions = [`New ${term(0)}`, `Create ${mods[0] || term(1)}`, `Post ${term(2)}`, `${mods[1] || 'Run'} Report`];

  return actions.slice(0, 4).map((a, i) => (/^New Module/i.test(a) && mods[i] ? `New ${mods[i]}` : a));
}

function buildManifest(product: SeedSoftwareProduct) {
  const quickActions = deriveQuickActions(product);
  const charts = chartPatterns(product);
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
    chartPatterns: charts,
    mobileStrategy: mobileStrategy(product),
    coverDirection: coverDirection(product),
    screenList: product.screens.map((s) => ({ key: s.key, name: s.name, category: s.category })),
    brandName: product.title,
    primaryUser: product.primaryUser,
    solutionGroup: product.solutionGroup,
    softwareType: product.softwareType,
    platformType: product.platformType,
    modules: product.modules,
    dashboardKPIs: product.dashboardKPIs,
    navigation: product.screens.map((s) => s.name),
    tableTypes: product.terminology.slice(0, 4),
    chartTypes: charts,
    workflow: product.modules.slice(0, 5),
    terminology: product.terminology,
    visualStyle: visualPersonality(product),
    theme: product.theme,
    mobileBehavior: mobileStrategy(product),
    industry: product.industry,
    screens: product.screens,
  };
}

function t(x: number, y: number, s: string, opts: { size?: number; fill?: string; w?: number; anchor?: string } = {}) {
  const { size = 13, fill = '#0f172a', w = 400, anchor } = opts;
  return `<text x="${x}" y="${y}"${anchor ? ` text-anchor="${anchor}"` : ''} font-family="${FONT}" font-size="${size}"${w >= 600 ? ' font-weight="700"' : w >= 500 ? ' font-weight="600"' : ''} fill="${fill}">${esc(s)}</text>`;
}
function rect(x: number, y: number, w: number, h: number, fill: string, extra = '') {
  const rx = /\brx=/.test(extra) ? '' : ' rx="12"';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}"${rx} fill="${fill}"${extra}/>`;
}

function chrome(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const side = sideFill(product.theme);
  const nav = product.screens
    .slice(0, 8)
    .map((s, i) => {
      const y = 108 + i * 36;
      const on = s.key === screen.key;
      return `${on ? rect(12, y, 196, 32, product.theme.accent, ' opacity="0.22"') : ''}
        <circle cx="28" cy="${y + 16}" r="4" fill="${on ? product.theme.accent : sideMuted(product.theme)}"/>
        ${t(42, y + 21, s.name, { size: 13, fill: on ? sideText(product.theme) : sideMuted(product.theme) })}`;
    })
    .join('');
  return `${rect(0, 0, 220, 640, side, ' rx="0"')}
  ${t(24, 42, product.title, { size: 15, fill: sideText(product.theme), w: 800 })}
  ${t(24, 64, `${product.softwareType} · ${product.industry}`, { size: 11, fill: sideMuted(product.theme) })}
  ${nav}
  ${rect(220, 0, 804, 64, '#ffffff', ' stroke="#e2e8f0" rx="0"')}
  ${t(244, 40, screen.name, { size: 18, w: 700 })}
  ${rect(680, 16, 220, 32, '#f8fafc', ' stroke="#e2e8f0" rx="16"')}
  ${t(700, 37, `Search ${product.terminology[0] || 'records'}…`, { size: 12, fill: '#94a3b8' })}
  <circle cx="940" cy="32" r="12" fill="${product.theme.accent}" opacity="0.3"/>`;
}

function chartPanel(product: SeedSoftwareProduct, x: number, y: number, w: number, h: number, title: string) {
  const kind = chartPatterns(product)[0] || 'bar';
  const bars = [48, 72, 56, 88, 64, 96, 70];
  let body = '';
  if (kind === 'line' || kind === 'area') {
    const pts = bars.map((b, i) => `${x + 28 + i * ((w - 56) / 6)},${y + h - 28 - b}`).join(' ');
    body =
      kind === 'area'
        ? `<polygon points="${x + 28},${y + h - 28} ${pts} ${x + w - 28},${y + h - 28}" fill="${product.theme.primary}" opacity="0.12"/><polyline points="${pts}" fill="none" stroke="${product.theme.primary}" stroke-width="3"/>`
        : `<polyline points="${pts}" fill="none" stroke="${product.theme.primary}" stroke-width="3"/>${bars.map((b, i) => `<circle cx="${x + 28 + i * ((w - 56) / 6)}" cy="${y + h - 28 - b}" r="4" fill="${product.theme.accent}"/>`).join('')}`;
  } else if (kind === 'donut') {
    const cx = x + w / 2;
    const cy = y + h / 2 + 8;
    body = `<circle cx="${cx}" cy="${cy}" r="54" fill="none" stroke="#e2e8f0" stroke-width="18"/><circle cx="${cx}" cy="${cy}" r="54" fill="none" stroke="${product.theme.primary}" stroke-width="18" stroke-dasharray="220 340" transform="rotate(-90 ${cx} ${cy})"/>${t(cx, cy + 6, '68%', { size: 16, w: 700, anchor: 'middle' })}`;
  } else {
    body = bars.map((bh, i) => `<rect x="${x + 24 + i * ((w - 40) / 7)}" y="${y + h - 24 - bh}" width="22" height="${bh}" rx="5" fill="${product.theme.primary}" opacity="${0.4 + i * 0.08}"/>`).join('');
  }
  return `${rect(x, y, w, h, '#ffffff', ' stroke="#e2e8f0" rx="16"')}${t(x + 20, y + 28, title, { size: 14, w: 700 })}${body}`;
}

function dashboardBlock(product: SeedSoftwareProduct) {
  const kpis = product.dashboardKPIs.slice(0, 4)
    .map((kpi, i) => {
      const x = 244 + i * 178;
      return `${rect(x, 88, 168, 92, '#ffffff', ' stroke="#e2e8f0" rx="14"')}${t(x + 16, 116, kpi, { size: 12, fill: '#64748b' })}${t(x + 16, 148, kpiVal(i), { size: 26, w: 700 })}${rect(x + 16, 160, 72, 6, product.theme.primary, ' opacity="0.25" rx="3"')}`;
    })
    .join('');
  const actions = deriveQuickActions(product)
    .map((a, i) => {
      const ay = 258 + i * 36;
      return `${rect(738, ay, 214, 28, '#f8fafc', ' stroke="#e2e8f0" rx="8"')}${t(754, ay + 19, a, { size: 12, fill: '#334155' })}`;
    })
    .join('');
  return `${kpis}${chartPanel(product, 244, 200, 450, 220, product.dashboardKPIs[0] || 'Overview')}
    ${rect(714, 200, 262, 220, '#ffffff', ' stroke="#e2e8f0" rx="16"')}${t(738, 232, 'Quick Actions', { size: 14, w: 700 })}${actions}`;
}

function listBlock(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const headers = product.terminology.slice(0, 4);
  const chips = product.terminology.slice(0, 3);
  return `${rect(244, 88, 732, 512, '#ffffff', ' stroke="#e2e8f0" rx="16"')}
    ${t(268, 122, screen.name, { size: 16, w: 700 })}
    ${rect(268, 140, 280, 32, '#f8fafc', ' stroke="#e2e8f0" rx="8"')}${t(284, 161, `Filter ${headers[0] || 'records'}…`, { size: 12, fill: '#94a3b8' })}
    ${chips.map((c, i) => { const x = 568 + i * 100; return `${rect(x, 140, 88, 32, i === 0 ? product.theme.primary : '#f1f5f9', ' rx="16"')}${t(x + 44, 161, c.slice(0, 10), { size: 11, fill: i === 0 ? '#fff' : '#475569', anchor: 'middle' })}`; }).join('')}
    ${headers.map((h, i) => t(268 + i * 150, 204, h.toUpperCase(), { size: 11, fill: '#64748b', w: 600 })).join('')}
    <line x1="252" y1="214" x2="960" y2="214" stroke="#e2e8f0"/>
    ${[0, 1, 2, 3, 4].map((r) => {
      const y = 244 + r * 52;
      const [lab, col] = statusOf(r);
      const cells = headers.map((h, i) => {
        if (i === 2) return `${rect(268 + i * 150, y - 14, 64, 22, col, ' opacity="0.15" rx="11"')}${t(300 + i * 150, y, lab, { size: 11, fill: col, anchor: 'middle' })}`;
        const sample = i === 0 ? `${h.slice(0, 3).toUpperCase()}-${1000 + r * 7}` : i === 1 ? product.terminology[(r + i) % product.terminology.length] : `৳${(12 + r * 3).toLocaleString()}K`;
        return t(268 + i * 150, y, sample, { size: 13 });
      }).join('');
      return `<line x1="252" y1="${y + 16}" x2="960" y2="${y + 16}" stroke="#f1f5f9"/>${cells}`;
    }).join('')}
    ${t(268, 560, `Showing 1–5 of 48 ${headers[0] || 'records'}`, { size: 12, fill: '#64748b' })}
    ${rect(820, 540, 64, 28, '#f1f5f9', ' rx="8"')}${t(852, 559, 'Prev', { size: 12, fill: '#334155', anchor: 'middle' })}
    ${rect(896, 540, 64, 28, product.theme.primary, ' rx="8"')}${t(928, 559, 'Next', { size: 12, fill: '#fff', anchor: 'middle' })}`;
}

function formBlock(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const fields = product.terminology.slice(0, 6);
  return `${rect(244, 88, 732, 512, '#ffffff', ' stroke="#e2e8f0" rx="16"')}
    ${t(268, 128, screen.name, { size: 18, w: 700 })}
    ${t(268, 152, `${product.businessType} · ${product.terminology[0] || 'Record'}`, { size: 12, fill: '#64748b' })}
    ${fields.map((f, i) => {
      const x = 268 + (i % 2) * 340;
      const y = 186 + Math.floor(i / 2) * 100;
      return `${t(x, y, f, { size: 12, fill: '#64748b' })}${rect(x, y + 10, 300, 40, '#f8fafc', ' stroke="#e2e8f0" rx="10"')}${t(x + 14, y + 36, `Enter ${f.toLowerCase()}`, { size: 13, fill: '#94a3b8' })}`;
    }).join('')}
    ${rect(268, 520, 140, 36, product.theme.primary, ' rx="10"')}${t(338, 543, `Save ${fields[0] || 'Record'}`, { size: 13, fill: '#fff', w: 600, anchor: 'middle' })}`;
}

function reportsBlock(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const kpis = product.dashboardKPIs.slice(0, 3);
  return `${rect(244, 88, 732, 48, '#ffffff', ' stroke="#e2e8f0"')}
    ${t(268, 118, 'Date range', { size: 13, fill: '#64748b' })}
    ${rect(360, 100, 120, 28, '#f8fafc', ' stroke="#e2e8f0" rx="8"')}${t(420, 119, '01 Sep', { size: 12, fill: '#334155', anchor: 'middle' })}
    ${rect(492, 100, 120, 28, '#f8fafc', ' stroke="#e2e8f0" rx="8"')}${t(552, 119, '30 Sep', { size: 12, fill: '#334155', anchor: 'middle' })}
    ${rect(760, 98, 88, 32, '#f1f5f9', ' rx="8"')}${t(804, 119, 'Export', { size: 12, fill: '#334155', anchor: 'middle' })}
    ${rect(860, 98, 88, 32, product.theme.primary, ' rx="8"')}${t(904, 119, 'PDF', { size: 12, fill: '#fff', anchor: 'middle' })}
    ${kpis.map((k, i) => { const x = 244 + i * 248; return `${rect(x, 156, 232, 80, '#ffffff', ' stroke="#e2e8f0" rx="14"')}${t(x + 16, 186, k, { size: 12, fill: '#64748b' })}${t(x + 16, 216, kpiVal(i), { size: 22, w: 700 })}`; }).join('')}
    ${chartPanel(product, 244, 256, 732, 344, screen.name)}`;
}

function posBillingBlock(product: SeedSoftwareProduct) {
  const items = product.terminology.slice(0, 4);
  return `${rect(244, 88, 480, 512, '#ffffff', ' stroke="#e2e8f0" rx="16"')}${t(268, 124, `Cart · ${product.title}`, { size: 16, w: 700 })}
    ${items.map((item, i) => { const y = 148 + i * 56; return `${rect(260, y, 448, 48, '#f8fafc', ' stroke="#e2e8f0" rx="10"')}${t(276, y + 30, `${item} × ${i + 1}`, { size: 13 })}${t(680, y + 30, `৳${(120 + i * 45).toLocaleString()}`, { size: 13, w: 600, anchor: 'end' })}`; }).join('')}
    ${rect(744, 88, 232, 512, '#ffffff', ' stroke="#e2e8f0" rx="16"')}${t(860, 130, 'Total', { size: 14, w: 700, anchor: 'middle' })}
    ${t(860, 178, '৳2,480', { size: 28, fill: product.theme.primary, w: 800, anchor: 'middle' })}
    ${rect(768, 220, 184, 48, product.theme.primary)}${t(860, 250, 'Cash', { size: 14, fill: '#fff', w: 700, anchor: 'middle' })}
    ${rect(768, 284, 184, 48, '#f8fafc', ' stroke="#e2e8f0"')}${t(860, 314, 'Card / bKash', { size: 14, fill: '#334155', w: 600, anchor: 'middle' })}
    ${rect(768, 520, 184, 48, product.theme.accent)}${t(860, 550, 'Complete Sale', { size: 14, w: 700, anchor: 'middle' })}`;
}

function crmPipelineBlock(product: SeedSoftwareProduct) {
  return ['New', 'Contacted', 'Proposal', 'Won'].map((stage, i) => {
    const x = 244 + i * 190;
    return `${rect(x, 88, 176, 512, '#ffffff', ' stroke="#e2e8f0" rx="14"')}${t(x + 16, 118, stage, { size: 13, w: 700 })}
      ${[0, 1, 2].map((c) => { const y = 140 + c * 100; const term = product.terminology[c % product.terminology.length]; return `${rect(x + 12, y, 152, 84, '#f8fafc', ' stroke="#e2e8f0" rx="10"')}${t(x + 24, y + 28, term, { size: 12, w: 600 })}${t(x + 24, y + 52, `৳${(80 + i * 20 + c * 15).toLocaleString()}K`, { size: 11, fill: '#64748b' })}`; }).join('')}`;
  }).join('');
}

function mobileScreenSvg(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const tabs = product.screens.slice(0, 4);
  const primary = product.theme.primary;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="860" viewBox="0 0 420 860">
  <rect width="420" height="860" fill="#0f172a"/>${rect(16, 16, 388, 828, '#f8fafc', ' rx="28"')}
  ${rect(16, 16, 388, 72, primary, ' rx="28"')}<rect x="16" y="56" width="388" height="32" fill="${primary}"/>
  ${t(210, 58, screen.name, { size: 16, fill: '#fff', w: 700, anchor: 'middle' })}
  ${t(36, 120, `${product.softwareType} · ${product.terminology[0] || product.industry}`, { size: 12, fill: '#64748b' })}
  ${product.dashboardKPIs.slice(0, 2).map((k, i) => { const x = 36 + i * 178; return `${rect(x, 140, 168, 72, '#ffffff', ' stroke="#e2e8f0" rx="14"')}${t(x + 14, 168, k, { size: 11, fill: '#64748b' })}${t(x + 14, 196, kpiVal(i), { size: 20, w: 700 })}`; }).join('')}
  ${[0, 1, 2, 3].map((i) => { const y = 232 + i * 100; const label = product.modules[i % product.modules.length] || product.terminology[i % product.terminology.length]; const term = product.terminology[i % product.terminology.length]; return `${rect(36, y, 348, 84, '#ffffff', ' stroke="#e2e8f0" rx="14"')}<circle cx="68" cy="${y + 42}" r="16" fill="${primary}" opacity="0.2"/>${t(100, y + 36, label, { size: 14, w: 600 })}${t(100, y + 58, `${term} · ${screen.name}`, { size: 12, fill: '#64748b' })}`; }).join('')}
  ${rect(16, 760, 388, 84, '#ffffff', ' stroke="#e2e8f0" rx="0"')}
  ${tabs.map((tb, i) => { const x = 40 + i * 90; const on = tb.key === screen.key || (i === 0 && !tabs.some((x) => x.key === screen.key)); return `${t(x + 30, 810, tb.name.slice(0, 8), { size: 11, fill: on ? primary : '#94a3b8', w: on ? 700 : 400, anchor: 'middle' })}<circle cx="${x + 30}" cy="785" r="5" fill="${on ? primary : '#cbd5e1'}"/>`; }).join('')}
</svg>`;
}

function screenContent(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const key = screen.key.toLowerCase();
  if (key.includes('pos-billing') || (product.softwareType === 'POS' && key.includes('billing'))) return posBillingBlock(product);
  if (key === 'pipeline' || (product.softwareType === 'CRM' && key.includes('pipeline'))) return crmPipelineBlock(product);
  if (screen.category === 'dashboard') return dashboardBlock(product);
  if (screen.category === 'reports') return reportsBlock(product, screen);
  if (screen.category === 'form' || screen.category === 'settings' || screen.category === 'users') return formBlock(product, screen);
  return listBlock(product, screen);
}

function screenSvg(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  if (product.platformType === 'mobile' || product.softwareType === 'Mobile App') return mobileScreenSvg(product, screen);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="640" viewBox="0 0 1024 640">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f1f5f9"/><stop offset="100%" stop-color="#e2e8f0"/></linearGradient></defs>
  <rect width="1024" height="640" fill="url(#bg)"/>${chrome(product, screen)}${screenContent(product, screen)}
</svg>`;
}

function coverSvg(product: SeedSoftwareProduct) {
  const { primary, accent } = product.theme;
  const kpis = product.dashboardKPIs.slice(0, 3);
  const dir = coverDirection(product);
  const phoneX = dir.includes('phone') || dir.includes('pos') ? 960 : 940;
  const actions = deriveQuickActions(product);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <defs><linearGradient id="desk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${primary}" stop-opacity="0.14"/><stop offset="100%" stop-color="${accent}" stop-opacity="0.1"/></linearGradient>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.28"/></filter></defs>
  <rect width="1280" height="800" fill="url(#desk)"/>
  ${rect(80, 90, 820, 520, '#0f172a', ' rx="18" filter="url(#shadow)"')}${rect(96, 106, 788, 464, '#f8fafc', ' rx="10"')}
  ${rect(96, 106, 180, 464, sideFill(product.theme), ' rx="0"')}${t(116, 140, product.title, { size: 14, fill: sideText(product.theme), w: 800 })}
  ${product.screens.slice(0, 6).map((s, i) => t(116, 180 + i * 34, s.name, { size: 12, fill: sideMuted(product.theme) })).join('')}
  ${rect(296, 126, 560, 40, '#ffffff', ' stroke="#e2e8f0" rx="8"')}${t(312, 152, `${product.softwareType} · ${dir.replace(/-/g, ' ')}`, { size: 14, w: 700 })}
  ${kpis.map((k, i) => { const x = 296 + i * 188; return `${rect(x, 184, 176, 84, '#ffffff', ' stroke="#e2e8f0"')}${t(x + 14, 210, k, { size: 11, fill: '#64748b' })}${t(x + 14, 242, kpiVal(i), { size: 22, fill: primary, w: 800 })}`; }).join('')}
  ${rect(296, 288, 560, 250, '#ffffff', ' stroke="#e2e8f0"')}${t(316, 320, product.terminology[0] || 'Records', { size: 13, w: 700 })}
  ${[0, 1, 2, 3, 4].map((r) => `${rect(316, 344 + r * 34, 520, 24, r % 2 ? '#f8fafc' : '#ffffff', ' stroke="#f1f5f9" rx="6"')}${t(328, 361 + r * 34, `${product.terminology[r % product.terminology.length]} · ${actions[r % 4]}`, { size: 11, fill: '#334155' })}`).join('')}
  ${rect(phoneX, 180, 220, 440, '#0f172a', ' rx="28" filter="url(#shadow)"')}${rect(phoneX + 12, 198, 196, 404, '#f8fafc', ' rx="20"')}
  ${rect(phoneX + 12, 198, 196, 56, primary, ' rx="0"')}${t(phoneX + 110, 232, product.title.split(' ')[0], { size: 13, fill: '#fff', w: 700, anchor: 'middle' })}
  ${product.modules.slice(0, 5).map((m, i) => { const y = 278 + i * 52; return `${rect(phoneX + 30, y, 160, 40, '#ffffff', ' stroke="#e2e8f0" rx="10"')}${t(phoneX + 110, y + 25, m, { size: 11, fill: '#334155', anchor: 'middle' })}`; }).join('')}
  ${t(640, 760, product.title, { size: 18, w: 700, anchor: 'middle' })}
  ${t(640, 786, product.shortDescription.slice(0, 90), { size: 13, fill: '#64748b', anchor: 'middle' })}
</svg>`;
}

async function svgToAvif(svg: string, outPath: string, width: number, quality: number) {
  const buf = await sharp(Buffer.from(svg)).resize({ width, withoutEnlargement: true }).avif({ quality, effort: 4 }).toBuffer();
  await writeFile(outPath, buf);
  return buf.length;
}

async function encodePngToAvif(inputPath: string, outPath: string, width: number, startQuality: number, maxBytes?: number) {
  let quality = startQuality;
  let buf = await sharp(inputPath).rotate().resize({ width, withoutEnlargement: true }).avif({ quality, effort: 5 }).toBuffer();
  if (maxBytes) {
    while (buf.length > maxBytes && quality > 28) {
      quality -= 4;
      buf = await sharp(inputPath).rotate().resize({ width, withoutEnlargement: true }).avif({ quality, effort: 5 }).toBuffer();
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

  if (await exists(coverPng)) {
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

  if (allowSvgCovers) {
    const svg = coverSvg(product);
    if (needCard) console.log(`  cover-card ${((await svgToAvif(svg, coverCard, CARD_W, 48)) / 1024).toFixed(1)}KB (svg fallback)`);
    if (needDetail) console.log(`  cover-detail ${((await svgToAvif(svg, coverDetail, DETAIL_W, 55)) / 1024).toFixed(1)}KB (svg fallback)`);
    return;
  }

  console.warn(`  skip covers: missing cover.png for ${product.slug} (pass --allow-svg-covers or add cover.png)`);
}

async function writeScreens(product: SeedSoftwareProduct, dir: string) {
  for (const screen of product.screens) {
    const preview = path.join(dir, `${screen.key}.avif`);
    const thumb = path.join(dir, `${screen.key}-thumb.avif`);
    if (!force && (await exists(preview)) && (await exists(thumb))) continue;
    const svg = screenSvg(product, screen);
    const p = await svgToAvif(svg, preview, 960, 45);
    const th = await svgToAvif(svg, thumb, 480, 40);
    console.log(`  ${screen.key} preview ${(p / 1024).toFixed(1)}KB thumb ${(th / 1024).toFixed(1)}KB`);
  }
}

async function generateProduct(product: SeedSoftwareProduct) {
  const dir = path.join(ROOT, product.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'design-manifest.json'), JSON.stringify(buildManifest(product), null, 2));
  console.log('  wrote design-manifest.json (DNA v2)');
  if (!screensOnly) await writeCovers(product, dir);
  else console.log('  covers skipped (--screens-only)');
  if (!coversOnly) await writeScreens(product, dir);
  else console.log('  screens skipped (--covers-only)');
}

async function main() {
  await mkdir(ROOT, { recursive: true });
  const list = slugArg ? SOFTWARE_SEED_PRODUCTS.filter((p) => p.slug === slugArg) : SOFTWARE_SEED_PRODUCTS;
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
