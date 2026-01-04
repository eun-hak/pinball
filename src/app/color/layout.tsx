import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://plentyarcade.com";

export const metadata: Metadata = {
  title: "Color Conquest 게임",
  description:
    "공을 굴려 가장 많은 땅을 색칠하세요. 물리 엔진 기반의 치열한 영토 전쟁 게임을 무료로 플레이하세요!",
  keywords: [
    "컬러컨퀘스트",
    "영토게임",
    "전략게임",
    "무료게임",
    "컬러게임",
    "color conquest",
    "색칠게임",
    "영역차지게임",
    "온라인전략게임",
    "물리게임",
  ],
  openGraph: {
    title: "Color Conquest 게임 - PlentyArcade",
    description: "공을 굴려 가장 많은 땅을 색칠하세요. 치열한 영토 전쟁 게임!",
    type: "website",
    url: `${siteUrl}/color`,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Color Conquest 게임",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Conquest 게임 - PlentyArcade",
    description: "공을 굴려 가장 많은 땅을 색칠하세요. 치열한 영토 전쟁!",
  },
  alternates: {
    canonical: `${siteUrl}/color`,
  },
};

export default function ColorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: '컬러 컨퀘스트 (Color Conquest)',
    description: '공을 굴려 가장 많은 땅을 색칠하세요. 물리 엔진 기반의 치열한 영토 전쟁 게임',
    genre: 'Strategy',
    url: `${siteUrl}/color`,
    playMode: 'MultiPlayer',
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
