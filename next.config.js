/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Canvas와 같은 클라이언트 사이드 기능을 위해
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // 이미지 최적화 설정
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { isServer }) => {
    // box2d-wasm이 Node.js 모듈을 참조하지 않도록 설정
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig

