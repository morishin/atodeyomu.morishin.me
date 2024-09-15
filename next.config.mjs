/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: '5mb',
    }
  },
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
