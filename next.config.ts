import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true, // ✅ disables dynamic image optimization for static export
  },
};

export default nextConfig;
