/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "rcees.uenr.edu.gh" },
    ],
  },
  trailingSlash: true,
  reactStrictMode: true,
};

module.exports = nextConfig;
