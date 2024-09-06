/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
