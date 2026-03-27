import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "서비스 소개",
  description:
    "PlentyArcade — 물리 엔진 기반 무료 웹 게임. 플링코, 마블 레이스, 서바이벌, 컬러 컨퀘스트를 설치 없이 즐기세요.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "서비스 소개 | PlentyArcade",
    url: `${siteUrl}/about`,
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
