import type {NextConfig} from 'next';

// Check if we're building for export
const isExport = process.env.EXPORT_BUILD === 'true';

const nextConfig: NextConfig = {
  /* config options here */
  ...(isExport && {
    output: 'export',
    distDir: 'out'
  }),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    ...(isExport ? { unoptimized: true } : {}),
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;