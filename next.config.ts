import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getSupabaseHostname(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const supabaseHostname = getSupabaseHostname();

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      },
      ...(supabaseHostname
        ? [
            {
              protocol: 'https' as const,
              hostname: supabaseHostname,
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
    ],
  },
  async redirects() {
    return [
      { source: '/solutions', destination: '/websites', permanent: false },
      { source: '/solutions/:path*', destination: '/websites', permanent: false },
      { source: '/products', destination: '/websites', permanent: false },
      { source: '/products/:path*', destination: '/websites', permanent: false },
      { source: '/services/:path*', destination: '/websites', permanent: false },
      { source: '/search', destination: '/websites', permanent: false },
      { source: '/search/:path*', destination: '/websites', permanent: false },
      { source: '/services', destination: '/websites', permanent: false },
      { source: '/categories', destination: '/websites', permanent: false },
      { source: '/categories/:path*', destination: '/websites', permanent: false },
    ];
  },
};

export default nextConfig;
