import type { SeedSoftwareProduct, SoftwareScreenSeed } from '../../../src/features/software-showcase/types';
import { TYPE, COLOR, BTN_H } from '../typography';
import {
  demoRows,
  deriveQuickActions,
  hashSlug,
  kpiValue,
  maturityProfile,
  money,
  brandOf,
  type VisualFamily,
} from '../datasets';
import { contentOrigin } from '../chrome';
import {
  ChartCard,
  EnterpriseTable,
  FormSection,
  KpiCard,
  PaginationBar,
  QuickActionCard,
  StatusBadge,
  SummaryPanel,
  card,
  rect,
  t,
} from '../primitives';
import { iconAt } from '../icons';

export function renderDashboardScreen(product: SeedSoftwareProduct, family: VisualFamily) {
  const { x, y, w } = contentOrigin();
  const maturity = maturityProfile(product);
  const kpiCount = maturity === 'starter' ? 3 : maturity === 'enterprise' ? 6 : maturity === 'professional' ? 5 : 4;
  const kpis = product.dashboardKPIs.slice(0, kpiCount);
  const gap = 14;
  const cols = Math.min(kpiCount, 4);
  const cardW = (w - gap * (cols - 1)) / cols;
  const chartKind = (['bar', 'line', 'area', 'donut'] as const)[hashSlug(product.slug) % 4];
  const rowCount = maturity === 'starter' ? 4 : maturity === 'enterprise' ? 6 : 5;
  const rows = demoRows(product, family, rowCount);
  const actions = deriveQuickActions(product, family);
  const tableTitle =
    family === 'logistics'
      ? 'Live Operations'
      : family === 'retail-pos'
        ? 'Recent Sales'
        : family === 'feed-mill'
          ? 'Batch & Dispatch Activity'
          : family === 'garments'
            ? 'Style & Line Activity'
            : 'Recent Activity';
  const tableW = family === 'retail-pos' ? w - 300 : w;
  const kpiRow2Y = y + 114;
  const chartY = kpis.length > 4 ? kpiRow2Y + 114 : y + 118;

  return `
    ${kpis
      .slice(0, cols)
      .map((kpi, i) =>
        KpiCard(
          x + i * (cardW + gap),
          y,
          cardW,
          100,
          kpi,
          kpiValue(product, i),
          i % 2 === 0 ? `+${2 + i}.4%` : `-${1 + i}.1%`,
          i % 2 === 0,
          product.theme.primary
        )
      )
      .join('')}
    ${
      kpis.length > 4
        ? kpis
            .slice(4)
            .map((kpi, i) =>
              KpiCard(
                x + i * (cardW + gap),
                kpiRow2Y,
                cardW,
                100,
                kpi,
                kpiValue(product, i + 4),
                `+${1 + i}.8%`,
                true,
                product.theme.primary
              )
            )
            .join('')
        : ''
    }
    ${ChartCard(x, chartY, w - 280, 220, product.dashboardKPIs[0] || 'Trend', chartKind === 'donut' ? 'area' : chartKind, product.theme.primary, product.theme.accent)}
    ${QuickActionCard(x + w - 264, chartY, 264, 220, actions, product.theme.primary)}
    ${card(x, chartY + 238, tableW, 400)}
    ${t(x + 20, chartY + 270, tableTitle, { size: TYPE.title, weight: 700 })}
    ${['Code', 'Party', 'Owner', 'Amount', 'Status', 'Date']
      .map((h, i) => t(x + 20 + i * 180, chartY + 302, h.toUpperCase(), { size: 12, fill: COLOR.faint, weight: 700 }))
      .join('')}
    <line x1="${x + 16}" y1="${chartY + 314}" x2="${x + tableW - 16}" y2="${chartY + 314}" stroke="${COLOR.border}"/>
    ${rows
      .map((r, i) => {
        const ry = chartY + 350 + i * 52;
        return `${i % 2 ? rect(x + 12, ry - 28, tableW - 24, 48, COLOR.soft, ' rx="8"') : ''}
          ${t(x + 20, ry, r.code, { size: TYPE.table, weight: 600 })}
          ${t(x + 200, ry, r.party, { size: TYPE.table })}
          ${t(x + 380, ry, r.person, { size: TYPE.table, fill: COLOR.secondary })}
          ${t(x + 560, ry, money(r.amount), { size: TYPE.table, weight: 700 })}
          ${StatusBadge(x + 720, ry - 16, r.status, r.color)}
          ${t(x + 860, ry, r.date, { size: TYPE.table, fill: COLOR.faint })}`;
      })
      .join('')}
    ${
      family === 'retail-pos'
        ? `${card(x + w - 284, chartY + 238, 284, 400)}
           ${t(x + w - 264, chartY + 270, 'Top Products', { size: TYPE.body, weight: 700 })}
           ${rows
             .slice(0, 5)
             .map(
               (r, i) =>
                 `${t(x + w - 264, chartY + 312 + i * 56, r.term, { size: TYPE.body, weight: 600 })}
                  ${t(x + w - 40, chartY + 312 + i * 56, money(r.amount / 3), { size: TYPE.body, anchor: 'end', fill: product.theme.primary, weight: 700 })}`
             )
             .join('')}`
        : ''
    }`;
}

