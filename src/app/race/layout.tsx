import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://spinsnap-arcade.com";

export const metadata: Metadata = {
  title: '마블 레이스 게임',
  description: '장애물을 피해 가장 먼저 결승선에 도착하는 구슬은 누구일까요? 물리 엔진 기반의 스릴 넘치는 마블 레이스 게임을 무료로 플레이하세요!',
  keywords: [
    '레이스게임',
    '마블레이스',
    '장애물게임',
    '무료게임',
    '경주게임',
    'marble race',
    '구슬경주',
    '핀볼레이스',
    '온라인레이스게임',
  ],
  openGraph: {
    title: '마블 레이스 게임 - SpinSnap Arcade',
    description: '장애물을 피해 가장 먼저 결승선에 도착하는 구슬은 누구일까요? 마블 레이스 게임을 플레이하세요!',
    type: 'website',
    url: `${siteUrl}/race`,
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: '마블 레이스 게임',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '마블 레이스 게임 - SpinSnap Arcade',
    description: '장애물을 피해 가장 먼저 결승선에 도착하는 구슬은 누구일까요?',
  },
  alternates: {
    canonical: `${siteUrl}/race`,
  },
}

export default function RaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: '마블 레이스 (Marble Race)',
    description: '장애물을 피해 가장 먼저 결승선에 도착하는 구슬은 누구일까요? 물리 엔진 기반의 스릴 넘치는 마블 레이스 게임',
    genre: 'Racing',
    url: `${siteUrl}/race`,
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    inLanguage: 'ko-KR',
    author: {
      '@type': 'Organization',
      name: 'SpinSnap Arcade',
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
