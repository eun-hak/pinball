import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://plentyarcade.com";

export const metadata: Metadata = {
  title: '플링코 게임',
  description: '공을 떨어뜨려 행운을 시험하세요. 고전적인 확률 게임 플링코를 무료로 플레이하세요! 물리 엔진 기반의 리얼한 핀볼 게임 경험.',
  keywords: [
    '플링코',
    '플링코게임',
    '확률게임',
    '무료게임',
    '핀볼게임',
    'plinko',
    'plinko game',
    '온라인플링코',
    '브라우저플링코',
  ],
  openGraph: {
    title: '플링코 게임 - PlentyArcade',
    description: '공을 떨어뜨려 행운을 시험하세요. 고전적인 확률 게임 플링코를 무료로 플레이하세요!',
    type: 'website',
    url: `${siteUrl}/plinko`,
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: '플링코 게임',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '플링코 게임 - PlentyArcade',
    description: '공을 떨어뜨려 행운을 시험하세요. 고전적인 확률 게임',
  },
  alternates: {
    canonical: `${siteUrl}/plinko`,
  },
}

export default function PlinkoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: '플링코 (Plinko)',
    description: '공을 떨어뜨려 행운을 시험하세요. 고전적인 확률 게임 플링코를 무료로 플레이하세요!',
    genre: 'Arcade',
    url: `${siteUrl}/plinko`,
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    inLanguage: 'ko-KR',
    author: {
      '@type': 'Organization',
      name: 'PlentyArcade',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