export function renderListScreen(product: SeedSoftwareProduct, family: VisualFamily, screenName: string) {
  const { x, y, w, h } = contentOrigin();
  const rows = demoRows(product, family, 8);
  const chips = product.terminology.slice(0, 4);
  const isStock = /stock|inventory|warehouse/i.test(screenName);
  const isProducts = /product/i.test(screenName);

  const headers = isStock
    ? ['Product', 'Opening', 'Purchase', 'Sale', 'Balance', 'Status']
    : isProducts
      ? ['SKU', 'Product', 'Category', 'Price', 'Stock', 'Status']
      : ['Code', 'Name / Party', 'Location', 'Value', 'Qty', 'Status'];

  return `
    ${card(x, y, w, 64)}
    ${rect(x + 16, y + 14, 280, 36, COLOR.soft, ` stroke="${COLOR.border}" rx="10"`)}
    ${iconAt('search', x + 28, y + 24, 16, COLOR.faint)}
    ${t(x + 52, y + 38, `Search ${headers[0].toLowerCase()}…`, { size: TYPE.body, fill: COLOR.faint })}
    ${chips
      .map((c, i) => {
        const cx = x + 316 + i * 120;
        const on = i === 0;
        return `${rect(cx, y + 14, 110, 36, on ? product.theme.primary : COLOR.soft, ` rx="18" stroke="${on ? product.theme.primary : COLOR.border}"`)}
          ${t(cx + 55, y + 38, c.slice(0, 11), { size: 13, fill: on ? '#fff' : COLOR.secondary, anchor: 'middle', weight: 600 })}`;
      })
      .join('')}
    ${rect(x + w - 168, y + 10, 148, BTN_H, product.theme.accent, ' rx="10"')}
    ${iconAt('plus', x + w - 152, y + 24, 16, '#0f172a')}
    ${t(x + w - 90, y + 38, `Add ${screenName.split(' ')[0]}`, { size: TYPE.button, fill: '#0f172a', anchor: 'middle', weight: 700 })}

    ${card(x, y + 80, w, h - 140)}
    ${headers.map((hLabel, i) => t(x + 24 + i * 180, y + 116, hLabel.toUpperCase(), { size: 12, fill: COLOR.faint, weight: 700 })).join('')}
    <line x1="${x + 16}" y1="${y + 128}" x2="${x + w - 16}" y2="${y + 128}" stroke="${COLOR.border}"/>
    ${rows
      .map((r, i) => {
        const ry = y + 168 + i * 56;
        const cells = isStock
          ? [r.term, String(40 + i * 5), String(20 + i * 3), String(r.qty), String(35 + i), r.status]
          : isProducts
            ? [r.code, r.term, r.extra || 'General', money(r.amount / Math.max(r.qty, 1)), String(r.qty), r.status]
            : [r.code, r.party, r.city, money(r.amount), String(r.qty), r.status];
        return `${i % 2 ? rect(x + 12, ry - 28, w - 24, 52, COLOR.soft, ' rx="8"') : ''}
          ${cells
            .slice(0, 5)
            .map((c, ci) => t(x + 24 + ci * 180, ry, c, { size: TYPE.table, weight: ci === 0 ? 600 : 500, fill: ci === 0 ? COLOR.text : COLOR.secondary }))
            .join('')}
          ${StatusBadge(x + 24 + 5 * 180, ry - 16, r.status, r.color)}
          ${isProducts ? `${iconAt('edit', x + w - 48, ry - 12, 16, product.theme.primary)}` : ''}`;
      })
      .join('')}
    ${PaginationBar(x + 24, y + h - 40, w - 48, `Showing 1–8 of ${48 + (hashSlug(product.slug) % 120)} ${screenName.toLowerCase()}`, product.theme.primary)}`;
}

