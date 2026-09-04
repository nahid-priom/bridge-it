/**
 * Premium Software showcase asset generator (v3).
 * Covers and screens share one design system — no cover.png / SVG mismatch.
 *
 * Output:
 *   seed-assets/software/{slug}/
 *     design-manifest.json
 *     cover/card.avif, cover/detail.avif
 *     screens/{key}/thumb.avif, preview.avif [, mobile.avif]
 *
 * Usage:
 *   npx tsx scripts/generate-software-showcases.ts [--slug=…] [--force]
 *     [--screens-only] [--covers-only] [--manifests-only]
 */
import { mkdir, writeFile, access, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';
import type { SeedSoftwareProduct, SoftwareScreenSeed } from '../src/features/software-showcase/types';

const ROOT = path.join(process.cwd(), 'seed-assets/software');
const ASSET_VERSION = 3;
const force = process.argv.includes('--force');
const screensOnly = process.argv.includes('--screens-only');
const coversOnly = process.argv.includes('--covers-only');
const manifestsOnly = process.argv.includes('--manifests-only');
const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.slice(7);

const W = 1440;
const H = 900;
const CARD_W = 800;
const DETAIL_W = 1200;
const PREVIEW_W = 960;
const THUMB_W = 480;
const FONT = 'ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif';

type VisualFamily =
  | 'operations-erp'
  | 'retail-pos'
  | 'manufacturing'
  | 'healthcare'
  | 'education'
  | 'logistics'
  | 'crm-sales'
  | 'finance'
  | 'agro'
  | 'saas-admin';

const BD_COMPANIES = [
  'Bengal Agro Ltd',
  'Padma Traders',
  'Meghna Distributors',
  'Sundarban Feeds',
  'Dhaka Apparel Co',
  'Chittagong Steel',
  'Sylhet Tea House',
  'Khulna Logistics',
  'Rajshahi Mills',
  'Gazipur Textiles',
  'Narayanganj Plastics',
  'Cumilla Dairy',
];
const BD_PEOPLE = [
  'Karim Hossain',
  'Nasrin Akter',
  'Rafiqul Islam',
  'Sumaiya Rahman',
  'Imran Chowdhury',
  'Farhana Begum',
  'Tanvir Ahmed',
  'Laila Sultana',
  'Mahbub Alam',
  'Sadia Khan',
  'Jahid Hasan',
  'Nusrat Jahan',
];
const BD_CITIES = ['Dhaka', 'Chattogram', 'Gazipur', 'Narayanganj', 'Khulna', 'Rajshahi', 'Sylhet', 'Cumilla'];

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
function pick<T>(arr: T[], i: number): T {
  return arr[((i % arr.length) + arr.length) % arr.length];
}
function money(n: number) {
  return `৳${Math.round(n).toLocaleString('en-BD')}`;
}
function pct(n: number) {
  return `${n.toFixed(1)}%`;
}

function visualFamily(p: SeedSoftwareProduct): VisualFamily {
  const t = p.softwareType.toLowerCase();
  const g = p.solutionGroup;
  if (t === 'pos' || g === 'pos-retail') return 'retail-pos';
  if (t === 'crm' || g === 'crm-sales') return 'crm-sales';
  if (t === 'healthcare' || g === 'healthcare-software') return 'healthcare';
  if (t === 'education' || g === 'education-software') return 'education';
  if (t === 'logistics' || g === 'logistics-courier') return 'logistics';
  if (t === 'agro' || g === 'agro-farm-management') return 'agro';
  if (t === 'saas' || g === 'saas-platforms') return 'saas-admin';
  if (t === 'manufacturing' || g === 'manufacturing-production') return 'manufacturing';
  if (t === 'hrm' || /account|finance|payroll/i.test(t)) return 'finance';
  return 'operations-erp';
}

function sideFill(t: SeedSoftwareProduct['theme']) {
  return t.sidebar === 'dark' ? '#0b1220' : t.sidebar === 'brand' ? t.primary : '#f8fafc';
}
function sideText(t: SeedSoftwareProduct['theme']) {
  return t.sidebar === 'light' ? '#0f172a' : '#f8fafc';
}
function sideMuted(t: SeedSoftwareProduct['theme']) {
  return t.sidebar === 'light' ? '#64748b' : '#94a3b8';
}

function deriveQuickActions(p: SeedSoftwareProduct): string[] {
  const family = visualFamily(p);
  const term = (n: number) => p.terminology[n % Math.max(p.terminology.length, 1)] || 'Record';
  switch (family) {
    case 'retail-pos':
      return ['New Sale', 'Open Shift', `Add ${term(0)}`, 'Cash Close'];
    case 'crm-sales':
      return ['New Lead', 'Log Call', 'Create Quote', 'Schedule Visit'];
    case 'manufacturing':
      return ['Production Batch', `New ${term(0)}`, 'Issue Materials', 'QC Release'];
    case 'healthcare':
      return ['New Appointment', 'Admit Patient', 'Lab Order', 'Discharge'];
    case 'logistics':
      return ['Book Trip', 'Assign Vehicle', 'Fuel Entry', 'Confirm Delivery'];
    case 'agro':
      return [`New ${term(0)}`, 'Record Collection', 'Feed Issue', 'Sale Entry'];
    case 'education':
      return ['New Admission', 'Collect Fee', 'Mark Attendance', 'Publish Result'];
    case 'saas-admin':
      return ['New Tenant', 'Invite User', 'Create Plan', 'View Usage'];
    case 'finance':
      return ['New Voucher', 'Run Payroll', 'Post Payment', 'Bank Reconcile'];
    default:
      return [`New ${term(0)}`, `Create ${p.modules[0] || term(1)}`, 'Receive Payment', 'Export Report'];
  }
}

function kpiValues(p: SeedSoftwareProduct, i: number): string {
  const h = hashSlug(p.slug);
  const base = [
    money(42000 + ((h >> (i * 3)) % 90000)),
    pct(72 + ((h >> (i + 2)) % 25) + i * 0.3),
    money(180000 + ((h >> i) % 400000)),
    String(12 + ((h + i * 7) % 48)),
    money(9500 + ((h >> (i + 1)) % 40000)),
    String(3 + ((h + i) % 14)),
  ];
  return base[i % base.length];
}

function statusBadge(r: number): readonly [string, string] {
  const statuses: Array<[string, string]> = [
    ['Active', '#059669'],
    ['Pending', '#d97706'],
    ['In Progress', '#2563eb'],
    ['Completed', '#0f766e'],
    ['On Hold', '#64748b'],
    ['Overdue', '#dc2626'],
  ];
  return statuses[r % statuses.length];
}

function demoRows(p: SeedSoftwareProduct, count = 8) {
  const h = hashSlug(p.slug);
  return Array.from({ length: count }, (_, r) => {
    const company = pick(BD_COMPANIES, h + r * 3);
    const person = pick(BD_PEOPLE, h + r * 5);
    const city = pick(BD_CITIES, h + r * 2);
    const term = pick(p.terminology, r + h);
    const code = `${term.slice(0, 3).toUpperCase().replace(/\s/g, '')}-${1000 + ((h + r * 11) % 8000)}`;
    const amount = 8500 + ((h + r * 97) % 185000);
    const qty = 2 + ((h + r * 13) % 120);
    const [status, color] = statusBadge(r + (h % 3));
    return { company, person, city, term, code, amount, qty, status, color, date: `2026-09-${String(1 + (r % 28)).padStart(2, '0')}` };
  });
}

function t(
  x: number,
  y: number,
  s: string,
  opts: { size?: number; fill?: string; weight?: number; anchor?: string } = {}
) {
  const { size = 13, fill = '#0f172a', weight = 500, anchor } = opts;
  return `<text x="${x}" y="${y}"${anchor ? ` text-anchor="${anchor}"` : ''} font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(s)}</text>`;
}
function rect(x: number, y: number, w: number, h: number, fill: string, extra = '') {
  const rx = /\brx=/.test(extra) ? '' : ' rx="10"';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}"${rx} fill="${fill}"${extra}/>`;
}

