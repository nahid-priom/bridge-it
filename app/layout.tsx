import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { AppShell } from '@/components/layout/AppShell';
import { GoogleTagManager } from '@/components/analytics/GoogleTagManager';
import { MicrosoftClarity } from '@/components/analytics/MicrosoftClarity';
import { getMainMarketplaceCategoriesForUi } from '@/lib/catalog/marketplaceNav';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { JsonLd } from '@/components/layout/JsonLd';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { TopLoader } from '@/components/navigation/TopLoader';
import { rootMetadata } from '@/lib/metadata';
import { organizationJsonLd, websiteJsonLd } from '@/lib/structured-data';
import { ShowcaseQueryProvider } from '@/src/features/ecommerce-showcase/components/QueryProvider';
import './globals.css';

const inter = localFont({
  src: '../src/fonts/inter/inter-latin-wght-normal.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
});

const poppins = localFont({
  src: [
    { path: '../src/fonts/poppins/poppins-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../src/fonts/poppins/poppins-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../src/fonts/poppins/poppins-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../src/fonts/poppins/poppins-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: '../src/fonts/poppins/poppins-latin-900-normal.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-poppins',
  display: 'swap',
});

const notoSansBengali = localFont({
  src: [
    {
      path: '../src/fonts/noto-sans-bengali/noto-sans-bengali-bengali-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../src/fonts/noto-sans-bengali/noto-sans-bengali-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../src/fonts/noto-sans-bengali/noto-sans-bengali-bengali-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../src/fonts/noto-sans-bengali/noto-sans-bengali-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../src/fonts/noto-sans-bengali/noto-sans-bengali-bengali-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../src/fonts/noto-sans-bengali/noto-sans-bengali-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../src/fonts/noto-sans-bengali/noto-sans-bengali-bengali-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../src/fonts/noto-sans-bengali/noto-sans-bengali-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../src/fonts/noto-sans-bengali/noto-sans-bengali-bengali-900-normal.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../src/fonts/noto-sans-bengali/noto-sans-bengali-latin-900-normal.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-noto-bengali',
  display: 'swap',
});

export const metadata: Metadata = rootMetadata;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, authProfile] = [
    getMainMarketplaceCategoriesForUi(),
    await getCurrentProfile(),
  ] as const;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${notoSansBengali.variable}`}
    >
      <body className="font-sans antialiased bg-background text-text-primary">
        <GoogleTagManager />
        <MicrosoftClarity />
        <ThemeProvider>
          <ShowcaseQueryProvider>
          <TopLoader />
          <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
          <AppShell categories={categories} authProfile={authProfile}>
            {children}
          </AppShell>
          </ShowcaseQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
