/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable static exports if needed
  // output: 'export',
  
  // Webpack configuration for backend compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude better-sqlite3 from client bundle
      config.externals.push('better-sqlite3');
    }
    return config;
  },
  
  // API rewrites to proxy backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/:path*',
      },
    ];
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  },
};

module.exports = nextConfig;

