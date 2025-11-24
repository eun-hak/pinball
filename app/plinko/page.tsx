import dynamic from 'next/dynamic'

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

export default function PlinkoPage() {
  return <PlinkoPageClient />
}
