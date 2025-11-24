import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // REMOVE this line to enable API routes and server functionality
  // output: "export",

  // Keep image optimization enabled
  images: {
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

  // Optional configurations
  reactStrictMode: true,
  // Remove trailingSlash or set to false for dynamic routes
  trailingSlash: false,
};

export default nextConfig;