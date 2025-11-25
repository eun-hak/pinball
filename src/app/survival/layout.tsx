import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://spinsnap-arcade.com";

export const metadata: Metadata = {
  title: "서바이벌 게임",
  description:
    "폭탄과 자기장을 피해 마지막까지 살아남으세요. 물리 엔진 기반의 스릴 넘치는 배틀로얄 게임을 무료로 플레이하세요!",
  keywords: [
    "서바이벌게임",
    "배틀로얄",
    "생존게임",
    "무료게임",
    "전략게임",
    "survival game",
    "온라인서바이벌",
    "브라우저배틀로얄",
    "멀티플레이어게임",
    "핀볼서바이벌",
  ],
  openGraph: {
    title: "서바이벌 게임 - SpinSnap Arcade",
    description:
      "폭탄과 자기장을 피해 마지막까지 살아남으세요. 배틀로얄 스타일의 서바이벌 게임!",
    type: "website",
    url: `${siteUrl}/survival`,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "서바이벌 게임",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "서바이벌 게임 - SpinSnap Arcade",
    description: "폭탄과 자기장을 피해 마지막까지 살아남으세요",
  },
  alternates: {
    canonical: `${siteUrl}/survival`,
  },
};

export default function SurvivalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