function appChrome(product: SeedSoftwareProduct, screen: SoftwareScreenSeed, family: VisualFamily) {
  const side = sideFill(product.theme);
  const compact = product.theme.density === 'compact' || family === 'retail-pos';
  const navStep = compact ? 30 : 34;
  const nav = product.screens.slice(0, 10).map((s, i) => {
    const y = 96 + i * navStep;
    const on = s.key === screen.key;
    return `${on ? rect(10, y, 208, 28, product.theme.accent, ' opacity="0.22" rx="8"') : ''}
      <circle cx="28" cy="${y + 14}" r="3.5" fill="${on ? product.theme.accent : sideMuted(product.theme)}"/>
      ${t(42, y + 19, s.name, { size: 12, fill: on ? sideText(product.theme) : sideMuted(product.theme), weight: on ? 600 : 500 })}`;
  }).join('');

  const brandShort = product.title.split(' ').slice(0, 2).join(' ');
  return `
  ${rect(0, 0, 232, H, side, ' rx="0"')}
  ${t(20, 36, brandShort, { size: 15, fill: sideText(product.theme), weight: 700 })}
  ${t(20, 56, `${product.softwareType} · ${product.industry.split('/')[0].trim()}`, { size: 10, fill: sideMuted(product.theme) })}
  ${nav}
  ${rect(16, H - 56, 200, 36, product.theme.sidebar === 'light' ? '#e2e8f0' : 'rgba(255,255,255,0.08)', ' rx="8"')}
  ${t(36, H - 33, pick(BD_PEOPLE, hashSlug(product.slug)), { size: 11, fill: sideText(product.theme) })}
  ${rect(232, 0, W - 232, 56, '#ffffff', ' stroke="#e2e8f0" rx="0"')}
  ${t(256, 34, screen.name, { size: 18, weight: 700 })}
  ${rect(W - 320, 12, 200, 32, '#f8fafc', ' stroke="#e2e8f0" rx="8"')}
  ${t(W - 304, 33, `Search ${product.terminology[0] || 'records'}…`, { size: 12, fill: '#94a3b8' })}
  <circle cx="${W - 64}" cy="28" r="12" fill="${product.theme.primary}" opacity="0.85"/>
  ${t(W - 64, 32, 'PH', { size: 9, fill: '#fff', anchor: 'middle', weight: 700 })}`;
}

