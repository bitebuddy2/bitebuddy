import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mvbaskfbcsxwrkqziztt.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth avatars
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Sanity CDN images
      }
    ],
    formats: ['image/avif', 'image/webp'], // Modern image formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Smaller icon sizes
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },
  // Enable compression
  compress: true,
  // Optimize production builds
  swcMinify: true,
  // Enable React strict mode for better development
  reactStrictMode: true,
  // Performance optimizations
  poweredByHeader: false, // Remove X-Powered-By header for security
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@sanity/client', 'next-sanity', 'lucide-react'],
  },
  async redirects() {
    return [
      // Pret falafel recipe redirect (already existed)
      {
        source: '/recipes/pret-a-manger-falafel-mezze-salad',
        destination: '/recipes/pret-a-manger-humous-and-falafel-mezze-salad',
        permanent: true, // 301 redirect
      },
      // Spicy chickpea stir-fry redirect to West Cornwall pasty recipe
      {
        source: '/recipes/spicy-chickpea-and-mushroom-stir-fry',
        destination: '/recipes/west-cornwall-spicy-chickpea-roll-pasty',
        permanent: true, // 301 redirect
      },
      // Caprese salad redirect to main recipes page (no similar recipe found)
      {
        source: '/recipes/caprese-salad-with-pesto-and-pine-nuts',
        destination: '/recipes',
        permanent: true, // 301 redirect
      },
      // Malformed URL redirect (bot/crawler issue)
      {
        source: '/$',
        destination: '/',
        permanent: true, // 301 redirect
      },
    ];
  },
};

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the Sentry DSN is publicly accessible before enabling this option.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
};

// Make sure adding Sentry options is the last code to run before exporting
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
