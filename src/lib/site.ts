/**
 * 프로덕션 기준 도메인 (슬래시 없음).
 * Vercel 등에서는 NEXT_PUBLIC_SITE_URL 로 덮어씁니다.
 */
const DEFAULT_SITE_URL = "https://pinball.plentyer.com";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, "");
}
