import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
    ],
  },
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
};

export default nextConfig;