export function renderTransactionScreen(product: SeedSoftwareProduct, family: VisualFamily, screenName: string) {
  const { x, y, w, h } = contentOrigin();
  const rows = demoRows(product, family, 7);
  const total = rows.reduce((s, r) => s + r.amount, 0);

  return `
    ${card(x, y, w, 80)}
    ${t(x + 24, y + 34, screenName, { size: TYPE.title, weight: 800 })}
    ${t(x + 24, y + 58, `Document ${rows[0].code} · ${rows[0].party} · ${rows[0].date}`, { size: TYPE.muted, fill: COLOR.faint })}
    ${rect(x + w - 220, y + 18, 196, BTN_H, product.theme.primary, ' rx="10"')}
    ${t(x + w - 122, y + 46, 'Post Transaction', { size: TYPE.button, fill: '#fff', anchor: 'middle', weight: 700 })}

    ${card(x, y + 96, w, h - 120)}
    ${['Line', 'Item', 'Party', 'Qty', 'Rate', 'Amount']
      .map((hLabel, i) => t(x + 24 + i * 180, y + 132, hLabel.toUpperCase(), { size: 12, fill: COLOR.faint, weight: 700 }))
      .join('')}
    <line x1="${x + 16}" y1="${y + 144}" x2="${x + w - 16}" y2="${y + 144}" stroke="${COLOR.border}"/>
    ${rows
      .map((r, i) => {
        const ry = y + 180 + i * 52;
        const rate = Math.round(r.amount / Math.max(r.qty, 1));
        return `${t(x + 24, ry, String(i + 1).padStart(2, '0'), { size: TYPE.table, fill: COLOR.faint })}
          ${t(x + 204, ry, r.term, { size: TYPE.table, weight: 600 })}
          ${t(x + 384, ry, r.party, { size: TYPE.table })}
          ${t(x + 564, ry, String(r.qty), { size: TYPE.table })}
          ${t(x + 744, ry, money(rate), { size: TYPE.table })}
          ${t(x + 924, ry, money(r.amount), { size: TYPE.table, weight: 700 })}`;
      })
      .join('')}
    ${rect(x + w - 360, y + h - 100, 336, 88, COLOR.soft, ` stroke="${COLOR.border}" rx="12"`)}
    ${t(x + w - 340, y + h - 68, 'Subtotal', { size: TYPE.body, fill: COLOR.faint })}
    ${t(x + w - 40, y + h - 68, money(total), { size: TYPE.body, anchor: 'end', weight: 600 })}
    ${t(x + w - 340, y + h - 36, 'Grand Total', { size: TYPE.title, weight: 800 })}
    ${t(x + w - 40, y + h - 36, money(total * 1.05), { size: TYPE.kpi, anchor: 'end', weight: 800, fill: product.theme.primary })}`;
}