function kpiRow(product: SeedSoftwareProduct, y = 76) {
  const kpis = product.dashboardKPIs.slice(0, 4);
  const gap = 12;
  const cardW = (W - 232 - 48 - gap * 3) / 4;
  return kpis
    .map((kpi, i) => {
      const x = 248 + i * (cardW + gap);
      const delta = i % 2 === 0 ? `+${2 + i}.4%` : `-${1 + i}.1%`;
      const deltaColor = i % 2 === 0 ? '#059669' : '#dc2626';
      return `${rect(x, y, cardW, 88, '#ffffff', ' stroke="#e2e8f0" rx="12"')}
        ${t(x + 16, y + 28, kpi, { size: 11, fill: '#64748b' })}
        ${t(x + 16, y + 56, kpiValues(product, i), { size: 24, weight: 700 })}
        ${t(x + 16, y + 76, `${delta} vs last month`, { size: 10, fill: deltaColor })}`;
    })
    .join('');
}

function chartCard(product: SeedSoftwareProduct, x: number, y: number, w: number, h: number, title: string, kind: 'bar' | 'line' | 'area' | 'donut') {
  const bars = [42, 68, 54, 86, 62, 94, 70, 78];
  let body = '';
  if (kind === 'donut') {
    const cx = x + w / 2;
    const cy = y + h / 2 + 10;
    body = `<circle cx="${cx}" cy="${cy}" r="58" fill="none" stroke="#e2e8f0" stroke-width="16"/>
      <circle cx="${cx}" cy="${cy}" r="58" fill="none" stroke="${product.theme.primary}" stroke-width="16" stroke-dasharray="240 360" transform="rotate(-90 ${cx} ${cy})"/>
      ${t(cx, cy + 4, '68%', { size: 18, weight: 700, anchor: 'middle' })}`;
  } else if (kind === 'line' || kind === 'area') {
    const pts = bars.map((b, i) => `${x + 36 + i * ((w - 72) / 7)},${y + h - 36 - b}`).join(' ');
    body =
      kind === 'area'
        ? `<polygon points="${x + 36},${y + h - 36} ${pts} ${x + w - 36},${y + h - 36}" fill="${product.theme.primary}" opacity="0.12"/><polyline points="${pts}" fill="none" stroke="${product.theme.primary}" stroke-width="3"/>`
        : `<polyline points="${pts}" fill="none" stroke="${product.theme.primary}" stroke-width="3"/>${bars
            .map((b, i) => `<circle cx="${x + 36 + i * ((w - 72) / 7)}" cy="${y + h - 36 - b}" r="3.5" fill="${product.theme.accent}"/>`)
            .join('')}`;
  } else {
    body = bars
      .map(
        (bh, i) =>
          `<rect x="${x + 28 + i * ((w - 48) / 8)}" y="${y + h - 32 - bh}" width="24" height="${bh}" rx="5" fill="${product.theme.primary}" opacity="${0.45 + i * 0.06}"/>`
      )
      .join('');
  }
  return `${rect(x, y, w, h, '#ffffff', ' stroke="#e2e8f0" rx="12"')}${t(x + 18, y + 28, title, { size: 13, weight: 600 })}${body}`;
}

function quickActionsPanel(product: SeedSoftwareProduct, x: number, y: number, w: number, h: number) {
  const actions = deriveQuickActions(product);
  return `${rect(x, y, w, h, '#ffffff', ' stroke="#e2e8f0" rx="12"')}
    ${t(x + 18, y + 28, 'Quick Actions', { size: 13, weight: 600 })}
    ${actions
      .map((a, i) => {
        const ay = y + 48 + i * 44;
        return `${rect(x + 16, ay, w - 32, 36, i === 0 ? product.theme.primary : '#f8fafc', ` stroke="${i === 0 ? product.theme.primary : '#e2e8f0'}" rx="8"`)}
          ${t(x + w / 2, ay + 23, a, { size: 12, fill: i === 0 ? '#fff' : '#334155', anchor: 'middle', weight: 600 })}`;
      })
      .join('')}`;
}

function dashboardContent(product: SeedSoftwareProduct, family: VisualFamily) {
  const chartKind = (['bar', 'line', 'area', 'donut'] as const)[hashSlug(product.slug) % 4];
  const rows = demoRows(product, 5);
  const tableY = 400;
  return `${kpiRow(product, 76)}
    ${chartCard(product, 248, 180, 700, 200, product.dashboardKPIs[0] || 'Trend', chartKind === 'donut' ? 'area' : chartKind)}
    ${quickActionsPanel(product, 964, 180, 244, 200)}
    ${rect(248, tableY, 1160, 460, '#ffffff', ' stroke="#e2e8f0" rx="12"')}
    ${t(268, tableY + 28, family === 'logistics' ? 'Live Operations' : 'Recent Activity', { size: 14, weight: 650 })}
    ${['Code', 'Party', 'Owner', 'Amount', 'Status', 'Date']
      .map((h, i) => t(268 + i * 180, tableY + 56, h.toUpperCase(), { size: 10, fill: '#64748b', weight: 600 }))
      .join('')}
    <line x1="260" y1="${tableY + 68}" x2="1392" y2="${tableY + 68}" stroke="#e2e8f0"/>
    ${rows
      .map((r, i) => {
        const y = tableY + 96 + i * 52;
        return `${i % 2 ? rect(256, y - 22, 1144, 48, '#f8fafc', ' rx="6"') : ''}
          ${t(268, y, r.code, { size: 12, weight: 600 })}
          ${t(448, y, r.company, { size: 12 })}
          ${t(628, y, r.person, { size: 12, fill: '#475569' })}
          ${t(808, y, money(r.amount), { size: 12, weight: 600 })}
          ${rect(968, y - 14, 78, 22, r.color, ' opacity="0.15" rx="11"')}${t(1007, y, r.status, { size: 10, fill: r.color, anchor: 'middle', weight: 600 })}
          ${t(1120, y, r.date, { size: 12, fill: '#64748b' })}`;
      })
      .join('')}`;
}

