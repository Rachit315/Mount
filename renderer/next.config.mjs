/** @type {import('next').NextConfig} */
const isVercel = process.env.VERCEL === '1';

const nextConfig = {
  ...(isVercel ? {} : { output: 'export' }),
  env: {
    // Web analytics run on the hosted site only. The Electron build is a
    // static export of this same app and promises zero telemetry, so the
    // beacon must not ship with it.
    NEXT_PUBLIC_ENABLE_ANALYTICS: isVercel ? '1' : '0',
  },
  images: {
    unoptimized: true,
  },
  webpack(config) {
    if (!isVercel) {
      // Resolve the analytics module to an empty stub for the Electron export
      // so its beacon URL never even reaches the bundle. The JSX that would
      // use it is already behind a false flag, so nothing reads the binding.
      config.resolve.alias['@vercel/analytics/next'] = false;
    }
    return config;
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
                'https://github.com/Rachit315/Mount/releases/latest/download/Mount-Windows-x64.zip',
              permanent: false,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
