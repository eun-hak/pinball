import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "이용약관",
  description:
    "PlentyArcade 서비스 이용약관. 서비스 제공, 저작권, 면책, 준거법 안내.",
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  openGraph: {
    title: "이용약관 | PlentyArcade",
    url: `${siteUrl}/terms`,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
