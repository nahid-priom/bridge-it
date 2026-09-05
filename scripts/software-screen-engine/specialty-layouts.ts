import type { SeedSoftwareProduct } from '../../src/features/software-showcase/types';
import { TYPE, COLOR } from './typography';
import { demoRows, hashSlug, kpiValue, money, type VisualFamily } from './datasets';
import { contentOrigin } from './chrome';
import { KpiCard, StatusBadge, card, rect, t } from './primitives';
import { specialtyLayout, type SpecialtyLayout } from './specialty';

function pipelineSteps(
  x: number,
  y: number,
  w: number,
  steps: string[],
  primary: string,
  accent: string
) {
  const stepW = (w - (steps.length - 1) * 12) / steps.length;
  return steps
    .map((label, i) => {
      const sx = x + i * (stepW + 12);
      const fill = i === 0 ? primary : COLOR.soft;
      const text = i === 0 ? '#fff' : COLOR.secondary;
      return `${rect(sx, y, stepW, 56, fill, ` rx="12" stroke="${i === 0 ? primary : COLOR.border}"`)}
        ${t(sx + stepW / 2, y + 34, label, { size: 13, fill: text, anchor: 'middle', weight: 700 })}
        ${i < steps.length - 1 ? rect(sx + stepW + 2, y + 24, 8, 8, accent, ' rx="4"') : ''}`;
    })
    .join('');
}

function alertList(
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  items: Array<[string, string, string]>,
  primary: string
) {
  return `${card(x, y, w, h)}
    ${t(x + 18, y + 32, title, { size: TYPE.title, weight: 700 })}
    ${items
      .map((item, i) => {
        const iy = y + 56 + i * 52;
        return `${rect(x + 14, iy, w - 28, 44, COLOR.soft, ' rx="10"')}
          ${t(x + 28, iy + 28, item[0], { size: TYPE.body, weight: 600 })}
          ${t(x + w - 28, iy + 28, item[1], { size: TYPE.body, fill: primary, anchor: 'end', weight: 700 })}
          ${StatusBadge(x + w / 2 - 40, iy + 10, item[2], primary, 80)}`;
      })
      .join('')}`;
}

