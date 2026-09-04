import { COLOR, FONT, TYPE, BTN_H } from './typography';
import { iconAt } from './icons';

export function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function t(
  x: number,
  y: number,
  s: string,
  opts: { size?: number; fill?: string; weight?: number; anchor?: string } = {}
) {
  const { size = TYPE.body, fill = COLOR.text, weight = 500, anchor } = opts;
  return `<text x="${x}" y="${y}"${anchor ? ` text-anchor="${anchor}"` : ''} font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(s)}</text>`;
}

export function rect(x: number, y: number, w: number, h: number, fill: string, extra = '') {
  const rx = /\brx=/.test(extra) ? '' : ' rx="12"';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}"${rx} fill="${fill}"${extra}/>`;
}

export function card(x: number, y: number, w: number, h: number, extra = '') {
  return `${rect(x, y, w, h, COLOR.surface, ` stroke="${COLOR.border}" filter="url(#cardShadow)" ${extra}`)}`;
}

export function shadowDefs() {
  return `<defs>
    <filter id="cardShadow" x="-8%" y="-8%" width="116%" height="124%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.06"/>
    </filter>
    <linearGradient id="pageBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLOR.page}"/>
      <stop offset="100%" stop-color="${COLOR.pageEnd}"/>
    </linearGradient>
  </defs>`;
}

export function KpiCard(
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  delta?: string,
  deltaPositive = true,
  accent = '#2563eb'
) {
  const deltaColor = deltaPositive ? '#059669' : '#dc2626';
  return `${card(x, y, w, h)}
    ${t(x + 18, y + 28, label, { size: TYPE.label, fill: COLOR.faint, weight: 600 })}
    ${t(x + 18, y + 60, value, { size: TYPE.kpi, weight: 700 })}
    ${rect(x + 18, y + h - 18, 40, 4, accent, ' rx="2" opacity="0.35"')}
    ${delta ? t(x + w - 18, y + 60, delta, { size: TYPE.muted, fill: deltaColor, anchor: 'end', weight: 600 }) : ''}`;
}

export function StatusBadge(x: number, y: number, label: string, color: string, w = 92) {
  return `${rect(x, y, w, 26, color, ' opacity="0.14" rx="13"')}
    ${t(x + w / 2, y + 18, label, { size: 12, fill: color, anchor: 'middle', weight: 700 })}`;
}

export function FilterToolbar(
  x: number,
  y: number,
  w: number,
  searchPlaceholder: string,
  chips: string[],
  primary: string,
  accent: string,
  addLabel: string
) {
  const chipStart = x + 300;
  return `${card(x, y, w, 64)}
    ${rect(x + 16, y + 14, 260, 36, COLOR.soft, ` stroke="${COLOR.border}" rx="10"`)}
    ${iconAt('search', x + 28, y + 24, 16, COLOR.faint)}
    ${t(x + 52, y + 38, searchPlaceholder, { size: TYPE.body, fill: COLOR.faint })}
    ${chips
      .slice(0, 4)
      .map((c, i) => {
        const cx = chipStart + i * 118;
        const on = i === 0;
        return `${rect(cx, y + 14, 108, 36, on ? primary : COLOR.soft, ` rx="18" stroke="${on ? primary : COLOR.border}"`)}
          ${t(cx + 54, y + 38, c.slice(0, 12), { size: 13, fill: on ? '#fff' : COLOR.secondary, anchor: 'middle', weight: 600 })}`;
      })
      .join('')}
    ${rect(x + w - 168, y + 10, 148, BTN_H, accent, ' rx="10"')}
    ${iconAt('plus', x + w - 152, y + 24, 16, '#0f172a')}
    ${t(x + w - 94, y + 38, addLabel, { size: TYPE.button, fill: '#0f172a', anchor: 'middle', weight: 700 })}`;
}

export function EnterpriseTable(
  x: number,
  y: number,
  w: number,
  h: number,
  headers: string[],
  rows: string[][],
  title?: string
) {
  const colW = (w - 40) / Math.max(headers.length, 1);
  const headY = title ? y + 56 : y + 36;
  const startRowY = headY + 36;
  return `${card(x, y, w, h)}
    ${title ? t(x + 20, y + 32, title, { size: TYPE.title, weight: 700 }) : ''}
    ${headers
      .map((hLabel, i) => t(x + 20 + i * colW, headY, hLabel.toUpperCase(), { size: 12, fill: COLOR.faint, weight: 700 }))
      .join('')}
    <line x1="${x + 16}" y1="${headY + 12}" x2="${x + w - 16}" y2="${headY + 12}" stroke="${COLOR.border}"/>
    ${rows
      .map((cells, r) => {
        const ry = startRowY + r * 48;
        return `${r % 2 ? rect(x + 12, ry - 28, w - 24, 44, COLOR.soft, ' rx="8"') : ''}
          ${cells
            .map((c, i) => t(x + 20 + i * colW, ry, c, { size: TYPE.table, fill: i === 0 ? COLOR.text : COLOR.secondary, weight: i === 0 ? 600 : 500 }))
            .join('')}`;
      })
      .join('')}`;
}

