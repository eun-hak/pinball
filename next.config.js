/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // App Router 사용 (pages 디렉토리 무시)
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Canvas와 같은 클라이언트 사이드 기능을 위해
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // 이미지 최적화 설정
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { isServer }) => {
    // roulette-main 폴더 제외 (참고용 코드)
    // src/pages 폴더는 컴포넌트 폴더이므로 페이지로 인식하지 않도록 제외
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**', '**/roulette-main/**', '**/src/pages/**'],
    };
    
    // src/pages를 페이지로 인식하지 않도록 설정
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
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