function listContent(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const headers = [product.terminology[0] || 'Code', 'Name / Party', 'Location', 'Value', 'Qty', 'Status'];
  const rows = demoRows(product, 9);
  const chips = product.terminology.slice(0, 4);
  return `${rect(248, 76, 1160, 56, '#ffffff', ' stroke="#e2e8f0" rx="12"')}
    ${rect(264, 88, 280, 32, '#f8fafc', ' stroke="#e2e8f0" rx="8"')}
    ${t(280, 109, `Filter ${headers[0]}…`, { size: 12, fill: '#94a3b8' })}
    ${chips
      .map((c, i) => {
        const x = 560 + i * 110;
        return `${rect(x, 88, 100, 32, i === 0 ? product.theme.primary : '#f1f5f9', ' rx="16"')}
          ${t(x + 50, 109, c.slice(0, 12), { size: 11, fill: i === 0 ? '#fff' : '#475569', anchor: 'middle', weight: 600 })}`;
      })
      .join('')}
    ${rect(1240, 88, 148, 32, product.theme.accent, ' rx="8"')}
    ${t(1314, 109, `+ New ${screen.name.split(' ')[0]}`, { size: 12, fill: '#0f172a', anchor: 'middle', weight: 700 })}
    ${rect(248, 148, 1160, 712, '#ffffff', ' stroke="#e2e8f0" rx="12"')}
    ${headers.map((h, i) => t(268 + i * 180, 180, h.toUpperCase(), { size: 10, fill: '#64748b', weight: 600 })).join('')}
    <line x1="260" y1="192" x2="1392" y2="192" stroke="#e2e8f0"/>
    ${rows
      .map((r, i) => {
        const y = 224 + i * 56;
        return `${i % 2 ? rect(256, y - 24, 1144, 52, '#f8fafc', ' rx="6"') : ''}
          ${t(268, y, r.code, { size: 12, weight: 600 })}
          ${t(448, y, r.company, { size: 12 })}
          ${t(628, y, r.city, { size: 12, fill: '#475569' })}
          ${t(808, y, money(r.amount), { size: 12, weight: 600 })}
          ${t(988, y, String(r.qty), { size: 12 })}
          ${rect(1100, y - 14, 86, 22, r.color, ' opacity="0.15" rx="11"')}${t(1143, y, r.status, { size: 10, fill: r.color, anchor: 'middle', weight: 600 })}`;
      })
      .join('')}
    ${t(268, 820, `Showing 1–9 of ${48 + (hashSlug(product.slug) % 120)} ${screen.name.toLowerCase()}`, { size: 12, fill: '#64748b' })}
    ${rect(1240, 800, 64, 28, '#f1f5f9', ' rx="8"')}${t(1272, 819, 'Prev', { size: 11, fill: '#334155', anchor: 'middle' })}
    ${rect(1316, 800, 64, 28, product.theme.primary, ' rx="8"')}${t(1348, 819, 'Next', { size: 11, fill: '#fff', anchor: 'middle' })}`;
}

function formContent(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const fields = [
    ...product.terminology.slice(0, 4),
    'Branch',
    'Effective Date',
    'Assigned To',
    'Notes',
  ].slice(0, 8);
  const rows = demoRows(product, 3);
  return `${rect(248, 76, 780, 784, '#ffffff', ' stroke="#e2e8f0" rx="12"')}
    ${t(272, 112, screen.name, { size: 18, weight: 700 })}
    ${t(272, 136, `${product.businessType} · ${rows[0].code}`, { size: 12, fill: '#64748b' })}
    ${fields
      .map((f, i) => {
        const x = 272 + (i % 2) * 360;
        const y = 168 + Math.floor(i / 2) * 96;
        const sample =
          i === 0
            ? rows[0].code
            : i === 1
              ? rows[0].company
              : i === 2
                ? rows[0].person
                : i === 3
                  ? rows[0].date
                  : pick(BD_CITIES, i);
        return `${t(x, y, f, { size: 11, fill: '#64748b', weight: 600 })}
          ${rect(x, y + 10, 330, 40, '#f8fafc', ' stroke="#e2e8f0" rx="8"')}
          ${t(x + 14, y + 36, sample, { size: 13 })}`;
      })
      .join('')}
    ${rect(272, 780, 148, 40, product.theme.primary, ' rx="10"')}
    ${t(346, 805, 'Save Draft', { size: 13, fill: '#fff', anchor: 'middle', weight: 600 })}
    ${rect(436, 780, 148, 40, product.theme.accent, ' rx="10"')}
    ${t(510, 805, 'Submit', { size: 13, fill: '#0f172a', anchor: 'middle', weight: 700 })}
    ${rect(1052, 76, 356, 784, '#ffffff', ' stroke="#e2e8f0" rx="12"')}
    ${t(1072, 112, 'Summary', { size: 14, weight: 650 })}
    ${product.dashboardKPIs.slice(0, 4)
      .map((k, i) => `${t(1072, 160 + i * 72, k, { size: 11, fill: '#64748b' })}${t(1072, 184 + i * 72, kpiValues(product, i), { size: 20, weight: 700 })}`)
      .join('')}
    ${t(1072, 480, 'Audit trail', { size: 12, weight: 600 })}
    ${rows
      .map(
        (r, i) =>
          `${t(1072, 520 + i * 48, `${r.date} · ${r.person}`, { size: 11, fill: '#475569' })}${t(1072, 538 + i * 48, r.status, { size: 11, fill: r.color })}`
      )
      .join('')}`;
}

