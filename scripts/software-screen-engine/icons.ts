/** Deterministic simple SVG icon glyphs (16×16 viewBox scaled). */
export function iconAt(
  name: string,
  x: number,
  y: number,
  size = 16,
  fill = '#64748b'
): string {
  const s = size / 16;
  const paths: Record<string, string> = {
    search:
      'M11.5 11.5L15 15M7 12.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z',
    plus: 'M8 3v10M3 8h10',
    chart:
      'M2 14V8M6 14V4M10 14v-6M14 14V6',
    user: 'M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2.5 14.5c1.5-2.5 3.5-3.5 5.5-3.5s4 1 5.5 3.5',
    box: 'M2 5l6-3 6 3v6l-6 3-6-3V5zM2 5l6 3 6-3M8 8v6',
    cart: 'M2 3h2l1.5 8h8L15 5H5M6 14a1 1 0 1 0 0.01 0M12 14a1 1 0 1 0 0.01 0',
    cash: 'M2 5h12v8H2zM2 8h12M8 5v8',
    truck:
      'M1 10h10V5H1v5zm10 0h3l2 3v2h-2m-3-5v5M4 15a1.5 1.5 0 1 0 0-0.01M13 15a1.5 1.5 0 1 0 0-0.01',
    heart:
      'M8 14s-6-3.5-6-7.5A3.5 3.5 0 0 1 8 4a3.5 3.5 0 0 1 6 2.5C14 10.5 8 14 8 14z',
    home: 'M2 7.5L8 2l6 5.5V14H9v-4H7v4H2V7.5z',
    settings:
      'M8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M12.8 3.2l-1.4 1.4M4.6 11.4l-1.4 1.4',
    calendar:
      'M3 5h10v9H3V5zm0 3h10M5 3v2M11 3v2',
    check: 'M3 8.5l3.5 3.5L13 5',
    edit: 'M11 2l3 3-8 8H3v-3l8-8z',
    filter: 'M2 3h12l-4 5v5l-4 2V8L2 3z',
    print: 'M4 6V2h8v4M3 10h10v5H3v-5zm1-4h8v4H4V6z',
    export: 'M8 2v8M5 6l3-3 3 3M3 11v3h10v-3',
  };
  const d = paths[name] || paths.box;
  return `<g transform="translate(${x},${y}) scale(${s})" fill="none" stroke="${fill}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></g>`;
}
