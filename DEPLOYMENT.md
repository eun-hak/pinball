# 배포 가이드 🚀

SpinSnap Arcade를 프로덕션 환경에 배포하는 방법입니다.

## 📋 배포 전 체크리스트

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하거나 호스팅 플랫폼에서 환경 변수를 설정하세요:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. 이미지 파일 변환

현재 SVG 파일들을 PNG로 변환해야 합니다:

```bash
# ImageMagick 설치 (Mac)
brew install imagemagick

# PNG 변환
cd public
convert -background none -resize 192x192 favicon.svg icon-192.png
convert -background none -resize 512x512 favicon.svg icon-512.png
convert -background none -resize 180x180 favicon.svg apple-touch-icon.png

# 파비콘 ICO 생성
convert -background none favicon.svg -define icon:auto-resize=16,32,48 favicon.ico
```

또는 온라인 도구 사용:

- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [Convertio](https://convertio.co/svg-png/)

### 3. 빌드 테스트

```bash
npm run build
npm start
```

로컬에서 프로덕션 빌드가 정상 작동하는지 확인하세요.

---

## 🌐 배포 플랫폼별 가이드

### Vercel (권장)

가장 쉽고 Next.js에 최적화된 배포 방법입니다.

#### 단계:

1. **Vercel 계정 생성**

   - [vercel.com](https://vercel.com) 방문
   - GitHub 계정으로 로그인

2. **프로젝트 연결**

   ```bash
   # Vercel CLI 설치
   npm i -g vercel

   # 배포
   vercel
   ```

3. **환경 변수 설정**

   - Vercel 대시보드에서 프로젝트 선택
   - Settings → Environment Variables
   - `NEXT_PUBLIC_SITE_URL` 추가

4. **도메인 연결**
   - Settings → Domains
   - 커스텀 도메인 추가

---

### Netlify

#### 단계:

1. **netlify.toml 생성**

   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **배포**
   - [netlify.com](https://netlify.com)에서 GitHub 저장소 연결
   - Build settings 자동 인식
   - 환경 변수 설정

---

### Cloudflare Pages

#### 단계:

1. **빌드 설정**

   - Build command: `npm run build`
   - Build output: `.next`
   - Framework preset: Next.js

2. **환경 변수**
   - Settings → Environment variables
   - `NEXT_PUBLIC_SITE_URL` 추가

---

### AWS (S3 + CloudFront)

더 복잡하지만 완전한 제어가 가능합니다.

#### 단계:

1. **정적 빌드 생성**

   ```bash
   npm run build
   ```

2. **S3 버킷 생성**

   - 정적 웹사이트 호스팅 활성화

3. **CloudFront 배포 생성**

   - S3 버킷을 오리진으로 설정
   - SSL 인증서 추가

4. **파일 업로드**
   ```bash
   aws s3 sync .next/static s3://your-bucket/static
   ```

---

### Docker

#### Dockerfile 생성:

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

#### 빌드 및 실행:

```bash
docker build -t spinsnap-arcade .
docker run -p 3000:3000 -e NEXT_PUBLIC_SITE_URL=https://your-domain.com spinsnap-arcade
```

---

## 🔍 배포 후 확인 사항

### 1. 기능 테스트

- [ ] 모든 게임 페이지 정상 작동
- [ ] 네비게이션 작동
- [ ] 반응형 레이아웃 확인

### 2. SEO 확인

- [ ] 각 페이지의 메타 태그 확인
- [ ] Open Graph 이미지 확인
  - [Facebook Debugger](https://developers.facebook.com/tools/debug/)
  - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Sitemap 접근 확인: `https://your-domain.com/sitemap.xml`
- [ ] Robots.txt 확인: `https://your-domain.com/robots.txt`
- [ ] Manifest 확인: `https://your-domain.com/manifest.json`

### 3. 성능 테스트

- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) - 90+ 목표
- [ ] Lighthouse 점검 (Chrome DevTools)
- [ ] 모바일 성능 확인

### 4. PWA 테스트

- [ ] 홈 화면에 추가 가능 여부
- [ ] 오프라인 동작 (선택사항)
- [ ] 아이콘 정상 표시

---

## 🔧 배포 후 최적화

### 1. 검색 엔진 등록

#### Google Search Console

```
1. https://search.google.com/search-console 접속
2. 속성 추가 (도메인 또는 URL 접두어)
3. 소유권 확인
4. 사이트맵 제출: https://your-domain.com/sitemap.xml
```

#### Bing Webmaster Tools

```
1. https://www.bing.com/webmasters 접속
2. 사이트 추가
3. 사이트맵 제출
```

#### Naver Search Advisor

```
1. https://searchadvisor.naver.com/ 접속
2. 웹마스터 도구에서 사이트 등록
3. 소유 확인
4. 사이트맵 제출
```

### 2. 분석 도구 설정

#### Google Analytics 4 (GA4)

`src/app/layout.tsx`에 추가:

```typescript
// Google Analytics Script
{
  process.env.NEXT_PUBLIC_GA_ID && (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `,
        }}
      />
    </>
  );
}
```

환경 변수 추가:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. CDN 설정 (선택사항)

정적 파일을 CDN으로 제공하여 로딩 속도 향상:

- **Cloudflare**: 자동 CDN (무료)
- **AWS CloudFront**: S3와 함께 사용
- **Vercel**: 자동으로 Edge Network 사용

---

## 🔄 지속적 배포 (CI/CD)

### GitHub Actions 예시

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: ${{ secrets.SITE_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

---

## 🐛 문제 해결

### 빌드 에러

```bash
# 캐시 클리어
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### 환경 변수 적용 안됨

- `.env.local`이 `.gitignore`에 있는지 확인
- 호스팅 플랫폼에서 환경 변수 재설정
- 빌드 다시 실행

### 이미지 표시 안됨

- 이미지 파일 경로 확인 (`/public/...`)
- PNG 변환 완료 확인
- 캐시 클리어 후 재배포

### PWA 작동 안함

- HTTPS 사용 확인 (필수)
- manifest.json 경로 확인
- 서비스 워커 등록 확인 (선택사항)

---

## 📊 모니터링

### 필수 모니터링 항목

1. **업타임 모니터링**

   - [UptimeRobot](https://uptimerobot.com/) (무료)
   - [Pingdom](https://www.pingdom.com/)

2. **에러 추적**

   - [Sentry](https://sentry.io/)
   - Vercel Analytics (Vercel 사용 시)

3. **성능 모니터링**
   - Google PageSpeed Insights
   - Lighthouse CI

---

## 💰 비용 예상

### 무료 호스팅

- **Vercel**: 개인 프로젝트 무료 (Hobby Plan)
- **Netlify**: 월 100GB 대역폭 무료
- **Cloudflare Pages**: 무제한 대역폭 무료

### 커스텀 도메인

- `.com` 도메인: 연간 $10-15
- `.kr` 도메인: 연간 $15-20

### 프리미엄 서비스 (선택사항)

- Google Analytics: 무료
- Vercel Pro: 월 $20 (상용 프로젝트)
- Cloudflare Pro: 월 $20 (고급 기능)

---

## 📞 지원

배포 중 문제가 발생하면:

1. [Next.js 공식 문서](https://nextjs.org/docs) 참조
2. [GitHub Issues](https://github.com/your-repo/issues)에 문의
3. [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)에서 검색

---

**배포 성공을 기원합니다! 🎉**
