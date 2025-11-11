import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Generate a fully static export (creates /out folder on build)
  output: "export",

  // Disable Next.js image optimization since static export doesn’t support it
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },

  // Optional but recommended for clean static builds
  reactStrictMode: true,
  trailingSlash: true, // ensures all routes export cleanly as /path/index.html
};

export default nextConfig;
