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
  // Copy SMS gaming files to the output directory
  async rewrites() {
    return [
      {
        source: '/sms-gaming/:path*',
        destination: '/sms-gaming/:path*',
      },
    ];
  },
  // Include SMS gaming files in the build
  distDir: '.next',
  generateBuildId: async () => {
    return 'sms-gaming-build';
  },
};

module.exports = nextConfig;