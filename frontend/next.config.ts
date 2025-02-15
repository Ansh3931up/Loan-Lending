/** @type {import('next').NextConfig} */
import path from 'path'

const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  output: 'standalone',
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['sharp']
  }
}

export default nextConfig
