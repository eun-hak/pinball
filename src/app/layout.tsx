import type { Metadata, Viewport } from "next";
import "@/index.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://spinsnap-arcade.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SpinSnap Arcade - 무료 온라인 물리 엔진 게임",
    template: "%s | SpinSnap Arcade",
  },
  description:
    "물리 엔진으로 구현된 다양한 인터랙티브 게임을 즐겨보세요. 플링코, 마블 레이스, 서바이벌, 컬러 컨퀘스트까지! 브라우저에서 바로 즐기는 무료 온라인 게임.",
  keywords: [
    "핀볼게임",
    "플링코",
    "플링코게임",
    "무료게임",
    "온라인게임",
    "브라우저게임",
    "물리게임",
    "인터랙티브게임",
    "마블레이스",
    "서바이벌게임",
    "컬러게임",
    "확률게임",
    "SpinSnap",
    "SpinSnap Arcade",
    "웹게임",
    "HTML5게임",
    "캐주얼게임",
    "무료 브라우저게임",
  ],
  authors: [{ name: "SpinSnap Arcade Team", url: siteUrl }],
  creator: "SpinSnap Arcade",
  publisher: "SpinSnap Arcade",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "SpinSnap Arcade",
    title: "SpinSnap Arcade - 무료 온라인 물리 엔진 게임",
    description:
      "물리 엔진으로 구현된 다양한 인터랙티브 게임을 즐겨보세요. 플링코, 마블 레이스, 서바이벌, 컬러 컨퀘스트까지!",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "SpinSnap Arcade - 무료 온라인 게임",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpinSnap Arcade - 무료 온라인 물리 엔진 게임",
    description:
      "물리 엔진으로 구현된 다양한 인터랙티브 게임을 즐겨보세요. 플링코, 마블 레이스, 서바이벌, 컬러 컨퀘스트까지!",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      // PNG 파일들은 선택사항입니다. 생성하려면 generate-icons.sh 스크립트를 실행하세요.
      // { url: "/favicon.ico", sizes: "any" },
      // { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      // { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    // Apple Touch Icon도 선택사항입니다.
    // apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
  category: "games",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="bg-black">
      <head>
        <link rel="canonical" href={siteUrl} />
      </head>
      <body className="antialiased bg-black">
        {children}
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SpinSnap Arcade",
              url: siteUrl,
              description:
                "물리 엔진으로 구현된 다양한 인터랙티브 게임을 즐겨보세요. 플링코, 마블 레이스, 서바이벌, 컬러 컨퀘스트까지!",
              inLanguage: "ko-KR",
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/?s={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "SpinSnap Arcade",
              url: siteUrl,
              applicationCategory: "GameApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
              },
              description:
                "물리 엔진으로 구현된 다양한 인터랙티브 게임을 즐겨보세요. 플링코, 마블 레이스, 서바이벌, 컬러 컨퀘스트까지!",
              browserRequirements: "Requires JavaScript. Requires HTML5.",
              inLanguage: "ko-KR",
            }),
          }}
        />
      </body>
    </html>
  );
}
