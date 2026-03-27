import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "문의하기",
  description:
    "PlentyArcade 문의, 버그 제보, 제휴 문의. 이메일 및 안내를 확인하세요.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "문의하기 | PlentyArcade",
    url: `${siteUrl}/contact`,
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
