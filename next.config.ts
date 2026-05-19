import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid stale dev overlay issues when the .next cache gets out of sync
  devIndicators: false,
};

export default nextConfig;
