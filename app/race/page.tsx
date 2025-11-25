import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// 게임 컴포넌트만 클라이언트에서 로드 (ssr: false로 hydration 에러 방지)
const RacePageClient = dynamic(() => import('./client').then(mod => ({ default: mod.RacePageClient })), {
  ssr: false
})

export const metadata = {
  title: '마블 레이스 게임 - SpinSnap Arcade',
  description: '장애물을 피해 가장 먼저 결승선에 도착하는 구슬은 누구일까요? 마블 레이스 게임을 플레이하세요!',
  keywords: '레이스게임, 마블레이스, 장애물게임, 무료게임, 경주게임',
  openGraph: {
    title: '마블 레이스 게임 - SpinSnap Arcade',
    description: '장애물을 피해 가장 먼저 결승선에 도착하는 구슬은 누구일까요?',
    type: 'website',
  },
}

// SEO를 위한 정적 콘텐츠 - 서버에서 렌더링됨
function RacePageContent() {
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
      <div className="flex gap-6 p-8 min-h-screen">
        <div className="w-80 flex-shrink-0 flex flex-col gap-6">
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              🏁 참가자 설정
            </h3>
            <div className="text-gray-400 text-sm">
              <p>참가자를 추가하고 레이스를 시작하세요!</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 h-full flex justify-center items-center">
          <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-8 shadow-2xl">
            <div className="w-[1000px] h-[4000px] bg-gray-900 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">게임 로딩 중...</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-gray-400 text-center p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl text-white mb-4">🏁 마블 레이스 게임</h2>
        <p className="mb-2">장애물을 피해 가장 먼저 결승선에 도착하는 구슬은 누구일까요?</p>
        <p>다양한 장애물과 트랙을 통과하며 경쟁하세요!</p>
      </div>
    </div>
  )
}

export default function RacePage() {
  return (
    <Suspense fallback={<RacePageContent />}>
      <RacePageClient />
    </Suspense>
  )
}
