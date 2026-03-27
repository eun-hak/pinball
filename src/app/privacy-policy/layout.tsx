import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "PlentyArcade 개인정보처리방침. 쿠키, 광고(AdSense), 보관 항목 및 문의처 안내.",
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  openGraph: {
    title: "개인정보처리방침 | PlentyArcade",
    url: `${siteUrl}/privacy-policy`,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
