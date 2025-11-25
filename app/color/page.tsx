import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// 게임 컴포넌트만 클라이언트에서 로드 (ssr: false로 hydration 에러 방지)
const ColorPageClient = dynamic(() => import('./client').then(mod => ({ default: mod.ColorPageClient })), {
  ssr: false
})

export const metadata = {
  title: 'Color Conquest 게임 - SpinSnap Arcade',
  description: '공을 굴려 가장 많은 땅을 색칠하세요. 치열한 영토 전쟁 게임!',
  keywords: '컬러컨퀘스트, 영토게임, 전략게임, 무료게임, 컬러게임',
  openGraph: {
    title: 'Color Conquest 게임 - SpinSnap Arcade',
    description: '공을 굴려 가장 많은 땅을 색칠하세요. 치열한 영토 전쟁!',
    type: 'website',
  },
}

// SEO를 위한 정적 콘텐츠 - 서버에서 렌더링됨
function ColorPageContent() {
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
        <div className="w-80 space-y-6">
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                🎨 Color Conquest
              </h3>
              <div className="text-2xl font-mono text-white">
                60s
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              <p>팀을 추가하고 영토 전쟁을 시작하세요!</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-sm text-gray-400">
            <div className="flex items-center gap-2 mb-2 text-white font-bold">
              ⚡ 게임 팁
            </div>
            <p>화면을 클릭하여 충격파를 일으키세요!</p>
            <p className="mt-1">공들이 멈추면 클릭해서 다시 굴려야 땅을 더 많이 칠할 수 있습니다.</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-950/50 rounded-xl border border-gray-800 shadow-2xl p-4">
          <div className="w-[800px] h-[800px] bg-gray-900 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">게임 로딩 중...</p>
          </div>
        </div>
      </div>
      
      <div className="text-gray-400 text-center p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl text-white mb-4">🎨 Color Conquest 게임</h2>
        <p className="mb-2">공을 굴려 가장 많은 땅을 색칠하세요.</p>
        <p>치열한 영토 전쟁 게임에서 승리하세요!</p>
      </div>
    </div>
  )
}

export default function ColorPage() {
  return (
    <Suspense fallback={<ColorPageContent />}>
      <ColorPageClient />
    </Suspense>
  )
}
