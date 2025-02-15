import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: [], // Add any image domains you want to allow
  },
  env: {
    // Add your environment variables here
  }
};

export default nextConfig;
