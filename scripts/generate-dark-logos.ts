/**
 * Generates dark-theme wordmark PNG assets from SVG templates.
 * Run: npx tsx scripts/generate-dark-logos.ts
 */
import { execSync } from 'child_process';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

const ROOT = join(process.cwd(), 'public');
const TMP = join(process.cwd(), 'scripts/.logo-tmp');

const EMERALD = '#22c55e';
const BLUE = '#3b82f6';
const BLUE_DARK = '#1d4ed8';

function markSvg(size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
  <defs>
    <linearGradient id="bGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="${BLUE_DARK}"/>
    </linearGradient>
    <linearGradient id="swoosh" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${EMERALD}"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
  </defs>
  <text x="4" y="36" font-family="system-ui,Segoe UI,sans-serif" font-size="34" font-weight="900" fill="url(#bGrad)">B</text>
  <path d="M14 22 Q24 18 34 22" stroke="#ffffff" stroke-width="1.2" fill="none" opacity="0.95"/>
  <path d="M12 24 L14 22 L16 24 L18 22 L20 24 L22 22 L24 24 L26 22 L28 24 L30 22 L32 24 L34 22 L36 24" stroke="#ffffff" stroke-width="0.8" fill="none" opacity="0.9"/>
  <path d="M10 30 Q24 26 38 30" stroke="url(#swoosh)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;
}

function wordmarkSvg(width: number, height: number, opts: { tagline?: boolean; compact?: boolean }): string {
  const markSize = opts.compact ? height - 4 : height - 8;
  const textX = markSize + (opts.compact ? 8 : 12);
  const titleSize = opts.compact ? 13 : height > 80 ? 22 : 16;
  const parkSize = opts.compact ? 9 : height > 80 ? 12 : 10;
  const tagSize = opts.compact ? 7 : 9;
  const titleY = opts.compact ? height * 0.52 : height * 0.48;
  const parkY = opts.compact ? height * 0.78 : height * 0.72;
  const tagY = height * 0.92;

  const bridgeLen = opts.compact ? 14 : 20;
  const bridgeY = markSize * 0.46;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="${BLUE_DARK}"/>
    </linearGradient>
    <linearGradient id="swoosh" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${EMERALD}"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
  </defs>
  <g transform="translate(2, ${(height - markSize) / 2})">
    <text x="0" y="${markSize * 0.78}" font-family="system-ui,Segoe UI,sans-serif" font-size="${markSize * 0.72}" font-weight="900" fill="url(#bGrad)">B</text>
    <path d="M${markSize * 0.22} ${bridgeY} Q${markSize * 0.5} ${bridgeY - 4} ${markSize * 0.78} ${bridgeY}" stroke="#ffffff" stroke-width="1" fill="none"/>
    <path d="M${markSize * 0.18} ${bridgeY + 2} L${markSize * 0.78} ${bridgeY + 2}" stroke="#ffffff" stroke-width="0.6" fill="none" opacity="0.85"/>
    <path d="M${markSize * 0.15} ${markSize * 0.68} Q${markSize * 0.5} ${markSize * 0.62} ${markSize * 0.85} ${markSize * 0.68}" stroke="url(#swoosh)" stroke-width="${opts.compact ? 1.8 : 2.2}" fill="none" stroke-linecap="round"/>
  </g>
  <text x="${textX}" y="${titleY}" font-family="system-ui,Segoe UI,sans-serif" font-size="${titleSize}" font-weight="800" letter-spacing="0.5">
    <tspan fill="#ffffff">BRIDGE </tspan><tspan fill="${EMERALD}">IT</tspan>
  </text>
  <text x="${textX}" y="${parkY}" font-family="system-ui,Segoe UI,sans-serif" font-size="${parkSize}" font-weight="600" fill="#ffffff" letter-spacing="2" opacity="0.95">PARK</text>
  ${opts.tagline ? `<text x="${textX}" y="${tagY}" font-family="system-ui,Segoe UI,sans-serif" font-size="${tagSize}" font-weight="500">
    <tspan fill="${BLUE}">Build.</tspan><tspan fill="#ffffff"> Market.</tspan><tspan fill="${EMERALD}"> Grow.</tspan>
  </text>` : ''}
</svg>`;
}

type ExportSpec = { name: string; svg: string; out: string; width: number; height: number };

const exports: ExportSpec[] = [
  {
    name: 'nav-dark',
    svg: wordmarkSvg(240, 48, { compact: false }),
    out: join(ROOT, 'brand/bridge-it-park-logo-nav-dark.png'),
    width: 480,
    height: 96,
  },
  {
    name: 'nav-sm-dark',
    svg: wordmarkSvg(180, 36, { compact: true }),
    out: join(ROOT, 'brand/bridge-it-park-logo-nav-sm-dark.png'),
    width: 360,
    height: 72,
  },
  {
    name: 'footer-dark',
    svg: wordmarkSvg(280, 64, { tagline: true }),
    out: join(ROOT, 'brand/bridge-it-park-logo-footer-dark.png'),
    width: 560,
    height: 128,
  },
  {
    name: 'auth-dark',
    svg: wordmarkSvg(320, 112, { tagline: true }),
    out: join(ROOT, 'brand/bridge-it-park-logo-auth-dark.png'),
    width: 640,
    height: 224,
  },
  {
    name: 'mark-dark',
    svg: markSvg(48),
    out: join(ROOT, 'icons/bridge-it-park-mark-dark.png'),
    width: 96,
    height: 96,
  },
  {
    name: 'full-dark',
    svg: wordmarkSvg(280, 80, { tagline: true }),
    out: join(ROOT, 'brand/bridge-it-park-logo-transparent-dark.png'),
    width: 560,
    height: 160,
  },
];

mkdirSync(TMP, { recursive: true });

for (const spec of exports) {
  const svgPath = join(TMP, `${spec.name}.svg`);
  writeFileSync(svgPath, spec.svg);
  execSync(
    `convert -background none -density 192 "${svgPath}" -resize ${spec.width}x${spec.height} PNG32:"${spec.out}"`,
    { stdio: 'inherit' }
  );
  console.log('Wrote', spec.out);
}

rmSync(TMP, { recursive: true, force: true });
console.log('Dark logo assets generated.');
