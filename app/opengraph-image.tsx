import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BRAND_COLORS } from '@/lib/config/brand-assets';
import { BRANDING } from '@/lib/config/branding';

export const runtime = 'nodejs';
export const alt = 'Bridge IT Park — Build. Market. Grow.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const logoPath = join(process.cwd(), 'public/brand/bridge-it-park-logo-dark.png');
  const logoData = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${BRAND_COLORS.navyDark} 0%, ${BRAND_COLORS.navy} 55%, #132f52 100%)`,
          padding: '48px',
        }}
      >
        <img
          src={logoSrc}
          width={640}
          height={192}
          style={{ objectFit: 'contain', marginBottom: 24 }}
          alt=""
        />
        <div
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: BRAND_COLORS.white,
            letterSpacing: '-0.02em',
            marginBottom: 12,
          }}
        >
          {BRANDING.tagline}
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          Everything Your Business Needs to Go Digital.
        </div>
        <div
          style={{
            marginTop: 32,
            display: 'flex',
            gap: 16,
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          <span style={{ color: '#60a5fa' }}>Build.</span>
          <span style={{ color: BRAND_COLORS.white }}>Market.</span>
          <span style={{ color: BRAND_COLORS.emeraldBright }}>Grow.</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
