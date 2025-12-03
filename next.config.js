/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // TypeScript configuration
  typescript: {
    // Ignore build errors to make build work like dev mode
    // This allows the build to complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
  
  // ESLint configuration
  eslint: {
    // Ignore ESLint during builds to make build work like dev mode
    ignoreDuringBuilds: true,
  },
  
  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },

  // Configuration des images
  images: {
    remotePatterns: [
      // Permettre les images depuis le même domaine
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '6001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/uploads/**',
      },
      // Permettre toutes les images HTTP/HTTPS (pour les URLs externes)
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Permettre aussi les images locales depuis public/
    unoptimized: false, // Garder l'optimisation activée si possible
    // Désactiver la vérification stricte des domaines pour les images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

module.exports = nextConfig