function transactionContent(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const rows = demoRows(product, 7);
  return `${rect(248, 76, 1160, 72, '#ffffff', ' stroke="#e2e8f0" rx="12"')}
    ${t(268, 106, screen.name, { size: 16, weight: 700 })}
    ${t(268, 128, `Document ${rows[0].code} · ${rows[0].company}`, { size: 12, fill: '#64748b' })}
    ${rect(1180, 92, 200, 40, product.theme.primary, ' rx="8"')}
    ${t(1280, 117, 'Post Transaction', { size: 13, fill: '#fff', anchor: 'middle', weight: 700 })}
    ${rect(248, 164, 1160, 696, '#ffffff', ' stroke="#e2e8f0" rx="12"')}
    ${['Line', 'Item', 'Party', 'Qty', 'Rate', 'Amount']
      .map((h, i) => t(268 + i * 180, 196, h.toUpperCase(), { size: 10, fill: '#64748b', weight: 600 }))
      .join('')}
    <line x1="260" y1="208" x2="1392" y2="208" stroke="#e2e8f0"/>
    ${rows
      .map((r, i) => {
        const y = 240 + i * 56;
        const rate = Math.round(r.amount / Math.max(r.qty, 1));
        return `${t(268, y, String(i + 1).padStart(2, '0'), { size: 12, fill: '#64748b' })}
          ${t(448, y, r.term, { size: 12, weight: 600 })}
          ${t(628, y, r.company, { size: 12 })}
          ${t(808, y, String(r.qty), { size: 12 })}
          ${t(988, y, money(rate), { size: 12 })}
          ${t(1168, y, money(r.amount), { size: 12, weight: 700 })}`;
      })
      .join('')}
    ${rect(1000, 720, 380, 100, '#f8fafc', ' stroke="#e2e8f0" rx="10"')}
    ${t(1020, 756, 'Subtotal', { size: 12, fill: '#64748b' })}${t(1340, 756, money(rows.reduce((s, r) => s + r.amount, 0)), { size: 12, anchor: 'end', weight: 600 })}
    ${t(1020, 788, 'Grand Total', { size: 14, weight: 700 })}${t(1340, 788, money(rows.reduce((s, r) => s + r.amount, 0) * 1.05), { size: 16, anchor: 'end', weight: 700, fill: product.theme.primary })}`;
}

function reportsContent(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  return `${rect(248, 76, 1160, 56, '#ffffff', ' stroke="#e2e8f0" rx="12"')}
    ${t(268, 110, 'Date range', { size: 12, fill: '#64748b' })}
    ${rect(360, 90, 120, 28, '#f8fafc', ' stroke="#e2e8f0" rx="8"')}${t(420, 109, '01 Sep', { size: 12, anchor: 'middle' })}
    ${rect(496, 90, 120, 28, '#f8fafc', ' stroke="#e2e8f0" rx="8"')}${t(556, 109, '30 Sep', { size: 12, anchor: 'middle' })}
    ${rect(1180, 88, 88, 32, '#f1f5f9', ' rx="8"')}${t(1224, 109, 'Export', { size: 12, anchor: 'middle' })}
    ${rect(1280, 88, 100, 32, product.theme.primary, ' rx="8"')}${t(1330, 109, 'PDF', { size: 12, fill: '#fff', anchor: 'middle', weight: 700 })}
    ${product.dashboardKPIs.slice(0, 3)
      .map((k, i) => {
        const x = 248 + i * 392;
        return `${rect(x, 152, 376, 88, '#ffffff', ' stroke="#e2e8f0" rx="12"')}
          ${t(x + 18, 184, k, { size: 12, fill: '#64748b' })}
          ${t(x + 18, 216, kpiValues(product, i), { size: 24, weight: 700 })}`;
      })
      .join('')}
    ${chartCard(product, 248, 260, 760, 560, screen.name, 'bar')}
    ${chartCard(product, 1024, 260, 384, 260, 'Mix', 'donut')}
    ${chartCard(product, 1024, 540, 384, 280, 'Weekly', 'line')}`;
}