export function renderReportScreen(product: SeedSoftwareProduct, family: VisualFamily, screenName: string) {
  const { x, y, w } = contentOrigin();
  const rows = demoRows(product, family, 5);
  return `
    ${card(x, y, w, 64)}
    ${t(x + 24, y + 40, 'Date range', { size: TYPE.body, fill: COLOR.faint })}
    ${rect(x + 120, y + 14, 120, 36, COLOR.soft, ` stroke="${COLOR.border}" rx="8"`)}${t(x + 180, y + 38, '01 Sep', { size: TYPE.body, anchor: 'middle' })}
    ${rect(x + 252, y + 14, 120, 36, COLOR.soft, ` stroke="${COLOR.border}" rx="8"`)}${t(x + 312, y + 38, '30 Sep', { size: TYPE.body, anchor: 'middle' })}
    ${rect(x + w - 220, y + 10, 88, BTN_H, COLOR.soft, ` stroke="${COLOR.border}" rx="10"`)}
    ${iconAt('export', x + w - 200, y + 24, 16, COLOR.secondary)}
    ${t(x + w - 168, y + 38, 'Export', { size: TYPE.button, fill: COLOR.secondary, weight: 600 })}
    ${rect(x + w - 120, y + 10, 100, BTN_H, product.theme.primary, ' rx="10"')}
    ${iconAt('print', x + w - 104, y + 24, 16, '#fff')}
    ${t(x + w - 64, y + 38, 'PDF', { size: TYPE.button, fill: '#fff', weight: 700 })}

    ${product.dashboardKPIs
      .slice(0, 3)
      .map((k, i) => KpiCard(x + i * ((w - 28) / 3 + 14), y + 84, (w - 28) / 3, 96, k, kpiValue(product, i), undefined, true, product.theme.primary))
      .join('')}
    ${ChartCard(x, y + 200, w * 0.62, 360, screenName, 'bar', product.theme.primary, product.theme.accent)}
    ${ChartCard(x + w * 0.64, y + 200, w * 0.36, 170, 'Mix', 'donut', product.theme.primary, product.theme.accent)}
    ${ChartCard(x + w * 0.64, y + 390, w * 0.36, 170, 'Weekly', 'line', product.theme.primary, product.theme.accent)}
    ${EnterpriseTable(
      x,
      y + 580,
      w,
      200,
      ['Code', 'Party', 'Amount', 'Status'],
      rows.map((r) => [r.code, r.party, money(r.amount), r.status]),
      'Report detail'
    )}`;
}

export function renderFormScreen(product: SeedSoftwareProduct, family: VisualFamily, screenName: string) {
  const { x, y, w, h } = contentOrigin();
  const rows = demoRows(product, family, 3);
  const fields: Array<[string, string]> = [
    ...product.terminology.slice(0, 4).map((term, i) => [term, i === 0 ? rows[0].code : i === 1 ? rows[0].party : i === 2 ? rows[0].person : rows[0].date] as [string, string]),
    ['Branch', rows[0].city],
    ['Assigned To', rows[0].person],
    ['Effective Date', rows[0].date],
    ['Notes', 'Follow standard approval'],
  ].slice(0, 8);

  return `
    ${FormSection(x, y, w - 320, h, screenName, `${product.businessType} · ${rows[0].code}`, fields, product.theme.primary, product.theme.accent)}
    ${SummaryPanel(
      x + w - 304,
      y,
      304,
      h,
      'Summary',
      product.dashboardKPIs.slice(0, 4).map((k, i) => [k, kpiValue(product, i)] as [string, string])
    )}`;
}

