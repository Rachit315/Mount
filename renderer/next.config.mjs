/** @type {import('next').NextConfig} */
const isVercel = process.env.VERCEL === '1';

const nextConfig = {
  ...(isVercel ? {} : { output: 'export' }),
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  ...(isVercel
    ? {
        async redirects() {
          return [
            {
              source: '/downloads/Mount-Windows-x64.zip',
              destination:
                'https://github.com/Rachit315/Mount/releases/download/v1.0.0/Mount-Windows-x64.zip',
              permanent: false,
            },
            {
              source: '/downloads/Mount-macOS-arm64.zip',
              destination:
                'https://github.com/Rachit315/Mount/releases/download/v1.0.0/Mount-macOS-arm64.zip',
              permanent: false,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
