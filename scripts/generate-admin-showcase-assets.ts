/**
 * Generate design manifests + AVIF assets for admin software showcase.
 * Usage: npx tsx scripts/generate-admin-showcase-assets.ts [--slug=garments-erp] [--force]
 */
import { mkdir, writeFile, access, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { SOFTWARE_SEED_PRODUCTS } from '../src/features/software-showcase/seed/catalog';
import type { SeedSoftwareProduct, SoftwareScreenSeed } from '../src/features/software-showcase/types';

const ROOT = path.join(process.cwd(), 'seed-assets/admin-systems');
const force = process.argv.includes('--force');
const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.slice(7);

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sidebarFill(theme: SeedSoftwareProduct['theme']) {
  if (theme.sidebar === 'dark') return '#0f172a';
  if (theme.sidebar === 'brand') return theme.primary;
  return '#f8fafc';
}

function sidebarText(theme: SeedSoftwareProduct['theme']) {
  return theme.sidebar === 'light' ? '#0f172a' : '#f8fafc';
}

function mutedSidebar(theme: SeedSoftwareProduct['theme']) {
  return theme.sidebar === 'light' ? '#64748b' : '#94a3b8';
}

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function buildManifest(product: SeedSoftwareProduct) {
  return {
    brandName: product.title,
    businessType: product.businessType,
    primaryUser: product.primaryUser,
    solutionGroup: product.solutionGroup,
    softwareType: product.softwareType,
    platformType: product.platformType,
    modules: product.modules,
    dashboardKPIs: product.dashboardKPIs,
    quickActions: product.modules.slice(0, 4).map((m) => `New ${m}`),
    navigation: product.screens.map((s) => s.name),
    tableTypes: product.terminology.slice(0, 4),
    chartTypes: ['bar', 'line', 'donut'],
    workflow: product.modules.slice(0, 5),
    terminology: product.terminology,
    visualStyle:
      product.platformType === 'mobile'
        ? 'mobile-first'
        : product.softwareType === 'POS'
          ? 'retail-pos'
          : product.softwareType === 'SaaS'
            ? 'multi-tenant-saas'
            : 'enterprise-saas',
    theme: product.theme,
    mobileBehavior: product.platformType === 'mobile' ? 'native-mobile' : 'responsive-drawer',
    industry: product.industry,
    screens: product.screens,
  };
}

function navItems(product: SeedSoftwareProduct, activeKey: string) {
  return product.screens
    .slice(0, 8)
    .map((s, i) => {
      const y = 108 + i * 36;
      const active = s.key === activeKey;
      return `
        <rect x="12" y="${y}" width="196" height="32" rx="8" fill="${active ? product.theme.accent : 'transparent'}" opacity="${active ? 0.22 : 0}"/>
        <circle cx="28" cy="${y + 16}" r="4" fill="${active ? product.theme.accent : mutedSidebar(product.theme)}"/>
        <text x="42" y="${y + 21}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" fill="${active ? sidebarText(product.theme) : mutedSidebar(product.theme)}">${esc(s.name)}</text>
      `;
    })
    .join('');
}

function kpiCards(product: SeedSoftwareProduct) {
  const kpis = product.dashboardKPIs.slice(0, 4);
  return kpis
    .map((kpi, i) => {
      const x = 244 + i * 178;
      const value =
        i === 0 ? '128' : i === 1 ? '94.2%' : i === 2 ? '৳2.4L' : '18';
      return `
        <rect x="${x}" y="88" width="168" height="92" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="${x + 16}" y="116" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" fill="#64748b">${esc(kpi)}</text>
        <text x="${x + 16}" y="148" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="26" font-weight="700" fill="#0f172a">${value}</text>
        <rect x="${x + 16}" y="160" width="72" height="6" rx="3" fill="${product.theme.primary}" opacity="0.2"/>
      `;
    })
    .join('');
}

function tableBlock(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const headers = product.terminology.slice(0, 4);
  const rows = Array.from({ length: 6 }, (_, r) => r);
  const headerCells = headers
    .map((h, i) => `<text x="${268 + i * 150}" y="268" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="600" fill="#64748b">${esc(h.toUpperCase())}</text>`)
    .join('');
  const body = rows
    .map((r) => {
      const y = 304 + r * 42;
      const cells = headers
        .map((h, i) => {
          const sample =
            i === 0
              ? `${h.slice(0, 3).toUpperCase()}-${1000 + r * 7}`
              : i === 1
                ? product.terminology[(r + i) % product.terminology.length]
                : i === 2
                  ? r % 2 === 0
                    ? 'Active'
                    : 'Pending'
                  : `৳${(12 + r * 3).toLocaleString()}K`;
          return `<text x="${268 + i * 150}" y="${y}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" fill="#0f172a">${esc(sample)}</text>`;
        })
        .join('');
      return `<line x1="252" y1="${y + 14}" x2="960" y2="${y + 14}" stroke="#f1f5f9"/>${cells}`;
    })
    .join('');
  return `
    <rect x="244" y="220" width="732" height="380" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="268" y="250" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="16" font-weight="700" fill="#0f172a">${esc(screen.name)}</text>
    <rect x="780" y="232" width="168" height="32" rx="8" fill="${product.theme.primary}"/>
    <text x="864" y="253" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="600" fill="#ffffff">+ New ${esc(headers[0] || 'Record')}</text>
    ${headerCells}
    <line x1="252" y1="278" x2="960" y2="278" stroke="#e2e8f0"/>
    ${body}
  `;
}

function formBlock(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const fields = product.terminology.slice(0, 6);
  return `
    <rect x="244" y="220" width="732" height="380" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="268" y="254" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="18" font-weight="700" fill="#0f172a">${esc(screen.name)}</text>
    ${fields
      .map((f, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 268 + col * 340;
        const y = 286 + row * 88;
        return `
          <text x="${x}" y="${y}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" fill="#64748b">${esc(f)}</text>
          <rect x="${x}" y="${y + 10}" width="300" height="40" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
          <text x="${x + 14}" y="${y + 36}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" fill="#94a3b8">Enter ${esc(f.toLowerCase())}</text>
        `;
      })
      .join('')}
    <rect x="268" y="548" width="140" height="36" rx="10" fill="${product.theme.primary}"/>
    <text x="338" y="571" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="600" fill="#ffffff">Save</text>
  `;
}

function chartBlock(product: SeedSoftwareProduct) {
  const bars = [48, 72, 56, 88, 64, 96, 70];
  return `
    <rect x="244" y="200" width="450" height="220" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="268" y="232" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" font-weight="700" fill="#0f172a">${esc(product.dashboardKPIs[0] || 'Overview')}</text>
    ${bars
      .map((h, i) => {
        const x = 280 + i * 52;
        const y = 380 - h;
        return `<rect x="${x}" y="${y}" width="28" height="${h}" rx="6" fill="${product.theme.primary}" opacity="${0.45 + i * 0.07}"/>`;
      })
      .join('')}
    <rect x="714" y="200" width="262" height="220" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="738" y="232" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" font-weight="700" fill="#0f172a">Quick Actions</text>
    ${product.modules
      .slice(0, 4)
      .map((m, i) => {
        const y = 258 + i * 36;
        return `
          <rect x="738" y="${y}" width="214" height="28" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
          <text x="754" y="${y + 19}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" fill="#334155">${esc(m)}</text>
        `;
      })
      .join('')}
  `;
}

function posBillingBlock(product: SeedSoftwareProduct) {
  const items = ['Item A', 'Item B', 'Item C', 'Item D'];
  return `
    <rect x="244" y="88" width="480" height="512" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="268" y="124" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="16" font-weight="700" fill="#0f172a">Cart</text>
    ${items
      .map((item, i) => {
        const y = 148 + i * 56;
        return `
          <rect x="260" y="${y}" width="448" height="48" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
          <text x="276" y="${y + 30}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" fill="#0f172a">${esc(item)} × ${i + 1}</text>
          <text x="680" y="${y + 30}" text-anchor="end" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="600" fill="#0f172a">৳${(120 + i * 45).toLocaleString()}</text>
        `;
      })
      .join('')}
    <rect x="744" y="88" width="232" height="512" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="860" y="130" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" font-weight="700" fill="#0f172a">Total</text>
    <text x="860" y="178" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="28" font-weight="800" fill="${product.theme.primary}">৳2,480</text>
    <rect x="768" y="220" width="184" height="48" rx="12" fill="${product.theme.primary}"/>
    <text x="860" y="250" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" font-weight="700" fill="#ffffff">Cash</text>
    <rect x="768" y="284" width="184" height="48" rx="12" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="860" y="314" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" font-weight="600" fill="#334155">Card / bKash</text>
    <rect x="768" y="520" width="184" height="48" rx="12" fill="${product.theme.accent}"/>
    <text x="860" y="550" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" font-weight="700" fill="#0f172a">Complete Sale</text>
  `;
}

function crmPipelineBlock(product: SeedSoftwareProduct) {
  const stages = ['New', 'Contacted', 'Proposal', 'Won'];
  return `
    ${stages
      .map((stage, i) => {
        const x = 244 + i * 190;
        return `
          <rect x="${x}" y="88" width="176" height="512" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
          <text x="${x + 16}" y="118" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="700" fill="#0f172a">${esc(stage)}</text>
          ${[0, 1, 2]
            .map((c) => {
              const y = 140 + c * 100;
              return `
                <rect x="${x + 12}" y="${y}" width="152" height="84" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
                <text x="${x + 24}" y="${y + 28}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="600" fill="#0f172a">${esc(product.terminology[c % product.terminology.length])}</text>
                <text x="${x + 24}" y="${y + 52}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" fill="#64748b">৳${(80 + i * 20 + c * 15).toLocaleString()}K</text>
              `;
            })
            .join('')}
        `;
      })
      .join('')}
  `;
}

function mobileScreenSvg(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const width = 420;
  const height = 860;
  const primary = product.theme.primary;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#0f172a"/>
  <rect x="16" y="16" width="388" height="828" rx="28" fill="#f8fafc"/>
  <rect x="16" y="16" width="388" height="72" rx="28" fill="${primary}"/>
  <rect x="16" y="56" width="388" height="32" fill="${primary}"/>
  <text x="210" y="58" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="16" font-weight="700" fill="#ffffff">${esc(screen.name)}</text>
  <text x="36" y="120" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" fill="#64748b">${esc(product.softwareType)} · ${esc(product.industry)}</text>
  ${[0, 1, 2, 3, 4, 5]
    .map((i) => {
      const y = 148 + i * 92;
      const label = product.modules[i % product.modules.length] || product.terminology[i % product.terminology.length];
      return `
        <rect x="36" y="${y}" width="348" height="76" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
        <circle cx="68" cy="${y + 38}" r="16" fill="${primary}" opacity="0.2"/>
        <text x="100" y="${y + 34}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" font-weight="600" fill="#0f172a">${esc(label)}</text>
        <text x="100" y="${y + 56}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" fill="#64748b">${esc(screen.name)} detail</text>
      `;
    })
    .join('')}
  <rect x="80" y="780" width="260" height="40" rx="20" fill="${primary}"/>
  <text x="210" y="805" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="600" fill="#ffffff">${esc(screen.name)}</text>
</svg>`;
}

function screenContent(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const key = screen.key.toLowerCase();
  if (key.includes('pos-billing') || (product.softwareType === 'POS' && key.includes('billing'))) {
    return posBillingBlock(product);
  }
  if (key === 'pipeline' || (product.softwareType === 'CRM' && key === 'pipeline')) {
    return crmPipelineBlock(product);
  }
  if (screen.category === 'dashboard') {
    return `${kpiCards(product)}${chartBlock(product)}`;
  }
  if (screen.category === 'form' || screen.category === 'settings') {
    return formBlock(product, screen);
  }
  return tableBlock(product, screen);
}

function screenSvg(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  if (product.platformType === 'mobile' || product.softwareType === 'Mobile App') {
    return mobileScreenSvg(product, screen);
  }

  const width = 1024;
  const height = 640;
  const side = sidebarFill(product.theme);
  const text = sidebarText(product.theme);
  const typeLabel = product.softwareType || 'Software';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect x="0" y="0" width="220" height="${height}" fill="${side}"/>
  <text x="24" y="42" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="16" font-weight="800" fill="${text}">${esc(product.title)}</text>
  <text x="24" y="64" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" fill="${mutedSidebar(product.theme)}">${esc(typeLabel)} · ${esc(product.industry)}</text>
  ${navItems(product, screen.key)}
  <rect x="220" y="0" width="804" height="64" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="244" y="40" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="18" font-weight="700" fill="#0f172a">${esc(screen.name)}</text>
  <rect x="680" y="16" width="220" height="32" rx="16" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="700" y="37" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" fill="#94a3b8">Search ${esc(product.terminology[0] || 'records')}...</text>
  <circle cx="940" cy="32" r="12" fill="${product.theme.accent}" opacity="0.25"/>
  ${screenContent(product, screen)}
</svg>`;
}

function coverSvg(product: SeedSoftwareProduct) {
  const primary = product.theme.primary;
  const accent = product.theme.accent;
  const kpis = product.dashboardKPIs.slice(0, 3);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <defs>
    <linearGradient id="desk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.08"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.28"/>
    </filter>
  </defs>
  <rect width="1280" height="800" fill="transparent"/>
  <rect x="80" y="90" width="820" height="520" rx="18" fill="#0f172a" filter="url(#shadow)"/>
  <rect x="96" y="106" width="788" height="464" rx="10" fill="#f8fafc"/>
  <rect x="96" y="106" width="180" height="464" fill="${sidebarFill(product.theme)}"/>
  <text x="116" y="140" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" font-weight="800" fill="${sidebarText(product.theme)}">${esc(product.title)}</text>
  ${product.screens
    .slice(0, 6)
    .map((s, i) => `<text x="116" y="${180 + i * 34}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" fill="${mutedSidebar(product.theme)}">${esc(s.name)}</text>`)
    .join('')}
  <rect x="296" y="126" width="560" height="40" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="312" y="152" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" font-weight="700" fill="#0f172a">${esc(product.softwareType)} Dashboard</text>
  ${kpis
    .map((k, i) => {
      const x = 296 + i * 188;
      return `
        <rect x="${x}" y="184" width="176" height="84" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="${x + 14}" y="210" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" fill="#64748b">${esc(k)}</text>
        <text x="${x + 14}" y="242" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22" font-weight="800" fill="${primary}">${i === 0 ? '86' : i === 1 ? '12.4%' : '৳9.8L'}</text>
      `;
    })
    .join('')}
  <rect x="296" y="288" width="560" height="250" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="316" y="320" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="700" fill="#0f172a">${esc(product.terminology[0] || 'Records')}</text>
  ${[0, 1, 2, 3, 4]
    .map(
      (r) =>
        `<rect x="316" y="${344 + r * 34}" width="520" height="24" rx="6" fill="${r % 2 ? '#f8fafc' : '#ffffff'}" stroke="#f1f5f9"/>
         <text x="328" y="${361 + r * 34}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" fill="#334155">${esc(product.terminology[r % product.terminology.length])} · Batch ${120 + r}</text>`
    )
    .join('')}
  <!-- phone -->
  <rect x="960" y="180" width="220" height="440" rx="28" fill="#0f172a" filter="url(#shadow)"/>
  <rect x="972" y="198" width="196" height="404" rx="20" fill="#f8fafc"/>
  <rect x="972" y="198" width="196" height="56" fill="${primary}"/>
  <text x="1070" y="232" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="700" fill="#ffffff">${esc(product.title.split(' ')[0])}</text>
  ${product.modules
    .slice(0, 5)
    .map((m, i) => {
      const y = 278 + i * 52;
      return `
        <rect x="990" y="${y}" width="160" height="40" rx="10" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="1070" y="${y + 25}" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" fill="#334155">${esc(m)}</text>
      `;
    })
    .join('')}
  <text x="640" y="760" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="18" font-weight="700" fill="#0f172a">${esc(product.title)}</text>
  <text x="640" y="786" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" fill="#64748b">${esc(product.shortDescription.slice(0, 90))}</text>
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

async function generateProduct(product: SeedSoftwareProduct) {
  const dir = path.join(ROOT, product.slug);
  await mkdir(dir, { recursive: true });

  const manifestPath = path.join(dir, 'design-manifest.json');
  await writeFile(manifestPath, JSON.stringify(buildManifest(product), null, 2));

  const coverCard = path.join(dir, 'cover-card.avif');
  const coverDetail = path.join(dir, 'cover-detail.avif');
  if (force || !(await exists(coverCard))) {
    const svg = coverSvg(product);
    const n = await svgToAvif(svg, coverCard, 720, 48);
    console.log(`  cover-card ${(n / 1024).toFixed(1)}KB`);
  }
  if (force || !(await exists(coverDetail))) {
    const svg = coverSvg(product);
    const n = await svgToAvif(svg, coverDetail, 1200, 55);
    console.log(`  cover-detail ${(n / 1024).toFixed(1)}KB`);
  }

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

async function main() {
  await mkdir(ROOT, { recursive: true });
  const list = slugArg
    ? SOFTWARE_SEED_PRODUCTS.filter((p) => p.slug === slugArg)
    : SOFTWARE_SEED_PRODUCTS;
  if (!list.length) {
    console.error('No products matched');
    process.exit(1);
  }
  console.log(`Generating assets for ${list.length} software systems → ${ROOT}`);
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
