/**
 * Generate transparent hero assets: ecommerce storefront + software dashboard + mobile.
 * Usage: npx tsx scripts/generate-platform-hero-assets.ts
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.join(process.cwd(), 'public/assets/hero');

function desktopSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1012" viewBox="0 0 1800 1012">
  <defs>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="#0f172a" flood-opacity="0.22"/>
    </filter>
    <linearGradient id="storeHero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#dbeafe"/>
      <stop offset="100%" stop-color="#fef3c7"/>
    </linearGradient>
    <linearGradient id="dashBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>
  <rect width="1800" height="1012" fill="transparent"/>

  <!-- LEFT / CENTER: Ecommerce storefront browser -->
  <g filter="url(#soft)">
    <rect x="60" y="140" width="920" height="620" rx="22" fill="#0f172a"/>
    <rect x="76" y="172" width="888" height="568" rx="12" fill="#ffffff"/>
    <circle cx="100" cy="156" r="6" fill="#f87171"/>
    <circle cx="122" cy="156" r="6" fill="#fbbf24"/>
    <circle cx="144" cy="156" r="6" fill="#34d399"/>
    <rect x="180" y="146" width="420" height="20" rx="10" fill="#1e293b"/>
    <text x="200" y="161" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" fill="#94a3b8">fashion.store — Premium E-commerce</text>

    <rect x="76" y="172" width="888" height="120" fill="url(#storeHero)"/>
    <text x="110" y="230" font-family="Georgia,serif" font-size="34" font-weight="700" fill="#0f2744">Summer Collection</text>
    <text x="110" y="262" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" fill="#475569">Premium storefront for your brand</text>
    <rect x="110" y="278" width="130" height="32" rx="8" fill="#2563eb"/>
    <text x="175" y="299" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="600" fill="#ffffff">Shop Now</text>

    ${[0, 1, 2, 3]
      .map((i) => {
        const x = 110 + i * 200;
        return `
          <rect x="${x}" y="360" width="180" height="220" rx="14" fill="#f8fafc" stroke="#e2e8f0"/>
          <rect x="${x + 14}" y="374" width="152" height="120" rx="10" fill="${i % 2 ? '#bfdbfe' : '#fde68a'}"/>
          <text x="${x + 24}" y="522" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="600" fill="#0f172a">Product ${i + 1}</text>
          <text x="${x + 24}" y="546" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" fill="#64748b">৳${(1200 + i * 350).toLocaleString()}</text>
        `;
      })
      .join('')}
  </g>

  <!-- SECOND DEVICE: Enterprise software dashboard -->
  <g filter="url(#soft)">
    <rect x="820" y="220" width="720" height="480" rx="18" fill="#0f172a"/>
    <rect x="834" y="248" width="692" height="436" rx="10" fill="url(#dashBg)"/>
    <rect x="834" y="248" width="160" height="436" fill="#0f2744"/>
    <text x="854" y="282" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="800" fill="#f8fafc">Software Suite</text>
    ${['Dashboard', 'Orders', 'Inventory', 'CRM', 'Reports', 'Settings']
      .map((n, i) => `<text x="854" y="${320 + i * 36}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" fill="#94a3b8">${n}</text>`)
      .join('')}
    <text x="1020" y="286" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="16" font-weight="700" fill="#0f172a">Operations Dashboard</text>
    ${[0, 1, 2]
      .map((i) => {
        const x = 1020 + i * 160;
        return `
          <rect x="${x}" y="310" width="148" height="78" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
          <text x="${x + 14}" y="338" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" fill="#64748b">${['Sales', 'Stock', 'Leads'][i]}</text>
          <text x="${x + 14}" y="368" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22" font-weight="800" fill="#0f2744">${['৳4.2L', '1,284', '86'][i]}</text>
        `;
      })
      .join('')}
    <rect x="1020" y="410" width="470" height="240" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="1040" y="442" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="700" fill="#0f172a">Weekly performance</text>
    ${[40, 70, 55, 90, 65, 100, 78]
      .map((h, i) => {
        const x = 1050 + i * 58;
        return `<rect x="${x}" y="${620 - h}" width="30" height="${h}" rx="6" fill="#2563eb" opacity="${0.45 + i * 0.07}"/>`;
      })
      .join('')}
  </g>

  <!-- MOBILE: Business app / ecommerce mobile -->
  <g filter="url(#soft)">
    <rect x="1520" y="300" width="220" height="460" rx="32" fill="#0f172a"/>
    <rect x="1532" y="320" width="196" height="420" rx="24" fill="#f8fafc"/>
    <rect x="1532" y="320" width="196" height="64" fill="#2563eb"/>
    <text x="1630" y="358" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="700" fill="#ffffff">Business App</text>
    ${['Orders', 'Catalog', 'Customers', 'Reports']
      .map((m, i) => {
        const y = 410 + i * 70;
        return `
          <rect x="1550" y="${y}" width="160" height="52" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
          <text x="1630" y="${y + 32}" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="600" fill="#0f172a">${m}</text>
        `;
      })
      .join('')}
  </g>
</svg>`;
}

function mobileSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100">
  <defs>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.22"/>
    </filter>
    <linearGradient id="storeHero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#dbeafe"/>
      <stop offset="100%" stop-color="#fef3c7"/>
    </linearGradient>
  </defs>
  <rect width="900" height="1100" fill="transparent"/>

  <!-- Storefront card -->
  <g filter="url(#soft)">
    <rect x="40" y="60" width="520" height="420" rx="20" fill="#0f172a"/>
    <rect x="52" y="86" width="496" height="378" rx="12" fill="#ffffff"/>
    <rect x="52" y="86" width="496" height="100" fill="url(#storeHero)"/>
    <text x="76" y="140" font-family="Georgia,serif" font-size="24" font-weight="700" fill="#0f2744">Your Store</text>
    <text x="76" y="168" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" fill="#475569">Premium e-commerce website</text>
    ${[0, 1]
      .map((i) => {
        const x = 76 + i * 220;
        return `
          <rect x="${x}" y="220" width="200" height="200" rx="14" fill="#f8fafc" stroke="#e2e8f0"/>
          <rect x="${x + 16}" y="236" width="168" height="110" rx="10" fill="${i ? '#bfdbfe' : '#fde68a'}"/>
          <text x="${x + 24}" y="380" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="600" fill="#0f172a">Product ${i + 1}</text>
        `;
      })
      .join('')}
  </g>

  <!-- Software dashboard card -->
  <g filter="url(#soft)">
    <rect x="280" y="420" width="560" height="360" rx="18" fill="#0f172a"/>
    <rect x="294" y="446" width="532" height="318" rx="10" fill="#f8fafc"/>
    <rect x="294" y="446" width="130" height="318" fill="#0f2744"/>
    <text x="310" y="478" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="800" fill="#f8fafc">Software</text>
    ${['Dashboard', 'POS', 'CRM', 'HR']
      .map((n, i) => `<text x="310" y="${510 + i * 34}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" fill="#94a3b8">${n}</text>`)
      .join('')}
    <text x="450" y="482" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="15" font-weight="700" fill="#0f172a">Business Dashboard</text>
    ${[0, 1]
      .map((i) => {
        const x = 450 + i * 170;
        return `
          <rect x="${x}" y="510" width="156" height="70" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
          <text x="${x + 14}" y="538" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" fill="#64748b">${['Sales', 'Orders'][i]}</text>
          <text x="${x + 14}" y="564" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="20" font-weight="800" fill="#0f2744">${['৳2.1L', '148'][i]}</text>
        `;
      })
      .join('')}
    <rect x="450" y="600" width="340" height="130" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
    ${[35, 60, 48, 80, 55]
      .map((h, i) => `<rect x="${480 + i * 55}" y="${700 - h}" width="28" height="${h}" rx="5" fill="#2563eb" opacity="0.55"/>`)
      .join('')}
  </g>

  <!-- Phone -->
  <g filter="url(#soft)">
    <rect x="60" y="560" width="200" height="420" rx="28" fill="#0f172a"/>
    <rect x="72" y="578" width="176" height="384" rx="20" fill="#f8fafc"/>
    <rect x="72" y="578" width="176" height="56" fill="#2563eb"/>
    <text x="160" y="612" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="700" fill="#ffffff">Mobile App</text>
    ${['Shop', 'Orders', 'Wallet']
      .map((m, i) => {
        const y = 660 + i * 70;
        return `
          <rect x="90" y="${y}" width="140" height="52" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
          <text x="160" y="${y + 32}" text-anchor="middle" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="600" fill="#0f172a">${m}</text>
        `;
      })
      .join('')}
  </g>
</svg>`;
}

async function writePair(svg: string, baseName: string, width: number) {
  const avif = await sharp(Buffer.from(svg)).resize({ width, withoutEnlargement: true }).avif({ quality: 55, effort: 4 }).toBuffer();
  const webp = await sharp(Buffer.from(svg)).resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
  await writeFile(path.join(OUT, `${baseName}.avif`), avif);
  await writeFile(path.join(OUT, `${baseName}.webp`), webp);
  console.log(`${baseName}.avif ${(avif.length / 1024).toFixed(1)}KB | ${baseName}.webp ${(webp.length / 1024).toFixed(1)}KB`);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await writePair(desktopSvg(), 'hero-platform-showcase', 1800);
  await writePair(mobileSvg(), 'hero-platform-showcase-mobile', 900);
  console.log('Hero platform assets written to', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
