import type { SeedSoftwareProduct, SoftwareScreenSeed } from '../../src/features/software-showcase/types';
import { W, H, COLOR, TYPE } from './typography';
import {
  brandOf,
  demoRows,
  deriveQuickActions,
  kpiValue,
  logoOf,
  money,
  visualFamily,
} from './datasets';
import { shadowDefs, rect, t } from './primitives';
import { renderAppChrome } from './chrome';
import { renderScreenBody } from './layouts/screens';
import { specialtyCoverComposition } from './specialty-layouts';

export { visualFamily, brandOf, deriveQuickActions } from './datasets';
export type { VisualFamily } from './datasets';

export function screenSvg(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const family = visualFamily(product);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${shadowDefs()}
  <rect width="${W}" height="${H}" fill="url(#pageBg)"/>
  ${renderAppChrome(product, screen, family)}
  ${renderScreenBody(product, screen, family)}
</svg>`;
}

export function mobileSvg(product: SeedSoftwareProduct, screen: SoftwareScreenSeed) {
  const primary = product.theme.primary;
  const family = visualFamily(product);
  const rows = demoRows(product, family, 4);
  const tabs = product.screens.slice(0, 4);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="860" viewBox="0 0 420 860">
  <rect width="420" height="860" fill="#0f172a"/>
  ${rect(12, 12, 396, 836, COLOR.soft, ' rx="28"')}
  ${rect(12, 12, 396, 72, primary, ' rx="28"')}<rect x="12" y="52" width="396" height="32" fill="${primary}"/>
  ${t(210, 54, screen.name, { size: 16, fill: '#fff', anchor: 'middle', weight: 700 })}
  ${product.dashboardKPIs
    .slice(0, 2)
    .map((k, i) => {
      const x = 32 + i * 184;
      return `${rect(x, 108, 172, 84, COLOR.surface, ` stroke="${COLOR.border}" rx="14"`)}
        ${t(x + 14, 138, k, { size: TYPE.label, fill: COLOR.faint })}
        ${t(x + 14, 170, kpiValue(product, i), { size: 20, weight: 700 })}`;
    })
    .join('')}
  ${rows
    .map((r, i) => {
      const y = 214 + i * 112;
      return `${rect(32, y, 356, 100, COLOR.surface, ` stroke="${COLOR.border}" rx="14"`)}
        ${t(52, y + 36, r.party, { size: TYPE.body, weight: 700 })}
        ${t(52, y + 60, `${r.code} · ${r.city}`, { size: TYPE.muted, fill: COLOR.faint })}
        ${t(52, y + 84, money(r.amount), { size: TYPE.body, weight: 700, fill: primary })}`;
    })
    .join('')}
  ${rect(12, 760, 396, 88, COLOR.surface, ` stroke="${COLOR.border}" rx="0"`)}
  ${tabs
    .map((tb, i) => {
      const x = 40 + i * 90;
      const on = tb.key === screen.key || i === 0;
      return `<circle cx="${x + 30}" cy="790" r="5" fill="${on ? primary : '#cbd5e1'}"/>
        ${t(x + 30, 818, tb.name.slice(0, 8), { size: 11, fill: on ? primary : COLOR.faint, anchor: 'middle', weight: on ? 700 : 500 })}`;
    })
    .join('')}
</svg>`;
}

/** Cover SVG — specialty products get purpose-specific compositions. */
export function coverSvg(product: SeedSoftwareProduct) {
  const specialty = specialtyCoverComposition(product);
  if (specialty) return specialty;

  const family = visualFamily(product);
  const brand = brandOf(product);
  const { primary, accent } = product.theme;
  const kpis = product.dashboardKPIs.slice(0, 3);
  const rows = demoRows(product, family, 5);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="desk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.14"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="#0f172a" flood-opacity="0.32"/>
    </filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#desk)"/>
  ${t(80, 56, brand, { size: 28, weight: 800 })}
  ${t(80, 84, `${product.softwareType} for ${product.industry}`, { size: 14, fill: '#475569' })}
  ${rect(80, 110, 1012, 656, '#0f172a', ' rx="18" filter="url(#shadow)"')}
  ${rect(96, 126, 980, 624, '#eef2f7', ' rx="10"')}
  ${rect(96, 126, 200, 624, product.theme.sidebar === 'brand' ? primary : '#0b1220', ' rx="0"')}
  ${t(112, 158, brand, { size: 14, fill: '#fff', weight: 700 })}
  ${product.screens.slice(0, 8).map((s, i) => t(112, 198 + i * 32, s.name, { size: 12, fill: i === 0 ? accent : '#94a3b8', weight: i === 0 ? 700 : 500 })).join('')}
  ${kpis
    .map((k, i) => {
      const x = 312 + i * 248;
      return `${rect(x, 192, 232, 86, '#fff', ' stroke="#e2e8f0" rx="10"')}
        ${t(x + 14, 220, k, { size: 12, fill: '#64748b' })}
        ${t(x + 14, 252, kpiValue(product, i), { size: 22, weight: 700, fill: primary })}`;
    })
    .join('')}
  ${rect(312, 296, 720, 420, '#fff', ' stroke="#e2e8f0" rx="10"')}
  ${rows.map((r, i) => `${t(332, 340 + i * 56, `${r.code} · ${r.party}`, { size: 14 })}`).join('')}
  ${rect(1240, 470, 240, 460, '#0f172a', ' rx="28" filter="url(#shadow)"')}
  ${rect(1252, 490, 216, 420, '#f8fafc', ' rx="20"')}
  ${rect(1252, 490, 216, 52, primary, ' rx="0"')}
  ${t(1360, 522, logoOf(product), { size: 14, fill: '#fff', anchor: 'middle', weight: 700 })}
  ${t(800, 940, product.shortDescription.slice(0, 110), { size: 14, fill: '#475569', anchor: 'middle' })}
</svg>`;
}

export function buildManifest(product: SeedSoftwareProduct, assetVersion: number) {
  const family = visualFamily(product);
  return {
    premiumUpgradeVersion: assetVersion,
    productName: product.title,
    brandName: brandOf(product),
    logoText: logoOf(product),
    productType: `${product.softwareType} Software`,
    industry: product.industry,
    targetUsers: product.primaryUser.split('/').map((s) => s.trim()),
    designSystem: {
      style: 'premium enterprise',
      density: product.theme.density,
      navigation: product.platformType === 'mobile' ? 'bottom-tabs' : 'sidebar',
      cardStyle: 'elevated-clean',
      tableStyle: 'enterprise',
      buttonStyle: 'solid-44',
      mobileStyle: product.platformType === 'mobile' ? 'native-like' : 'responsive-drawer',
      visualFamily: family,
      sidebarStyle: product.theme.sidebar,
      headerStyle: 'search-avatar',
      screenDensity: product.theme.density,
      fontScale: 'accessible-15',
      navigationMode: 'sidebar',
      theme: product.theme,
      primaryColor: product.theme.primary,
      accentColor: product.theme.accent,
    },
    primaryModules: product.modules,
    dashboardKPIs: product.dashboardKPIs,
    quickActions: deriveQuickActions(product, family),
    screens: product.screens.map((s, i) => ({
      key: s.key,
      name: s.name,
      category: s.category,
      sortOrder: i,
      moduleName: s.name,
    })),
    assetVersion,
    canonicalLocalRoot: `seed-assets/software/${product.slug}`,
    storagePrefix: `software-showcase/${product.slug}/v${assetVersion}`,
  };
}
