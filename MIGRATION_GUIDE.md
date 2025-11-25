# Next.js 마이그레이션 완료 가이드

## ✅ 마이그레이션 완료 사항

### 1. Next.js 설정
- ✅ `next.config.js` 생성
- ✅ `package.json` 업데이트 (Next.js 의존성 추가)
- ✅ `tsconfig.json` Next.js용으로 업데이트
- ✅ `.eslintrc.json` 추가

### 2. 프로젝트 구조 변경
- ✅ `src/app/` 디렉토리 생성 (App Router)
- ✅ `src/app/layout.tsx` - 루트 레이아웃 (메타데이터 포함)
- ✅ `src/app/page.tsx` - 홈페이지
- ✅ `src/app/plinko/page.tsx` - 플링코 게임 페이지
- ✅ `src/app/race/page.tsx` - 레이스 게임 페이지
- ✅ `src/app/survival/page.tsx` - 서바이벌 게임 페이지
- ✅ `src/app/color/page.tsx` - 컬러 게임 페이지

### 3. SEO 최적화
- ✅ 각 페이지별 메타데이터 추가
- ✅ Open Graph 태그 추가
- ✅ 한국어 설정 (lang="ko")
- ✅ 각 게임별 독립 URL 생성 (`/plinko`, `/race`, `/survival`, `/color`)

### 4. 컴포넌트 업데이트
- ✅ `Navigation` 컴포넌트를 Next.js Link 사용하도록 업데이트
- ✅ `Home` 컴포넌트를 Next.js Link 사용하도록 업데이트
- ✅ 모든 게임 컴포넌트는 그대로 유지 (성능/UX 보존)

### 5. 스타일링
- ✅ Tailwind CSS 설정 유지
- ✅ 기존 CSS 파일 그대로 유지
- ✅ `tailwind.config.ts` 생성

## 🚀 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

기본 주소: `http://localhost:3000`

### 3. 프로덕션 빌드
```bash
npm run build
npm start
```

## 📁 새로운 프로젝트 구조

```
Interactive Pinball Game/
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # 루트 레이아웃 (메타데이터)
│   │   ├── page.tsx       # 홈페이지 (/)
│   │   ├── plinko/
│   │   │   ├── page.tsx   # 플링코 페이지 (/plinko)
│   │   │   └── client.tsx # 클라이언트 컴포넌트
│   │   ├── race/
│   │   │   ├── page.tsx   # 레이스 페이지 (/race)
│   │   │   └── client.tsx
│   │   ├── survival/
│   │   │   ├── page.tsx   # 서바이벌 페이지 (/survival)
│   │   │   └── client.tsx
│   │   └── color/
│   │       ├── page.tsx   # 컬러 페이지 (/color)
│   │       └── client.tsx
│   ├── components/        # 재사용 가능한 컴포넌트
│   ├── pages/             # 게임 페이지 컴포넌트들
│   └── ...
├── next.config.js         # Next.js 설정
├── tailwind.config.ts     # Tailwind 설정
└── package.json           # 업데이트됨
```

## ✨ 주요 변경사항

### 1. 라우팅
- **이전**: `useState`로 페이지 전환 (모든 페이지가 같은 URL)
- **현재**: Next.js 파일 기반 라우팅 (각 게임별 독립 URL)

### 2. SEO
- **이전**: 메타태그 없음
- **현재**: 각 페이지별 메타데이터, Open Graph, Twitter Card

### 3. 성능
- **유지**: 모든 게임 로직과 Canvas 렌더링 그대로 유지
- **개선**: Next.js의 자동 코드 스플리팅으로 성능 향상

### 4. UX/UI
- **유지**: 모든 스타일과 애니메이션 그대로 유지
- **개선**: URL 기반 네비게이션으로 브라우저 뒤로가기/앞으로가기 지원

## 🔍 확인 사항

### Canvas 게임 작동 확인
모든 게임이 정상 작동하는지 확인하세요:
- [ ] 플링코 게임
- [ ] 레이스 게임
- [ ] 서바이벌 게임
- [ ] 컬러 게임

### SEO 확인
- [ ] 각 페이지의 메타데이터가 올바르게 설정되었는지
- [ ] 소셜 미디어 공유 시 제목/설명이 표시되는지
- [ ] 검색 엔진에서 각 게임 페이지가 독립적으로 인덱싱되는지

## 📝 다음 단계 (선택사항)

1. **구조화된 데이터 추가** (Schema.org)
   - Game 스키마 추가
   - WebSite 스키마 추가

2. **사이트맵 생성**
   - `sitemap.xml` 자동 생성

3. **robots.txt 추가**
   - 검색 엔진 크롤링 최적화

4. **이미지 최적화**
   - Next.js Image 컴포넌트 사용

## ⚠️ 주의사항

- 기존 `vite.config.ts`와 `index.html`은 더 이상 사용되지 않습니다
- `src/main.tsx`는 더 이상 사용되지 않습니다
- 모든 게임 컴포넌트는 `'use client'` 지시어가 필요할 수 있습니다 (Canvas 사용)

## 🎉 마이그레이션 완료!

이제 Next.js의 모든 SEO 기능을 활용할 수 있으며, 각 게임 페이지가 독립적인 URL을 가지게 되었습니다. 성능과 UX는 그대로 유지됩니다!