function posContent(product: SeedSoftwareProduct) {
  const items = demoRows(product, 5);
  return `${rect(248, 76, 720, 784, '#ffffff', ' stroke="#e2e8f0" rx="12"')}
    ${t(272, 112, `POS · ${product.title}`, { size: 16, weight: 700 })}
    ${items
      .map((item, i) => {
        const y = 140 + i * 72;
        return `${rect(268, y, 680, 60, '#f8fafc', ' stroke="#e2e8f0" rx="10"')}
          ${t(288, y + 36, `${item.term} × ${item.qty}`, { size: 14, weight: 600 })}
          ${t(900, y + 36, money(item.amount), { size: 14, weight: 700, anchor: 'end' })}`;
      })
      .join('')}
    ${rect(992, 76, 416, 784, '#ffffff', ' stroke="#e2e8f0" rx="12"')}
    ${t(1200, 130, 'Bill Total', { size: 14, fill: '#64748b', anchor: 'middle' })}
    ${t(1200, 180, money(items.reduce((s, r) => s + r.amount, 0)), { size: 34, weight: 800, anchor: 'middle', fill: product.theme.primary })}
    ${['Cash', 'Card', 'bKash', 'Complete Sale']
      .map((label, i) => {
        const y = 240 + i * 72;
        const fill = i === 3 ? product.theme.accent : i === 0 ? product.theme.primary : '#f8fafc';
        const color = i === 0 || i === 3 ? (i === 0 ? '#fff' : '#0f172a') : '#334155';
        return `${rect(1020, y, 360, 56, fill, ` stroke="${i === 0 || i === 3 ? fill : '#e2e8f0'}" rx="10"`)}
          ${t(1200, y + 35, label, { size: 14, fill: color, anchor: 'middle', weight: 700 })}`;
      })
      .join('')}`;
}

function screenBody(product: SeedSoftwareProduct, screen: SoftwareScreenSeed, family: VisualFamily) {
  const key = screen.key.toLowerCase();
  if (key.includes('pos') || (family === 'retail-pos' && screen.category === 'transaction')) return posContent(product);
  if (screen.category === 'dashboard' || key.includes('dashboard')) return dashboardContent(product, family);
  if (screen.category === 'reports' || key === 'reports') return reportsContent(product, screen);
  if (screen.category === 'form' || screen.category === 'settings' || screen.category === 'users' || key.includes('roles') || key.includes('settings'))
    return formContent(product, screen);
  if (screen.category === 'transaction' || screen.category === 'accounts' || key.includes('invoice') || key.includes('billing') || key.includes('collection'))
    return transactionContent(product, screen);
  return listContent(product, screen);
}

function screenSvg(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const family = visualFamily(product);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eef2f7"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${appChrome(product, screen, family)}
  ${screenBody(product, screen, family)}
</svg>`;
}

function mobileSvg(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const primary = product.theme.primary;
  const rows = demoRows(product, 4);
  const tabs = product.screens.slice(0, 4);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="860" viewBox="0 0 420 860">
  <rect width="420" height="860" fill="#0f172a"/>
  ${rect(12, 12, 396, 836, '#f8fafc', ' rx="28"')}
  ${rect(12, 12, 396, 72, primary, ' rx="28"')}<rect x="12" y="52" width="396" height="32" fill="${primary}"/>
  ${t(210, 54, screen.name, { size: 15, fill: '#fff', anchor: 'middle', weight: 700 })}
  ${product.dashboardKPIs.slice(0, 2)
    .map((k, i) => {
      const x = 32 + i * 184;
      return `${rect(x, 108, 172, 78, '#ffffff', ' stroke="#e2e8f0" rx="14"')}
        ${t(x + 14, 136, k, { size: 10, fill: '#64748b' })}
        ${t(x + 14, 166, kpiValues(product, i), { size: 18, weight: 700 })}`;
    })
    .join('')}
  ${rows
    .map((r, i) => {
      const y = 210 + i * 110;
      return `${rect(32, y, 356, 96, '#ffffff', ' stroke="#e2e8f0" rx="14"')}
        ${t(52, y + 34, r.company, { size: 13, weight: 650 })}
        ${t(52, y + 58, `${r.code} · ${r.city}`, { size: 11, fill: '#64748b' })}
        ${t(52, y + 80, money(r.amount), { size: 12, weight: 700, fill: primary })}`;
    })
    .join('')}
  ${rect(12, 760, 396, 88, '#ffffff', ' stroke="#e2e8f0" rx="0"')}
  ${tabs
    .map((tb, i) => {
      const x = 40 + i * 90;
      const on = tb.key === screen.key || i === 0;
      return `<circle cx="${x + 30}" cy="790" r="5" fill="${on ? primary : '#cbd5e1'}"/>
        ${t(x + 30, 818, tb.name.slice(0, 8), { size: 10, fill: on ? primary : '#94a3b8', anchor: 'middle', weight: on ? 700 : 500 })}`;
    })
    .join('')}
</svg>`;
}

