/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  env: {
    PRIVATE_KEY: process.env.PRIVATE_KEY,
  },
  assetPrefix: "/dumplings/",
};

module.exports = nextConfig;
