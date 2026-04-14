/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

// Deploy targets:
//   - GitHub Pages project site: DEPLOY_TARGET=pages  -> static export + /rcees-website basePath
//   - Vercel / any root domain:  DEPLOY_TARGET=vercel -> standard Next.js build, no basePath
//   - Local dev: unset -> standard Next.js dev server
const target = process.env.DEPLOY_TARGET || (isProd ? "pages" : "dev");
const isPages = target === "pages";
const basePath = isPages ? "/rcees-website" : "";

const nextConfig = {
  ...(isPages ? { output: "export" } : {}),
  basePath,
  assetPrefix: basePath || undefined,
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
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
