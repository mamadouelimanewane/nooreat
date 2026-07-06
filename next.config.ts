import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "loremflickr.com" },
      { protocol: "https", hostname: "*.staticflickr.com" },
    ],
    qualities: [55, 60, 75],
  },
};

export default nextConfig;