export function renderPOSScreen(product: SeedSoftwareProduct, family: VisualFamily) {
  const { x, y, w, h } = contentOrigin();
  const items = demoRows(product, family, 5);
  const total = items.reduce((s, r) => s + r.amount, 0);
  const leftW = w * 0.58;
  const rightW = w * 0.4;
  const rightX = x + w * 0.6;

  return `
    ${card(x, y, leftW, h)}
    ${t(x + 24, y + 36, `POS · ${brandOf(product)}`, { size: TYPE.title, weight: 800 })}
    ${rect(x + 24, y + 52, leftW - 48, 44, COLOR.soft, ` stroke="${COLOR.border}" rx="10"`)}
    ${iconAt('search', x + 40, y + 66, 16, COLOR.faint)}
    ${t(x + 64, y + 80, 'Search product by name or barcode…', { size: TYPE.body, fill: COLOR.faint })}
    ${t(x + 24, y + 124, 'Cart (5)', { size: TYPE.body, weight: 700 })}
    ${items
      .map((item, i) => {
        const iy = y + 148 + i * 72;
        return `${rect(x + 20, iy, leftW - 40, 64, COLOR.soft, ` stroke="${COLOR.border}" rx="12"`)}
          ${rect(x + 32, iy + 12, 40, 40, '#e2e8f0', ' rx="8"')}
          ${t(x + 88, iy + 30, `${item.term}`, { size: TYPE.body, weight: 700 })}
          ${t(x + 88, iy + 52, `Qty ${item.qty} · Disc 5%`, { size: TYPE.muted, fill: COLOR.faint })}
          ${t(x + leftW - 40, iy + 40, money(item.amount), { size: TYPE.body, weight: 700, anchor: 'end' })}`;
      })
      .join('')}

    ${card(rightX, y, rightW, h)}
    ${t(rightX + 24, y + 36, 'Customer', { size: TYPE.label, fill: COLOR.faint, weight: 600 })}
    ${rect(rightX + 24, y + 48, rightW - 48, 44, COLOR.soft, ` stroke="${COLOR.border}" rx="10"`)}
    ${t(rightX + 40, y + 76, `${items[0].person} · Walk-in`, { size: TYPE.body })}
    ${t(rightX + 24, y + 130, 'Bill Total', { size: TYPE.body, fill: COLOR.faint, weight: 600 })}
    ${t(rightX + rightW / 2, y + 180, money(total), { size: TYPE.kpiLg, weight: 800, anchor: 'middle', fill: product.theme.primary })}
    ${t(rightX + 24, y + 220, 'Discount ৳120 · Tax 5%', { size: TYPE.muted, fill: COLOR.faint })}
    ${['Cash', 'Mobile Banking', 'Card', 'Complete Sale']
      .map((label, i) => {
        const by = y + 260 + i * 64;
        const fill = i === 3 ? product.theme.accent : i === 0 ? product.theme.primary : COLOR.soft;
        const color = i === 0 ? '#fff' : '#0f172a';
        return `${rect(rightX + 24, by, rightW - 48, BTN_H + 8, fill, ` stroke="${i === 0 || i === 3 ? fill : COLOR.border}" rx="12"`)}
          ${t(rightX + rightW / 2, by + 32, label, { size: TYPE.button, fill: color, anchor: 'middle', weight: 800 })}`;
      })
      .join('')}`;
}

export function renderScreenBody(
  product: SeedSoftwareProduct,
  screen: SoftwareScreenSeed,
  family: VisualFamily
) {
  const key = screen.key.toLowerCase();
  if (key.includes('pos') || (family === 'retail-pos' && screen.category === 'transaction' && key.includes('billing'))) {
    return renderPOSScreen(product, family);
  }
  if (screen.category === 'dashboard' || key.includes('dashboard')) return renderDashboardScreen(product, family);
  if (screen.category === 'reports' || key === 'reports') return renderReportScreen(product, family, screen.name);
  if (
    screen.category === 'form' ||
    screen.category === 'settings' ||
    screen.category === 'users' ||
    key.includes('roles') ||
    key.includes('settings')
  ) {
    return renderFormScreen(product, family, screen.name);
  }
  if (
    screen.category === 'transaction' ||
    screen.category === 'accounts' ||
    key.includes('invoice') ||
    key.includes('billing') ||
    key.includes('collection') ||
    key.includes('purchase') ||
    key.includes('cash')
  ) {
    return renderTransactionScreen(product, family, screen.name);
  }
  return renderListScreen(product, family, screen.name);
}