export function renderSpecialtyDashboard(
  product: SeedSoftwareProduct,
  family: VisualFamily,
  layout: SpecialtyLayout
) {
  if (!layout) return null;
  const { x, y, w } = contentOrigin();
  const { primary, accent } = product.theme;
  const kpis = product.dashboardKPIs.slice(0, 6);
  const rows = demoRows(product, family, 5);
  const h = hashSlug(product.slug);

  if (layout === 'merchandising') {
    const cols = 3;
    const cardW = (w - 28) / cols;
    return `
      ${kpis
        .slice(0, 6)
        .map((kpi, i) =>
          KpiCard(
            x + (i % cols) * (cardW + 14),
            y + Math.floor(i / cols) * 110,
            cardW,
            96,
            kpi,
            kpiValue(product, i),
            undefined,
            true,
            i % 2 ? accent : primary
          )
        )
        .join('')}
      ${t(x, y + 240, 'Inquiry → Confirmation Pipeline', { size: TYPE.title, weight: 700 })}
      ${pipelineSteps(x, y + 260, w, ['Inquiry', 'Sample', 'Costing', 'Quote', 'Confirm', 'Ship'], primary, accent)}
      ${card(x, y + 340, w * 0.62, 360)}
      ${t(x + 20, y + 372, 'Active Styles (H&M / Zara / Next)', { size: TYPE.body, weight: 700 })}
      ${['Style', 'Buyer', 'Pcs', 'Sample', 'T&A', 'Status']
        .map((hLabel, i) => t(x + 20 + i * 110, y + 404, hLabel.toUpperCase(), { size: 11, fill: COLOR.faint, weight: 700 }))
        .join('')}
      ${['GM-2401', 'GM-2402', 'GM-2403', 'GM-2404', 'GM-2405']
        .map((style, i) => {
          const ry = y + 440 + i * 48;
          const buyer = ['H&M', 'Zara', 'M&S', 'Next', 'Primark'][i];
          const pcs = (8000 + ((h + i * 17) % 40000)).toLocaleString('en-BD');
          return `${t(x + 20, ry, style, { size: TYPE.table, weight: 600 })}
            ${t(x + 130, ry, buyer, { size: TYPE.table })}
            ${t(x + 240, ry, pcs, { size: TYPE.table })}
            ${t(x + 350, ry, i % 2 ? 'Approved' : 'Pending', { size: TYPE.table })}
            ${t(x + 460, ry, `Sep ${10 + i}`, { size: TYPE.table, fill: COLOR.faint })}
            ${StatusBadge(x + 560, ry - 14, i % 3 === 0 ? 'Hot' : 'On Track', i % 3 === 0 ? '#dc2626' : '#059669')}`;
        })
        .join('')}
      ${alertList(
        x + w * 0.64,
        y + 340,
        w * 0.36,
        360,
        'Approvals Pending',
        [
          ['Sample GM-2401', 'Lab dip', 'Wait'],
          ['Cost Sheet Zara', 'CM review', 'Due'],
          ['T&A Next', 'Fabric in', 'Risk'],
          ['Quote Primark', 'Buyer', 'New'],
        ],
        primary
      )}`;
  }

  if (layout === 'production-floor') {
    const cardW = (w - 42) / 4;
    return `
      ${kpis
        .slice(0, 4)
        .map((kpi, i) =>
          KpiCard(x + i * (cardW + 14), y, cardW, 100, kpi, kpiValue(product, i), `+${i + 2}%`, true, accent)
        )
        .join('')}
      ${card(x, y + 118, w * 0.58, 280)}
      ${t(x + 20, y + 150, 'Hourly Sewing Output (pcs)', { size: TYPE.title, weight: 700 })}
      ${Array.from({ length: 10 }, (_, i) => {
        const barH = 40 + ((h + i * 13) % 140);
        const bx = x + 40 + i * 58;
        return `${rect(bx, y + 360 - barH, 36, barH, i === 7 ? accent : primary, ' rx="6" opacity="0.85"')}
          ${t(bx + 18, y + 378, `${8 + i}`, { size: 11, fill: COLOR.faint, anchor: 'middle' })}`;
      }).join('')}
      ${card(x + w * 0.6, y + 118, w * 0.4, 280)}
      ${t(x + w * 0.6 + 18, y + 150, 'Active Lines', { size: TYPE.title, weight: 700 })}
      ${['Line-01', 'Line-02', 'Line-03', 'Line-04', 'Line-05']
        .map((line, i) => {
          const ly = y + 180 + i * 40;
          const eff = 72 + ((h + i) % 22);
          return `${t(x + w * 0.6 + 18, ly, line, { size: TYPE.body, weight: 600 })}
            ${rect(x + w * 0.6 + 110, ly - 14, 160, 12, COLOR.soft, ' rx="6"')}
            ${rect(x + w * 0.6 + 110, ly - 14, (160 * eff) / 100, 12, accent, ' rx="6"')}
            ${t(x + w - 24, ly, `${eff}%`, { size: TYPE.muted, anchor: 'end', weight: 700, fill: primary })}`;
        })
        .join('')}
      ${card(x, y + 418, w, 280)}
      ${t(x + 20, y + 450, 'WIP & Rejection Board', { size: TYPE.title, weight: 700 })}
      ${['Bundle', 'Style', 'Cutting', 'Sewing', 'WIP', 'Reject']
        .map((hLabel, i) => t(x + 20 + i * 160, y + 482, hLabel.toUpperCase(), { size: 11, fill: COLOR.faint, weight: 700 }))
        .join('')}
      ${rows
        .map((r, i) => {
          const ry = y + 520 + i * 36;
          return `${t(x + 20, ry, `B-${1200 + i}`, { size: TYPE.table, weight: 600 })}
            ${t(x + 180, ry, `GM-240${i + 1}`, { size: TYPE.table })}
            ${t(x + 340, ry, String(1200 + i * 80), { size: TYPE.table })}
            ${t(x + 500, ry, String(980 + i * 70), { size: TYPE.table })}
            ${t(x + 660, ry, String(220 - i * 12), { size: TYPE.table })}
            ${StatusBadge(x + 820, ry - 14, i % 2 ? 'OK' : 'High', i % 2 ? '#059669' : '#dc2626')}`;
        })
        .join('')}`;
  }

  if (layout === 'inventory') {
    const cardW = (w - 42) / 4;
    return `
      ${kpis
        .slice(0, 4)
        .map((kpi, i) =>
          KpiCard(x + i * (cardW + 14), y, cardW, 100, kpi, kpiValue(product, i), undefined, true, i === 3 ? '#f59e0b' : primary)
        )
        .join('')}
      ${[0, 1, 2]
        .map((i) => {
          const cx = x + i * ((w - 28) / 3 + 14);
          const cw = (w - 28) / 3;
          const titles = ['Fabric / Raw Godown', 'Trim / Premix Store', 'Finished / Ready'];
          return `${card(cx, y + 118, cw, 200)}
            ${t(cx + 18, y + 150, titles[i], { size: TYPE.body, weight: 700 })}
            ${t(cx + 18, y + 190, money(180000 + i * 42000 + (h % 50000)), { size: 26, weight: 800, fill: primary })}
            ${t(cx + 18, y + 230, `${12 + i * 3} reorder alerts`, { size: TYPE.muted, fill: '#d97706' })}
            ${t(cx + 18, y + 270, `${40 + i * 8} active SKUs`, { size: TYPE.muted, fill: COLOR.faint })}`;
        })
        .join('')}
      ${card(x, y + 340, w, 360)}
      ${t(x + 20, y + 372, 'Stock Movements & Lots', { size: TYPE.title, weight: 700 })}
      ${['SKU / Material', 'Warehouse', 'Lot', 'Qty', 'Value', 'Status']
        .map((hLabel, i) => t(x + 20 + i * 170, y + 404, hLabel.toUpperCase(), { size: 11, fill: COLOR.faint, weight: 700 }))
        .join('')}
      ${rows
        .map((r, i) => {
          const ry = y + 444 + i * 48;
          return `${t(x + 20, ry, r.term, { size: TYPE.table, weight: 600 })}
            ${t(x + 190, ry, `WH-${i + 1}`, { size: TYPE.table })}
            ${t(x + 360, ry, `L-${900 + i}`, { size: TYPE.table })}
            ${t(x + 530, ry, String(r.qty), { size: TYPE.table })}
            ${t(x + 700, ry, money(r.amount), { size: TYPE.table, weight: 700 })}
            ${StatusBadge(x + 860, ry - 14, i === 1 ? 'Reorder' : 'OK', i === 1 ? '#d97706' : '#059669')}`;
        })
        .join('')}`;
  }

  if (layout === 'hr-payroll') {
    const cardW = (w - 42) / 4;
    return `
      ${kpis
        .slice(0, 4)
        .map((kpi, i) =>
          KpiCard(x + i * (cardW + 14), y, cardW, 100, kpi, kpiValue(product, i), undefined, true, primary)
        )
        .join('')}
      ${card(x, y + 118, w * 0.45, 300)}
      ${t(x + 20, y + 150, 'Today Attendance', { size: TYPE.title, weight: 700 })}
      <circle cx="${x + w * 0.22}" cy="${y + 280}" r="70" fill="none" stroke="${COLOR.soft}" stroke-width="16"/>
      <circle cx="${x + w * 0.22}" cy="${y + 280}" r="70" fill="none" stroke="${accent}" stroke-width="16" stroke-dasharray="330 440" stroke-linecap="round"/>
      ${t(x + w * 0.22, y + 276, '92%', { size: 28, weight: 800, anchor: 'middle', fill: primary })}
      ${t(x + w * 0.22, y + 302, 'Present', { size: TYPE.muted, anchor: 'middle', fill: COLOR.faint })}
      ${card(x + w * 0.48, y + 118, w * 0.52, 300)}
      ${t(x + w * 0.48 + 18, y + 150, 'Shift Snapshot', { size: TYPE.title, weight: 700 })}
      ${['Shift A · Cutting', 'Shift B · Sewing', 'Shift C · Finishing', 'General · Admin']
        .map((label, i) => {
          const ly = y + 190 + i * 50;
          const present = 180 + i * 40 + (h % 30);
          return `${t(x + w * 0.48 + 18, ly, label, { size: TYPE.body, weight: 600 })}
            ${t(x + w - 40, ly, `${present} present`, { size: TYPE.body, anchor: 'end', fill: primary, weight: 700 })}`;
        })
        .join('')}
      ${card(x, y + 440, w, 260)}
      ${t(x + 20, y + 472, 'Payroll Queue', { size: TYPE.title, weight: 700 })}
      ${['Emp ID', 'Name', 'Section', 'OT Hrs', 'Net Pay', 'Status']
        .map((hLabel, i) => t(x + 20 + i * 170, y + 504, hLabel.toUpperCase(), { size: 11, fill: COLOR.faint, weight: 700 }))
        .join('')}
      ${rows
        .map((r, i) => {
          const ry = y + 544 + i * 36;
          return `${t(x + 20, ry, `E-${2000 + i}`, { size: TYPE.table, weight: 600 })}
            ${t(x + 190, ry, r.person, { size: TYPE.table })}
            ${t(x + 360, ry, i % 2 ? 'Sewing' : 'Cutting', { size: TYPE.table })}
            ${t(x + 530, ry, String(2 + (i % 5)), { size: TYPE.table })}
            ${t(x + 700, ry, money(12000 + i * 850), { size: TYPE.table, weight: 700 })}
            ${StatusBadge(x + 860, ry - 14, i === 0 ? 'Draft' : 'Ready', i === 0 ? '#d97706' : '#059669')}`;
        })
        .join('')}`;
  }

  if (layout === 'commercial') {
    return `
      ${kpis
        .slice(0, 6)
        .map((kpi, i) => {
          const cols = 3;
          const cardW = (w - 28) / cols;
          return KpiCard(
            x + (i % cols) * (cardW + 14),
            y + Math.floor(i / cols) * 110,
            cardW,
            96,
            kpi,
            kpiValue(product, i),
            undefined,
            true,
            i % 2 ? accent : primary
          );
        })
        .join('')}
      ${t(x, y + 240, 'Document Workflow', { size: TYPE.title, weight: 700 })}
      ${pipelineSteps(x, y + 260, w, ['PI', 'LC', 'BBLC', 'Invoice', 'Packing', 'Ship', 'Bank'], primary, accent)}
      ${card(x, y + 340, w, 360)}
      ${t(x + 20, y + 372, 'Export Document Tracker', { size: TYPE.title, weight: 700 })}
      ${['Doc', 'Buyer', 'Value', 'Bank', 'Vessel', 'Status']
        .map((hLabel, i) => t(x + 20 + i * 170, y + 404, hLabel.toUpperCase(), { size: 11, fill: COLOR.faint, weight: 700 }))
        .join('')}
      ${['PI-8821', 'LC-4410', 'CI-2291', 'PL-1180', 'BL-9033']
        .map((doc, i) => {
          const ry = y + 444 + i * 48;
          const buyer = ['H&M', 'Zara', 'Next', 'M&S', 'Primark'][i];
          return `${t(x + 20, ry, doc, { size: TYPE.table, weight: 600 })}
            ${t(x + 190, ry, buyer, { size: TYPE.table })}
            ${t(x + 360, ry, money(250000 + i * 80000), { size: TYPE.table, weight: 700 })}
            ${t(x + 530, ry, i % 2 ? 'SCB' : 'DBBL', { size: TYPE.table })}
            ${t(x + 700, ry, i % 2 ? 'Evergreen' : 'Maersk', { size: TYPE.table, fill: COLOR.faint })}
            ${StatusBadge(x + 860, ry - 14, i < 2 ? 'Open' : 'Cleared', i < 2 ? '#2563eb' : '#059669')}`;
        })
        .join('')}`;
  }

  if (layout === 'feed-production') {
    const cardW = (w - 42) / 4;
    return `
      ${kpis
        .slice(0, 4)
        .map((kpi, i) =>
          KpiCard(x + i * (cardW + 14), y, cardW, 100, kpi, kpiValue(product, i), undefined, true, primary)
        )
        .join('')}
      ${pipelineSteps(x, y + 120, w, ['Plan', 'Formula', 'Issue', 'Mix', 'QC', 'Bag'], primary, accent)}
      ${card(x, y + 200, w * 0.55, 400)}
      ${t(x + 20, y + 232, 'Today Batches (MT)', { size: TYPE.title, weight: 700 })}
      ${['Broiler Starter', 'Broiler Grower', 'Broiler Finisher', 'Layer Feed', 'Cattle Conc.']
        .map((name, i) => {
          const ly = y + 280 + i * 56;
          const mt = 12 + ((h + i * 7) % 28);
          return `${t(x + 24, ly, name, { size: TYPE.body, weight: 600 })}
            ${rect(x + 220, ly - 16, 280, 14, COLOR.soft, ' rx="7"')}
            ${rect(x + 220, ly - 16, (280 * mt) / 40, 14, accent, ' rx="7"')}
            ${t(x + 520, ly, `${mt} MT`, { size: TYPE.body, weight: 700, fill: primary })}`;
        })
        .join('')}
      ${alertList(
        x + w * 0.58,
        y + 200,
        w * 0.42,
        400,
        'Yield & Wastage',
        [
          ['Batch-2401', '98.2%', 'OK'],
          ['Batch-2402', '96.1%', 'Watch'],
          ['Batch-2403', '99.0%', 'OK'],
          ['Batch-2404', '94.8%', 'High'],
          ['Batch-2405', '97.5%', 'OK'],
        ],
        primary
      )}`;
  }

  if (layout === 'formula-costing') {
    return `
      ${kpis
        .slice(0, 4)
        .map((kpi, i) => {
          const cardW = (w - 42) / 4;
          return KpiCard(x + i * (cardW + 14), y, cardW, 100, kpi, kpiValue(product, i), undefined, true, primary);
        })
        .join('')}
      ${card(x, y + 118, w * 0.55, 480)}
      ${t(x + 20, y + 150, 'Formula Builder · Broiler Grower v3', { size: TYPE.title, weight: 700 })}
      ${['Ingredient', 'Kg/Ton', 'Cost/Kg', 'Cost/Ton', '%']
        .map((hLabel, i) => t(x + 24 + i * 130, y + 186, hLabel.toUpperCase(), { size: 11, fill: COLOR.faint, weight: 700 }))
        .join('')}
      ${[
        ['Maize', '520', '42', '21,840', '52'],
        ['Soybean Meal', '280', '78', '21,840', '28'],
        ['Rice Polish', '80', '28', '2,240', '8'],
        ['Wheat Bran', '60', '22', '1,320', '6'],
        ['Limestone', '30', '12', '360', '3'],
        ['Premix', '30', '210', '6,300', '3'],
      ]
        .map((row, i) => {
          const ry = y + 230 + i * 48;
          return row
            .map((cell, ci) =>
              t(x + 24 + ci * 130, ry, cell, {
                size: TYPE.table,
                weight: ci === 0 || ci === 3 ? 700 : 500,
                fill: ci === 3 ? primary : COLOR.text,
              })
            )
            .join('');
        })
        .join('')}
      ${t(x + 24, y + 560, 'Total Cost/Ton', { size: TYPE.body, weight: 700 })}
      ${t(x + 520, y + 560, '৳53,900', { size: 22, weight: 800, fill: primary, anchor: 'end' })}
      ${card(x + w * 0.58, y + 118, w * 0.42, 480)}
      ${t(x + w * 0.58 + 18, y + 150, 'Margin Simulation', { size: TYPE.title, weight: 700 })}
      ${['Sell ৳58,500', 'Margin 8.5%', 'CP 19.2%', 'ME 2950']
        .map((label, i) => {
          const ly = y + 200 + i * 70;
          return `${rect(x + w * 0.58 + 18, ly, w * 0.42 - 36, 52, COLOR.soft, ' rx="12"')}
            ${t(x + w * 0.58 + 36, ly + 32, label, { size: TYPE.body, weight: 700, fill: primary })}`;
        })
        .join('')}
      ${t(x + w * 0.58 + 18, y + 520, 'Compare v2 vs v3: −৳1,200/Ton', { size: TYPE.muted, fill: '#059669', weight: 600 })}`;
  }

  if (layout === 'dealer-sales') {
    const cardW = (w - 42) / 4;
    return `
      ${kpis
        .slice(0, 4)
        .map((kpi, i) =>
          KpiCard(x + i * (cardW + 14), y, cardW, 100, kpi, kpiValue(product, i), undefined, true, primary)
        )
        .join('')}
      ${card(x, y + 118, w * 0.48, 280)}
      ${t(x + 20, y + 150, 'Territory Performance', { size: TYPE.title, weight: 700 })}
      ${['North · Gazipur', 'South · Khulna', 'East · Sylhet', 'West · Rajshahi', 'Central · Dhaka']
        .map((name, i) => {
          const ly = y + 190 + i * 38;
          const pct = 62 + ((h + i * 9) % 35);
          return `${t(x + 24, ly, name, { size: TYPE.body, weight: 600 })}
            ${rect(x + 220, ly - 12, 200, 12, COLOR.soft, ' rx="6"')}
            ${rect(x + 220, ly - 12, (200 * pct) / 100, 12, accent, ' rx="6"')}
            ${t(x + w * 0.48 - 24, ly, `${pct}%`, { size: TYPE.muted, anchor: 'end', weight: 700 })}`;
        })
        .join('')}
      ${card(x + w * 0.5, y + 118, w * 0.5, 280)}
      ${t(x + w * 0.5 + 18, y + 150, 'Credit Watch', { size: TYPE.title, weight: 700 })}
      ${[
        ['Agro Dealer North', 'Limit 12L', 'Due 4.2L'],
        ['Poultry Hub BD', 'Limit 8L', 'Due 1.1L'],
        ['Cattle Feed Mart', 'Limit 6L', 'Due 5.8L'],
        ['Aqua Feed Co', 'Limit 5L', 'Due 0.4L'],
      ]
        .map((row, i) => {
          const ly = y + 190 + i * 48;
          return `${t(x + w * 0.5 + 18, ly, row[0], { size: TYPE.body, weight: 600 })}
            ${t(x + w * 0.5 + 18, ly + 18, row[1], { size: TYPE.muted, fill: COLOR.faint })}
            ${t(x + w - 28, ly, row[2], { size: TYPE.body, anchor: 'end', weight: 700, fill: i === 2 ? '#dc2626' : primary })}`;
        })
        .join('')}
      ${card(x, y + 420, w, 280)}
      ${t(x + 20, y + 452, 'Dispatch & Collection', { size: TYPE.title, weight: 700 })}
      ${rows
        .map((r, i) => {
          const ry = y + 500 + i * 36;
          return `${t(x + 24, ry, r.party, { size: TYPE.table, weight: 600 })}
            ${t(x + 280, ry, `${r.qty} MT`, { size: TYPE.table })}
            ${t(x + 420, ry, money(r.amount), { size: TYPE.table, weight: 700 })}
            ${t(x + 600, ry, r.city, { size: TYPE.table, fill: COLOR.faint })}
            ${StatusBadge(x + 780, ry - 14, r.status, r.color)}`;
        })
        .join('')}`;
  }

  if (layout === 'finance') {
    const cardW = (w - 42) / 4;
    return `
      ${kpis
        .slice(0, 4)
        .map((kpi, i) =>
          KpiCard(x + i * (cardW + 14), y, cardW, 100, kpi, kpiValue(product, i), undefined, true, primary)
        )
        .join('')}
      ${card(x, y + 118, w * 0.5, 320)}
      ${t(x + 20, y + 150, 'Cash Flow (This Month)', { size: TYPE.title, weight: 700 })}
      ${['Inflow', 'Outflow', 'Net']
        .map((label, i) => {
          const vals = [money(4200000 + (h % 500000)), money(3100000), money(1100000)];
          const ly = y + 200 + i * 70;
          return `${t(x + 24, ly, label, { size: TYPE.body, fill: COLOR.faint, weight: 600 })}
            ${t(x + 24, ly + 28, vals[i], { size: 24, weight: 800, fill: i === 2 ? accent : primary })}`;
        })
        .join('')}
      ${card(x + w * 0.52, y + 118, w * 0.48, 320)}
      ${t(x + w * 0.52 + 18, y + 150, 'P&L Snapshot', { size: TYPE.title, weight: 700 })}
      ${[
        ['Sales', money(9800000)],
        ['COGS', money(7200000)],
        ['Gross Profit', money(2600000)],
        ['Expenses', money(980000)],
        ['Net Profit', money(1620000)],
      ]
        .map((row, i) => {
          const ly = y + 190 + i * 42;
          return `${t(x + w * 0.52 + 18, ly, row[0], { size: TYPE.body, weight: 600 })}
            ${t(x + w - 28, ly, row[1], { size: TYPE.body, anchor: 'end', weight: 700, fill: i === 4 ? '#059669' : primary })}`;
        })
        .join('')}
      ${card(x, y + 460, w, 240)}
      ${t(x + 20, y + 492, 'Dealer Receivables Ledger', { size: TYPE.title, weight: 700 })}
      ${rows
        .map((r, i) => {
          const ry = y + 540 + i * 32;
          return `${t(x + 24, ry, r.party, { size: TYPE.table, weight: 600 })}
            ${t(x + 360, ry, money(r.amount), { size: TYPE.table, weight: 700 })}
            ${t(x + 560, ry, r.date, { size: TYPE.table, fill: COLOR.faint })}
            ${StatusBadge(x + 720, ry - 14, i % 2 ? 'Current' : 'Overdue', i % 2 ? '#059669' : '#dc2626')}`;
        })
        .join('')}`;
  }

  return null;
}

