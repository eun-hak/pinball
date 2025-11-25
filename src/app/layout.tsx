import type { Metadata, Viewport } from "next";
import "@/index.css";

export const metadata: Metadata = {
  title: "SpinSnap Arcade - 무료 온라인 핀볼 게임",
  description:
    "물리 엔진으로 구현된 다양한 인터랙티브 게임을 즐겨보세요. 플링코, 레이스, 서바이벌, 컬러 컨퀘스트까지!",
  keywords:
    "핀볼게임, 플링코, 무료게임, 온라인게임, 브라우저게임, 물리게임, 인터랙티브게임",
  authors: [{ name: "SpinSnap Arcade" }],
  openGraph: {
    title: "SpinSnap Arcade - 무료 온라인 핀볼 게임",
    description: "물리 엔진으로 구현된 다양한 인터랙티브 게임을 즐겨보세요",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpinSnap Arcade - 무료 온라인 핀볼 게임",
    description: "물리 엔진으로 구현된 다양한 인터랙티브 게임을 즐겨보세요",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="bg-black">
      <body className="antialiased bg-black">{children}</body>
    </html>
  );
}
