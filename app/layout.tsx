import type { Metadata } from 'next';
import { Inter, Poppins, Noto_Sans_Bengali, Caveat } from 'next/font/google';
import { AppShell } from '@/components/layout/AppShell';
import { getMainMarketplaceCategoriesForUi } from '@/lib/catalog/marketplaceNav';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { JsonLd } from '@/components/layout/JsonLd';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { TopLoader } from '@/components/navigation/TopLoader';
import { rootMetadata } from '@/lib/metadata';
import { organizationJsonLd, websiteJsonLd } from '@/lib/structured-data';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-bengali',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-caveat',
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
      className={`${inter.variable} ${poppins.variable} ${notoSansBengali.variable} ${caveat.variable}`}
    >
      <body className="font-sans antialiased bg-background text-text-primary">
        <ThemeProvider>
          <TopLoader />
          <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
          <AppShell categories={categories} authProfile={authProfile}>
            {children}
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
