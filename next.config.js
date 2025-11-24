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
}

module.exports = nextConfig

