import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Every student and teacher page depends on the session cookie, so pages render per
  // request. Cache Components (on by default in the template) is left off for simplicity.
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  poweredByHeader: false,
};

export default nextConfig;
