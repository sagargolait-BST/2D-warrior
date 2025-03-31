/** @type {import('next').NextConfig} */
const nextConfig = {
  // Support static export if needed via env var
  ...(process.env.STATIC_EXPORT === 'true' ? { output: 'export' } : {}),
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'de34i7k6qwgwc.cloudfront.net',
        pathname: '/uploads/img/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        pathname: '/v1/create-qr-code/**',
      }
    ]
  },
  experimental: {
    appDir: true,
    serverActions: true,
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;