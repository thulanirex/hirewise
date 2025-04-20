import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true
  },
  react: {
    strict: false
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
