import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// 게임 컴포넌트만 클라이언트에서 로드 (ssr: false로 hydration 에러 방지)
const SurvivalPageClient = dynamic(() => import('./client').then(mod => ({ default: mod.SurvivalPageClient })), {
  ssr: false
})

export const metadata = {
  title: '서바이벌 게임 - SpinSnap Arcade',
  description: '폭탄과 자기장을 피해 마지막까지 살아남으세요. 배틀로얄 스타일의 서바이벌 게임!',
  keywords: '서바이벌게임, 배틀로얄, 생존게임, 무료게임, 전략게임',
  openGraph: {
    title: '서바이벌 게임 - SpinSnap Arcade',
    description: '폭탄과 자기장을 피해 마지막까지 살아남으세요',
    type: 'website',
  },
}

// SEO를 위한 정적 콘텐츠 - 서버에서 렌더링됨
function SurvivalPageContent() {
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
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              💣 서바이벌 참가자
            </h3>
            <div className="text-gray-400 text-sm">
              <p>참가자를 추가하고 생존 게임을 시작하세요!</p>
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-sm text-gray-400">
            <div className="flex items-center gap-2 mb-2 text-white font-bold">
              💣 게임 규칙
            </div>
            <ul className="list-disc list-inside space-y-1">
              <li>폭탄을 피해 안전 구역에 머무르세요.</li>
              <li>안전 구역(파란 원) 밖으로 나가면 탈락합니다.</li>
              <li>마지막까지 살아남는 플레이어가 승리합니다.</li>
            </ul>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-950/50 rounded-xl border border-gray-800 shadow-2xl p-4">
          <div className="w-[800px] h-[800px] rounded-full bg-gray-900 flex items-center justify-center">
            <p className="text-gray-400">게임 로딩 중...</p>
          </div>
        </div>
      </div>
      
      <div className="text-gray-400 text-center p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl text-white mb-4">💣 서바이벌 게임</h2>
        <p className="mb-2">폭탄과 자기장을 피해 마지막까지 살아남으세요.</p>
        <p>배틀로얄 스타일의 치열한 생존 게임입니다!</p>
      </div>
    </div>
  )
}

export default function SurvivalPage() {
  return (
    <Suspense fallback={<SurvivalPageContent />}>
      <SurvivalPageClient />
    </Suspense>
  )
}
