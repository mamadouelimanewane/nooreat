import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "*.postimg.cc" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    qualities: [55, 60, 70, 75],
  },
};

export default nextConfig;
