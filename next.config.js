/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // TypeScript configuration
  typescript: {
    // Don't ignore build errors - we want to catch type errors in production
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Run ESLint during build (set to false only if you have a separate lint step)
    ignoreDuringBuilds: false,
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

