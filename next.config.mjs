/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io", // Sanity's image CDN
      },
      {
        protocol: "https",
        hostname: "**.supabase.co", // Supabase storage for comment images
      },
    ],
  },
};

export default nextConfig;
