import type { SeedSoftwareProduct, SoftwareScreenSeed } from '../../src/features/software-showcase/types';
import { COLOR, TYPE, W, H, SIDEBAR_W, HEADER_H } from './typography';
import { brandOf, logoOf, maturityProfile, type VisualFamily } from './datasets';
import { iconAt } from './icons';
import { rect, t } from './primitives';

function sideFill(theme: SeedSoftwareProduct['theme']) {
  return theme.sidebar === 'dark' ? '#0b1220' : theme.sidebar === 'brand' ? theme.primary : '#f8fafc';
}
function sideText(theme: SeedSoftwareProduct['theme']) {
  return theme.sidebar === 'light' ? '#0f172a' : '#f8fafc';
}
function sideMuted(theme: SeedSoftwareProduct['theme']) {
  return theme.sidebar === 'light' ? '#64748b' : '#cbd5e1';
}

function navLimit(product: SeedSoftwareProduct) {
  const m = maturityProfile(product);
  if (m === 'starter') return 7;
  if (m === 'production') return 9;
  if (m === 'professional') return 12;
  if (m === 'enterprise') return 14;
  return 10;
}

export function renderAppChrome(
  product: SeedSoftwareProduct,
  screen: SoftwareScreenSeed,
  _family: VisualFamily
) {
  const brand = brandOf(product);
  const logo = logoOf(product);
  const side = sideFill(product.theme);
  const compact = product.theme.density === 'compact' || maturityProfile(product) === 'enterprise';
  const navStep = compact ? 32 : 40;
  const nav = product.screens.slice(0, navLimit(product)).map((s, i) => {
    const y = 100 + i * navStep;
    const on = s.key === screen.key;
    return `${on ? rect(12, y, SIDEBAR_W - 24, 34, product.theme.accent, ' opacity="0.22" rx="10"') : ''}
      <circle cx="34" cy="${y + 17}" r="4" fill="${on ? product.theme.accent : sideMuted(product.theme)}"/>
      ${t(48, y + 22, s.name, {
        size: TYPE.nav,
        fill: on ? sideText(product.theme) : sideMuted(product.theme),
        weight: on ? 700 : 500,
      })}`;
  }).join('');

  return `
  ${rect(0, 0, SIDEBAR_W, H, side, ' rx="0"')}
  ${t(20, 40, brand, { size: 16, fill: sideText(product.theme), weight: 800 })}
  ${t(20, 62, `${product.softwareType} · ${product.industry.split('/')[0].trim()}`, {
    size: 12,
    fill: sideMuted(product.theme),
  })}
  ${nav}
  ${rect(16, H - 64, SIDEBAR_W - 32, 44, product.theme.sidebar === 'light' ? '#e2e8f0' : 'rgba(255,255,255,0.1)', ' rx="10"')}
  <circle cx="40" cy="${H - 42}" r="14" fill="${product.theme.primary}" opacity="0.9"/>
  ${t(40, H - 37, logo.slice(0, 2), { size: 10, fill: '#fff', anchor: 'middle', weight: 800 })}
  ${t(62, H - 37, 'Tanvir Ahmed', { size: 13, fill: sideText(product.theme), weight: 600 })}

  ${rect(SIDEBAR_W, 0, W - SIDEBAR_W, HEADER_H, COLOR.surface, ` stroke="${COLOR.border}" rx="0"`)}
  ${t(SIDEBAR_W + 28, 40, screen.name, { size: TYPE.title, weight: 800 })}
  ${rect(W - 360, 14, 240, 36, COLOR.soft, ` stroke="${COLOR.border}" rx="10"`)}
  ${iconAt('search', W - 344, 24, 16, COLOR.faint)}
  ${t(W - 320, 38, `Search ${product.terminology[0] || 'records'}…`, { size: TYPE.body, fill: COLOR.faint })}
  <circle cx="${W - 72}" cy="32" r="16" fill="${product.theme.primary}"/>
  ${t(W - 72, 37, logo.slice(0, 2), { size: 11, fill: '#fff', anchor: 'middle', weight: 800 })}`;
}

export function contentOrigin() {
  return { x: SIDEBAR_W + 24, y: HEADER_H + 20, w: W - SIDEBAR_W - 48, h: H - HEADER_H - 40 };
}
