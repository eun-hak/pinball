import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// 게임 컴포넌트만 클라이언트에서 로드 (ssr: false로 hydration 에러 방지)
const PlinkoPageClient = dynamic(() => import('./client').then(mod => ({ default: mod.PlinkoPageClient })), {
  ssr: false
})

export const metadata = {
  title: '플링코 게임 - SpinSnap Arcade',
  description: '공을 떨어뜨려 행운을 시험하세요. 고전적인 확률 게임 플링코를 무료로 플레이하세요!',
  keywords: '플링코, 플링코게임, 확률게임, 무료게임, 핀볼게임',
  openGraph: {
    title: '플링코 게임 - SpinSnap Arcade',
    description: '공을 떨어뜨려 행운을 시험하세요. 고전적인 확률 게임',
    type: 'website',
  },
}

// SEO를 위한 정적 콘텐츠 - 서버에서 렌더링됨
function PlinkoPageContent() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation 영역 */}
      <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                <div className="size-6 bg-white rounded"></div>
              </div>
              <h1 className="text-2xl text-white">
                Spin<span className="text-cyan-400">Snap</span>
              </h1>
            </div>
          </div>
        </div>
      </nav>
      
      {/* 게임 설명 및 UI 구조 - 검색 엔진이 볼 수 있는 콘텐츠 */}
      <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
        <div className="flex items-center justify-between w-full max-w-4xl">
          <div className="text-white">
            <h2 className="text-2xl mb-2">🎯 플링코 게임</h2>
            <div className="flex gap-8">
              <div>
                <span className="text-gray-400">점수:</span>
                <span className="ml-2 text-2xl text-yellow-400">0</span>
              </div>
              <div>
                <span className="text-gray-400">공 개수:</span>
                <span className="ml-2 text-xl">0</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="w-[800px] h-[900px] border border-gray-700 rounded-lg shadow-2xl bg-gray-900/50 flex items-center justify-center">
            <p className="text-gray-400">게임 로딩 중...</p>
          </div>
        </div>
        <div className="text-gray-400 text-center max-w-2xl">
          <p>공이 떨어지면서 페그에 부딪히며 슬롯에 도착합니다.</p>
          <p>골인 직전에는 공이 확대되며 긴장감을 더합니다! 🎯</p>
        </div>
      </div>
    </div>
  )
}

export default function PlinkoPage() {
  return (
    <Suspense fallback={<PlinkoPageContent />}>
      <PlinkoPageClient />
    </Suspense>
  )
}
