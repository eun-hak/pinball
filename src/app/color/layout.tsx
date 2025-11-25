import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Conquest 게임 - SpinSnap Arcade',
  description: '공을 굴려 가장 많은 땅을 색칠하세요. 치열한 영토 전쟁 게임!',
  keywords: '컬러컨퀘스트, 영토게임, 전략게임, 무료게임, 컬러게임',
  openGraph: {
    title: 'Color Conquest 게임 - SpinSnap Arcade',
    description: '공을 굴려 가장 많은 땅을 색칠하세요. 치열한 영토 전쟁!',
    type: 'website',
  },
}

export default function ColorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

