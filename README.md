# SpinSnap Arcade

**물리 엔진으로 구현된 다양한 인터랙티브 게임을 즐겨보세요!**

This is a code bundle for Interactive Pinball Game. The original project is available at https://www.figma.com/design/LUCwnFeL4DX5nvSRT04g8v/Interactive-Pinball-Game.

## 🎮 게임 소개

SpinSnap Arcade는 4가지 독특한 물리 기반 게임을 제공합니다:

1. **플링코 (Plinko)** - 공을 떨어뜨려 행운을 시험하는 확률 게임
2. **마블 레이스 (Marble Race)** - 장애물을 피해 가장 먼저 결승선에 도착하는 경주 게임
3. **서바이벌 (Survival)** - 폭탄과 자기장을 피해 마지막까지 살아남는 배틀로얄 게임
4. **컬러 컨퀘스트 (Color Conquest)** - 공을 굴려 가장 많은 땅을 차지하는 영토 전쟁 게임

## 프로젝트 분석

이 프로젝트는 다음과 같은 기술 스택을 사용합니다:

- **Next.js 14.2.0** - React 프레임워크 (App Router)
- **React 18.3.1** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링
- **Radix UI** - 접근성 있는 UI 컴포넌트
- **다양한 게임 모드**: Plinko, Race, Survival, Color Game

## 설정 방법

### 1. 필수 요구사항

- Node.js 18 이상 설치 필요
- npm 또는 yarn 패키지 매니저

### 2. 의존성 설치

```bash
npm install
```

또는

```bash
npm i
```

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

빌드된 파일은 `.next` 폴더에 생성됩니다.

## 프로젝트 구조

```
Interactive Pinball Game/
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── layout.tsx  # 루트 레이아웃
│   │   ├── page.tsx    # 홈페이지 (/)
│   │   ├── plinko/     # 플링코 게임 (/plinko)
│   │   ├── race/       # 레이스 게임 (/race)
│   │   ├── survival/   # 서바이벌 게임 (/survival)
│   │   └── color/      # 컬러 게임 (/color)
│   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── ui/         # UI 컴포넌트 (Radix UI 기반)
│   │   └── ...
│   └── pages/          # 게임 페이지 컴포넌트들
│       ├── Home.tsx
│       ├── PlinkoGame.tsx
│       ├── RaceGame.tsx
│       ├── SurvivalGame.tsx
│       └── ColorGame.tsx
├── package.json
├── next.config.js      # Next.js 설정
└── tsconfig.json       # TypeScript 설정
```

## 🎨 브랜딩 & SEO

이 프로젝트는 완전한 브랜딩과 SEO 최적화가 적용되어 있습니다:

### 포함된 기능

- ✅ 파비콘 (SVG, PNG, Apple Touch Icon)
- ✅ Open Graph 이미지 (소셜 미디어 공유)
- ✅ PWA 지원 (Progressive Web App)
- ✅ SEO 최적화 메타데이터
- ✅ 구조화된 데이터 (Schema.org)
- ✅ robots.txt 및 sitemap.xml
- ✅ 각 게임별 맞춤 메타데이터

### 환경 설정

프로덕션 배포 시 환경 변수를 설정하세요:

```bash
# .env.local 파일 생성
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 이미지 최적화 (선택사항)

현재 **SVG 파비콘만 사용** 중이며, 최신 브라우저에서 완벽하게 작동합니다.

PNG/ICO 파일이 필요한 경우 (레거시 브라우저 지원, PWA 최적화):

**방법 1: 스크립트 사용**

```bash
./generate-icons.sh
```

**방법 2: 온라인 도구**

- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [Convertio](https://convertio.co/svg-png/)

자세한 내용은 [generate-icons.md](./generate-icons.md)를 참조하세요.

자세한 브랜딩 가이드는 [BRANDING.md](./BRANDING.md)를 참조하세요.

## 문제 해결

- **의존성 설치 오류**: `npm cache clean --force` 후 다시 설치
- **포트 충돌**: `next.config.js`에서 포트 번호 변경 가능 (기본값: 3000)
- **타입 오류**: `npm install` 후 TypeScript 서버 재시작