export function specialtyCoverComposition(product: SeedSoftwareProduct): string | null {
  const layout = specialtyLayout(product);
  if (!layout) return null;
  const { primary, accent } = product.theme;
  const brand = product.brandName || product.title;

  const frame = (inner: string, caption: string) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="desk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.12"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.28"/>
    </filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#desk)"/>
  ${t(80, 56, brand, { size: 28, weight: 800 })}
  ${t(80, 84, caption, { size: 14, fill: '#475569' })}
  ${inner}
  ${t(800, 960, product.shortDescription.slice(0, 100), { size: 14, fill: '#475569', anchor: 'middle' })}
</svg>`;

  if (layout === 'formula-costing') {
    return frame(
      `${rect(120, 120, 1360, 760, '#0f172a', ' rx="18" filter="url(#shadow)"')}
       ${rect(140, 140, 1320, 720, '#f8fafc', ' rx="10"')}
       ${rect(140, 140, 1320, 56, primary, ' rx="0"')}
       ${t(160, 176, 'Formula Builder · Broiler Grower', { size: 18, fill: '#fff', weight: 700 })}
       ${['Maize 520kg', 'Soy 280kg', 'Cost ৳53,900/Ton', 'Margin 8.5%']
         .map((label, i) => `${rect(180 + i * 310, 230, 280, 80, '#fff', ` stroke="${COLOR.border}" rx="12"`)}
           ${t(200 + i * 310, 278, label, { size: 16, weight: 700, fill: primary })}`)
         .join('')}
       ${rect(180, 340, 1260, 480, '#fff', ` stroke="${COLOR.border}" rx="12"`)}
       ${t(210, 390, 'Ingredient cost breakdown dominates this product cover', { size: 16, fill: COLOR.faint })}
       ${['Maize', 'Soybean Meal', 'Rice Polish', 'Wheat Bran', 'Premix']
         .map((name, i) => `${t(210, 450 + i * 60, name, { size: 18, weight: 600 })}
           ${rect(480, 432 + i * 60, 800, 16, COLOR.soft, ' rx="8"')}
           ${rect(480, 432 + i * 60, 200 + i * 90, 16, accent, ' rx="8"')}`)
         .join('')}`,
      'Feed Formula & Costing'
    );
  }

  if (layout === 'dealer-sales') {
    return frame(
      `${rect(100, 110, 900, 700, '#0f172a', ' rx="18" filter="url(#shadow)"')}
       ${rect(118, 128, 864, 664, '#eef2f7', ' rx="10"')}
       ${t(140, 170, 'Sales Dashboard', { size: 20, weight: 800, fill: primary })}
       ${['Active Dealers', 'Outstanding', 'Dispatch MT']
         .map((k, i) => `${rect(140 + i * 270, 200, 250, 90, '#fff', ` stroke="${COLOR.border}" rx="12"`)}
           ${t(160 + i * 270, 236, k, { size: 13, fill: COLOR.faint })}
           ${t(160 + i * 270, 270, kpiValue(product, i), { size: 22, weight: 800, fill: primary })}`)
         .join('')}
       ${rect(140, 320, 820, 440, '#fff', ` stroke="${COLOR.border}" rx="12"`)}
       ${['Agro Dealer North', 'Poultry Hub BD', 'Cattle Feed Mart', 'Aqua Feed Co']
         .map((d, i) => `${t(170, 380 + i * 80, d, { size: 16, weight: 700 })}
           ${t(900, 380 + i * 80, money(85000 + i * 22000), { size: 16, weight: 700, anchor: 'end', fill: primary })}`)
         .join('')}
       ${rect(1040, 280, 460, 520, '#0f172a', ' rx="28" filter="url(#shadow)"')}
       ${rect(1058, 300, 424, 480, '#f8fafc', ' rx="20"')}
       ${rect(1058, 300, 424, 56, primary, ' rx="0"')}
       ${t(1270, 336, 'Routes', { size: 16, fill: '#fff', anchor: 'middle', weight: 700 })}
       ${['North Route', 'South Route', 'East Route']
         .map((r, i) => `${t(1270, 420 + i * 80, r, { size: 15, anchor: 'middle', weight: 600, fill: primary })}`)
         .join('')}`,
      'Feed Dealer & Distribution'
    );
  }

  if (layout === 'hr-payroll') {
    return frame(
      `${rect(180, 130, 1240, 700, '#0f172a', ' rx="18" filter="url(#shadow)"')}
       ${rect(198, 148, 1204, 664, '#f1f5f9', ' rx="10"')}
       ${t(230, 200, 'HR Dashboard · Attendance & Payroll', { size: 22, weight: 800, fill: primary })}
       ${['Present 2,184', 'OT 412 hrs', 'Payroll Ready']
         .map((k, i) => `${rect(230 + i * 380, 240, 350, 100, '#fff', ` stroke="${COLOR.border}" rx="14"`)}
           ${t(250 + i * 380, 300, k, { size: 20, weight: 800, fill: primary })}`)
         .join('')}
       ${rect(230, 380, 1140, 380, '#fff', ` stroke="${COLOR.border}" rx="14"`)}
       ${t(260, 430, 'Salary Sheet · September 2026', { size: 18, weight: 700 })}
       ${['Cutting', 'Sewing', 'Finishing', 'QC', 'Admin']
         .map((sec, i) => `${t(260, 500 + i * 48, sec, { size: 16, weight: 600 })}
           ${t(700, 500 + i * 48, money(420000 + i * 80000), { size: 16, weight: 700, fill: primary })}
           ${t(1100, 500 + i * 48, `${180 + i * 40} staff`, { size: 14, fill: COLOR.faint })}`)
         .join('')}`,
      'Garments HR & Payroll'
    );
  }

  if (layout === 'commercial') {
    return frame(
      `${rect(140, 120, 1320, 740, '#0f172a', ' rx="18" filter="url(#shadow)"')}
       ${rect(158, 138, 1284, 704, '#0b1220', ' rx="10"')}
       ${t(200, 190, 'Commercial Desk · PI / LC / Shipment', { size: 22, fill: '#fff', weight: 800 })}
       ${['Open PIs', 'Active LCs', 'Realization']
         .map((k, i) => `${rect(200 + i * 400, 230, 360, 110, '#152033', ' rx="14"')}
           ${t(220 + i * 400, 275, k, { size: 14, fill: '#94a3b8' })}
           ${t(220 + i * 400, 315, kpiValue(product, i), { size: 26, fill: accent, weight: 800 })}`)
         .join('')}
       ${rect(200, 380, 1200, 400, '#152033', ' rx="14"')}
       ${['PI → LC → Invoice → Packing → Bank']
         .map((label) => t(800, 480, label, { size: 20, fill: '#e2e8f0', anchor: 'middle', weight: 700 }))
         .join('')}
       ${['H&M LC-4410', 'Zara CI-2291', 'Next BL-9033']
         .map((d, i) => `${t(280, 560 + i * 60, d, { size: 18, fill: '#cbd5e1', weight: 600 })}
           ${t(1200, 560 + i * 60, money(320000 + i * 90000), { size: 18, fill: accent, anchor: 'end', weight: 700 })}`)
         .join('')}`,
      'Garments Commercial & Export'
    );
  }

  // Generic specialty: dominant dashboard frame with purpose caption
  return frame(
    `${rect(120, 120, 1100, 700, '#0f172a', ' rx="18" filter="url(#shadow)"')}
     ${rect(138, 138, 1064, 664, '#eef2f7', ' rx="10"')}
     ${rect(138, 138, 220, 664, product.theme.sidebar === 'light' ? '#f8fafc' : primary, ' rx="0"')}
     ${product.screens
       .slice(0, 9)
       .map((s, i) => t(158, 200 + i * 48, s.name, { size: 13, fill: i === 0 ? accent : product.theme.sidebar === 'light' ? '#64748b' : '#94a3b8', weight: i === 0 ? 700 : 500 }))
       .join('')}
     ${product.dashboardKPIs
       .slice(0, 3)
       .map((k, i) => `${rect(400 + i * 250, 180, 230, 90, '#fff', ` stroke="${COLOR.border}" rx="12"`)}
         ${t(420 + i * 250, 216, k, { size: 12, fill: COLOR.faint })}
         ${t(420 + i * 250, 250, kpiValue(product, i), { size: 22, weight: 800, fill: primary })}`)
       .join('')}
     ${rect(400, 300, 760, 460, '#fff', ` stroke="${COLOR.border}" rx="12"`)}
     ${t(430, 350, product.screens[0]?.name || 'Dashboard', { size: 18, weight: 700 })}
     ${product.terminology
       .slice(0, 6)
       .map((term, i) => t(430, 410 + i * 50, `• ${term}`, { size: 15, fill: COLOR.secondary }))
       .join('')}
     ${rect(1280, 420, 240, 400, '#0f172a', ' rx="28" filter="url(#shadow)"')}
     ${rect(1296, 440, 208, 360, '#f8fafc', ' rx="18"')}
     ${rect(1296, 440, 208, 48, primary, ' rx="0"')}
     ${t(1400, 472, product.logoText || 'APP', { size: 14, fill: '#fff', anchor: 'middle', weight: 700 })}`,
    `${product.softwareType} · ${product.industry}`
  );
}
