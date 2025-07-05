/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // domains: ['placeholder.svg'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
    unoptimized: false,
  },
  // Подключаем native-модуль better-sqlite3 к серверным компонентам
  serverExternalPackages: ['better-sqlite3'],

  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ]
  },
}


export default nextConfig