export function ChartCard(
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  kind: 'bar' | 'line' | 'area' | 'donut',
  primary: string,
  accent: string
) {
  const bars = [42, 68, 54, 86, 62, 94, 70, 78];
  let body = '';
  if (kind === 'donut') {
    const cx = x + w / 2;
    const cy = y + h / 2 + 12;
    body = `<circle cx="${cx}" cy="${cy}" r="58" fill="none" stroke="${COLOR.border}" stroke-width="16"/>
      <circle cx="${cx}" cy="${cy}" r="58" fill="none" stroke="${primary}" stroke-width="16" stroke-dasharray="240 360" transform="rotate(-90 ${cx} ${cy})"/>
      ${t(cx, cy + 6, '68%', { size: 20, weight: 700, anchor: 'middle' })}`;
  } else if (kind === 'line' || kind === 'area') {
    const pts = bars.map((b, i) => `${x + 36 + i * ((w - 72) / 7)},${y + h - 40 - b}`).join(' ');
    body =
      kind === 'area'
        ? `<polygon points="${x + 36},${y + h - 40} ${pts} ${x + w - 36},${y + h - 40}" fill="${primary}" opacity="0.12"/><polyline points="${pts}" fill="none" stroke="${primary}" stroke-width="3"/>`
        : `<polyline points="${pts}" fill="none" stroke="${primary}" stroke-width="3"/>${bars
            .map((b, i) => `<circle cx="${x + 36 + i * ((w - 72) / 7)}" cy="${y + h - 40 - b}" r="4" fill="${accent}"/>`)
            .join('')}`;
  } else {
    body = bars
      .map(
        (bh, i) =>
          `<rect x="${x + 28 + i * ((w - 48) / 8)}" y="${y + h - 36 - bh}" width="26" height="${bh}" rx="6" fill="${primary}" opacity="${0.5 + i * 0.05}"/>`
      )
      .join('');
  }
  return `${card(x, y, w, h)}${t(x + 20, y + 32, title, { size: TYPE.body, weight: 700 })}${body}`;
}

export function QuickActionCard(x: number, y: number, w: number, h: number, actions: string[], primary: string) {
  return `${card(x, y, w, h)}
    ${t(x + 20, y + 32, 'Quick Actions', { size: TYPE.body, weight: 700 })}
    ${actions
      .map((a, i) => {
        const ay = y + 52 + i * 52;
        const fill = i === 0 ? primary : COLOR.soft;
        const stroke = i === 0 ? primary : COLOR.border;
        const color = i === 0 ? '#fff' : COLOR.secondary;
        return `${rect(x + 16, ay, w - 32, BTN_H, fill, ` stroke="${stroke}" rx="10"`)}
          ${t(x + w / 2, ay + 28, a, { size: TYPE.button, fill: color, anchor: 'middle', weight: 700 })}`;
      })
      .join('')}`;
}

export function PaginationBar(x: number, y: number, w: number, summary: string, primary: string) {
  return `${t(x, y + 20, summary, { size: TYPE.muted, fill: COLOR.faint })}
    ${rect(x + w - 148, y, 64, 36, COLOR.soft, ` stroke="${COLOR.border}" rx="8"`)}
    ${t(x + w - 116, y + 24, 'Prev', { size: 13, fill: COLOR.secondary, anchor: 'middle', weight: 600 })}
    ${rect(x + w - 76, y, 64, 36, primary, ' rx="8"')}
    ${t(x + w - 44, y + 24, 'Next', { size: 13, fill: '#fff', anchor: 'middle', weight: 700 })}`;
}

export function SummaryPanel(x: number, y: number, w: number, h: number, title: string, lines: Array<[string, string]>) {
  return `${card(x, y, w, h)}
    ${t(x + 20, y + 32, title, { size: TYPE.body, weight: 700 })}
    ${lines
      .map(
        ([k, v], i) =>
          `${t(x + 20, y + 70 + i * 56, k, { size: TYPE.label, fill: COLOR.faint, weight: 600 })}
           ${t(x + 20, y + 94 + i * 56, v, { size: 20, weight: 700 })}`
      )
      .join('')}`;
}

export function FormSection(
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  subtitle: string,
  fields: Array<[string, string]>,
  primary: string,
  accent: string
) {
  return `${card(x, y, w, h)}
    ${t(x + 24, y + 36, title, { size: TYPE.title, weight: 700 })}
    ${t(x + 24, y + 60, subtitle, { size: TYPE.muted, fill: COLOR.faint })}
    ${fields
      .map(([label, value], i) => {
        const fx = x + 24 + (i % 2) * ((w - 56) / 2 + 8);
        const fy = y + 92 + Math.floor(i / 2) * 96;
        const fw = (w - 64) / 2;
        return `${t(fx, fy, label, { size: TYPE.label, fill: COLOR.faint, weight: 600 })}
          ${rect(fx, fy + 10, fw, 44, COLOR.soft, ` stroke="${COLOR.border}" rx="10"`)}
          ${t(fx + 14, fy + 40, value, { size: TYPE.body })}`;
      })
      .join('')}
    ${rect(x + 24, y + h - 60, 148, BTN_H, primary, ' rx="10"')}
    ${t(x + 98, y + h - 32, 'Save Draft', { size: TYPE.button, fill: '#fff', anchor: 'middle', weight: 700 })}
    ${rect(x + 188, y + h - 60, 148, BTN_H, accent, ' rx="10"')}
    ${t(x + 262, y + h - 32, 'Submit', { size: TYPE.button, fill: '#0f172a', anchor: 'middle', weight: 700 })}`;
}
