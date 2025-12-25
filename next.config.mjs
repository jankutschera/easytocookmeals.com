/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
      },
    ],
  },
  async redirects() {
    return [
      // Preserve SEO value from backlinks - original link party page
      {
        source: '/cunning-ladies-friday-party',
        destination: '/',
        permanent: true,
      },
      {
        source: '/cunning-ladies-friday-party/',
        destination: '/',
        permanent: true,
      },
      // WordPress recipe URL redirects to new paths
      {
        source: '/healthy-vegan-oreos',
        destination: '/recipe/vegan-oreos',
        permanent: true,
      },
      {
        source: '/healthy-vegan-oreos/',
        destination: '/recipe/vegan-oreos',
        permanent: true,
      },
      {
        source: '/vegan-mozarella',
        destination: '/recipe/vegan-mozzarella',
        permanent: true,
      },
      {
        source: '/vegan-mozarella/',
        destination: '/recipe/vegan-mozzarella',
        permanent: true,
      },
      {
        source: '/on-the-go-breakfast-overnight-oatmeal',
        destination: '/recipe/overnight-oatmeal',
        permanent: true,
      },
      {
        source: '/on-the-go-breakfast-overnight-oatmeal/',
        destination: '/recipe/overnight-oatmeal',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
