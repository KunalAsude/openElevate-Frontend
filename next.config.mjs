/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['avatars.githubusercontent.com'],
    },
    experimental: {
      serverActions: {
        allowedOrigins: ['localhost:3000'],
      },
    },
  };
  
  export default nextConfig;
  