function coverSvg(product: SeedSoftwareProduct) {
  const family = visualFamily(product);
  const dashScreen = product.screens[0];
  const second = product.screens[1] || product.screens[0];
  const { primary, accent } = product.theme;
  // Compose cover from the same chrome / data as live screens (no separate cover.png design system)
  const kpis = product.dashboardKPIs.slice(0, 3);
  const actions = deriveQuickActions(product);
  const rows = demoRows(product, 5);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="desk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.16"/>
      <stop offset="55%" stop-color="#0f172a" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.14"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="#0f172a" flood-opacity="0.32"/>
    </filter>
    <clipPath id="screenClip"><rect x="96" y="96" width="980" height="620" rx="12"/></clipPath>
  </defs>
  <rect width="1600" height="1000" fill="url(#desk)"/>
  ${t(80, 56, product.title, { size: 28, weight: 800 })}
  ${t(80, 84, `${product.softwareType} for ${product.industry} · ${family.replace(/-/g, ' ')}`, { size: 14, fill: '#475569' })}

  <!-- Main desktop frame -->
  ${rect(80, 110, 1012, 656, '#0f172a', ' rx="18" filter="url(#shadow)"')}
  ${rect(96, 126, 980, 624, '#eef2f7', ' rx="10"')}
  ${rect(96, 126, 200, 624, sideFill(product.theme), ' rx="0"')}
  ${t(112, 158, product.title.split(' ').slice(0, 2).join(' '), { size: 13, fill: sideText(product.theme), weight: 700 })}
  ${product.screens.slice(0, 8).map((s, i) => t(112, 198 + i * 32, s.name, { size: 11, fill: i === 0 ? product.theme.accent : sideMuted(product.theme), weight: i === 0 ? 700 : 500 })).join('')}
  ${rect(296, 126, 780, 48, '#ffffff', ' stroke="#e2e8f0" rx="0"')}
  ${t(316, 156, dashScreen.name, { size: 15, weight: 700 })}
  ${kpis
    .map((k, i) => {
      const x = 312 + i * 248;
      return `${rect(x, 192, 232, 86, '#ffffff', ' stroke="#e2e8f0" rx="10"')}
        ${t(x + 14, 220, k, { size: 11, fill: '#64748b' })}
        ${t(x + 14, 252, kpiValues(product, i), { size: 22, weight: 700, fill: primary })}`;
    })
    .join('')}
  ${rect(312, 296, 520, 420, '#ffffff', ' stroke="#e2e8f0" rx="10"')}
  ${t(332, 328, 'Operations board', { size: 13, weight: 650 })}
  ${rows
    .map((r, i) => `${rect(328, 352 + i * 56, 488, 44, i % 2 ? '#f8fafc' : '#ffffff', ' stroke="#f1f5f9" rx="6"')}
      ${t(344, 380 + i * 56, `${r.code} · ${r.company}`, { size: 12 })}`)
    .join('')}
  ${rect(848, 296, 212, 420, '#ffffff', ' stroke="#e2e8f0" rx="10"')}
  ${t(868, 328, 'Quick Actions', { size: 12, weight: 650 })}
  ${actions
    .map((a, i) => `${rect(864, 352 + i * 56, 180, 40, i === 0 ? primary : '#f8fafc', ` stroke="${i === 0 ? primary : '#e2e8f0'}" rx="8"`)}
      ${t(954, 377 + i * 56, a, { size: 11, fill: i === 0 ? '#fff' : '#334155', anchor: 'middle', weight: 600 })}`)
    .join('')}

  <!-- Secondary module window -->
  ${rect(1120, 160, 400, 280, '#0f172a', ' rx="14" filter="url(#shadow)"')}
  ${rect(1132, 172, 376, 256, '#ffffff', ' rx="8"')}
  ${rect(1132, 172, 376, 40, primary, ' rx="0"')}
  ${t(1320, 198, second.name, { size: 13, fill: '#fff', anchor: 'middle', weight: 700 })}
  ${demoRows(product, 4)
    .map((r, i) => `${t(1152, 240 + i * 44, `${r.code}`, { size: 11, weight: 600 })}${t(1488, 240 + i * 44, money(r.amount), { size: 11, anchor: 'end' })}`)
    .join('')}

  <!-- Mobile companion -->
  ${rect(1240, 470, 240, 460, '#0f172a', ' rx="28" filter="url(#shadow)"')}
  ${rect(1252, 490, 216, 420, '#f8fafc', ' rx="20"')}
  ${rect(1252, 490, 216, 52, primary, ' rx="0"')}
  ${t(1360, 522, product.title.split(' ')[0], { size: 13, fill: '#fff', anchor: 'middle', weight: 700 })}
  ${product.modules.slice(0, 5)
    .map((m, i) => `${rect(1272, 566 + i * 56, 176, 44, '#ffffff', ' stroke="#e2e8f0" rx="10"')}
      ${t(1360, 594 + i * 56, m, { size: 11, anchor: 'middle' })}`)
    .join('')}

  ${t(800, 940, product.shortDescription.slice(0, 110), { size: 14, fill: '#475569', anchor: 'middle' })}
</svg>`;
}

function buildManifest(product: SeedSoftwareProduct) {
  const family = visualFamily(product);
  return {
    premiumUpgradeVersion: ASSET_VERSION,
    productName: product.title,
    productType: `${product.softwareType} Software`,
    industry: product.industry,
    targetUsers: product.primaryUser.split('/').map((s) => s.trim()),
    designSystem: {
      style: 'premium enterprise',
      density: product.theme.density,
      navigation: product.platformType === 'mobile' ? 'bottom-tabs' : 'sidebar',
      cardStyle: 'clean',
      tableStyle: 'enterprise',
      mobileStyle: product.platformType === 'mobile' ? 'native-like' : 'responsive-drawer',
      visualFamily: family,
      theme: product.theme,
    },
    primaryModules: product.modules,
    dashboardKPIs: product.dashboardKPIs,
    quickActions: deriveQuickActions(product),
    screens: product.screens.map((s, i) => ({
      key: s.key,
      name: s.name,
      category: s.category,
      sortOrder: i,
      moduleName: s.name,
    })),
    assetVersion: ASSET_VERSION,
    canonicalLocalRoot: `seed-assets/software/${product.slug}`,
    storagePrefix: `software-showcase/${product.slug}/v${ASSET_VERSION}`,
  };
}

async function svgToAvif(svg: string, outPath: string, width: number, quality: number, maxBytes?: number) {
  let q = quality;
  let buf = await sharp(Buffer.from(svg)).resize({ width, withoutEnlargement: true }).avif({ quality: q, effort: 5 }).toBuffer();
  if (maxBytes) {
    while (buf.length > maxBytes && q > 28) {
      q -= 4;
      buf = await sharp(Buffer.from(svg)).resize({ width, withoutEnlargement: true }).avif({ quality: q, effort: 5 }).toBuffer();
    }
  }
  await writeFile(outPath, buf);
  return buf.length;
}

function wantsMobile(product: SeedSoftwareProduct) {
  return (
    product.platformType === 'mobile' ||
    product.platformType === 'web-mobile' ||
    /sales-force|dealer|delivery|pos|field/i.test(product.slug)
  );
}

async function generateProduct(product: SeedSoftwareProduct) {
  const dir = path.join(ROOT, product.slug);
  const coverDir = path.join(dir, 'cover');
  const screensDir = path.join(dir, 'screens');
  await mkdir(coverDir, { recursive: true });
  await mkdir(screensDir, { recursive: true });

  await writeFile(path.join(dir, 'design-manifest.json'), JSON.stringify(buildManifest(product), null, 2));
  console.log('  wrote design-manifest.json');

  if (manifestsOnly) return;

  if (!screensOnly) {
    const cardPath = path.join(coverDir, 'card.avif');
    const detailPath = path.join(coverDir, 'detail.avif');
    if (force || !(await exists(cardPath)) || !(await exists(detailPath))) {
      const svg = coverSvg(product);
      const card = await svgToAvif(svg, cardPath, CARD_W, 52, 50 * 1024);
      const detail = await svgToAvif(svg, detailPath, DETAIL_W, 60);
      console.log(`  cover card ${(card / 1024).toFixed(1)}KB detail ${(detail / 1024).toFixed(1)}KB`);
    } else console.log('  covers up-to-date');
  }

  if (coversOnly) return;

  for (const screen of product.screens) {
    const sdir = path.join(screensDir, screen.key);
    await mkdir(sdir, { recursive: true });
    const preview = path.join(sdir, 'preview.avif');
    const thumb = path.join(sdir, 'thumb.avif');
    const mobile = path.join(sdir, 'mobile.avif');
    if (!force && (await exists(preview)) && (await exists(thumb))) continue;
    const svg = screenSvg(product, screen);
    const p = await svgToAvif(svg, preview, PREVIEW_W, 55);
    const th = await svgToAvif(svg, thumb, THUMB_W, 42, 30 * 1024);
    let mobileNote = '';
    if (wantsMobile(product) && (screen.category === 'dashboard' || screen.category === 'transaction' || screen.category === 'list')) {
      const m = await svgToAvif(mobileSvg(product, screen), mobile, 420, 50);
      mobileNote = ` mobile ${(m / 1024).toFixed(1)}KB`;
    }
    console.log(`  ${screen.key} preview ${(p / 1024).toFixed(1)}KB thumb ${(th / 1024).toFixed(1)}KB${mobileNote}`);
  }
}

async function main() {
  await mkdir(ROOT, { recursive: true });
  const list = slugArg ? SOFTWARE_SEED_PRODUCTS.filter((p) => p.slug === slugArg) : SOFTWARE_SEED_PRODUCTS;
  if (!list.length) {
    console.error(slugArg ? `No product matched --slug=${slugArg}` : 'No products');
    process.exit(1);
  }
  const mode = screensOnly ? 'screens-only' : coversOnly ? 'covers-only' : 'manifest+covers+screens';
  console.log(`Generating v${ASSET_VERSION} assets for ${list.length} products → ${ROOT}`);
  if (force) console.log('Force: regenerating');
  if (coversOnly) console.log('Covers-only: will NOT delete existing screens');
  if (screensOnly) console.log('Screens-only: will NOT delete existing covers');

  for (const product of list) {
    console.log(`\n${product.slug}`);
    if (force) {
      const dir = path.join(ROOT, product.slug);
      // Never wipe the whole product tree for partial modes — that caused upload SKIP storms.
      if (!coversOnly && !screensOnly && !manifestsOnly && (await exists(dir))) {
        await rm(dir, { recursive: true, force: true });
      } else if (coversOnly && (await exists(path.join(dir, 'cover')))) {
        await rm(path.join(dir, 'cover'), { recursive: true, force: true });
      } else if (screensOnly && (await exists(path.join(dir, 'screens')))) {
        await rm(path.join(dir, 'screens'), { recursive: true, force: true });
      }
    }
    await generateProduct(product);
  }
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
