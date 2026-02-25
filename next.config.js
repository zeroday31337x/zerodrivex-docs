/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Docs should be fast, cacheable, and predictable
  swcMinify: true,

  // We are NOT sharing routes or rewrites with the main app
  // This is a standalone micro-frontend
  output: 'standalone',

  // Docs are read-heavy; images usually static
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Explicitly allow future MD / MDX if you want it
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // Security-friendly defaults (can harden later)
  poweredByHeader: false,
};

module.exports = nextConfig;
