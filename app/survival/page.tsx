import dynamic from 'next/dynamic'

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

export default function SurvivalPage() {
  return <SurvivalPageClient />
}
