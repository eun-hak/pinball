import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '마블 레이스 게임 - SpinSnap Arcade',
  description: '장애물을 피해 가장 먼저 결승선에 도착하는 구슬은 누구일까요? 마블 레이스 게임을 플레이하세요!',
  keywords: '레이스게임, 마블레이스, 장애물게임, 무료게임, 경주게임',
  openGraph: {
    title: '마블 레이스 게임 - SpinSnap Arcade',
    description: '장애물을 피해 가장 먼저 결승선에 도착하는 구슬은 누구일까요?',
    type: 'website',
  },
}

export default function RaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

