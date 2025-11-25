# Interactive Pinball Game - 설정 가이드

## 📋 프로젝트 분석 결과

이 프로젝트는 **Next.js + React + TypeScript** 기반의 인터랙티브 핀볼 게임입니다.

### 기술 스택
- **Next.js 14.2.0** - React 프레임워크 (App Router)
- **React 18.3.1** - UI 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 CSS 프레임워크
- **Radix UI** - 접근성 있는 UI 컴포넌트 라이브러리

### 게임 모드
1. **Plinko Game** - 핀볼 스타일 게임
2. **Race Game** - 레이스 게임
3. **Survival Game** - 생존 게임
4. **Color Game** - 컬러 게임

## 🚀 설정 방법

### 방법 1: 자동 설정 (권장)

1. 프로젝트 폴더에서 `setup.bat` 파일을 더블클릭하여 실행
2. 설치가 완료되면 자동으로 종료됩니다

### 방법 2: 수동 설정

1. **터미널/명령 프롬프트 열기**
   - Windows: `Win + R` → `cmd` 입력 → Enter
   - 또는 프로젝트 폴더에서 `Shift + 우클릭` → "여기서 PowerShell 창 열기"

2. **프로젝트 폴더로 이동**
   ```bash
   cd "C:\Users\이동복\Desktop\Interactive Pinball Game"
   ```

3. **의존성 설치**
   ```bash
   npm install
   ```
   또는
   ```bash
   npm i
   ```

4. **설치 확인**
   - `node_modules` 폴더가 생성되었는지 확인
   - 오류 메시지가 없으면 성공

## ▶️ 실행 방법

### 개발 서버 실행
```bash
npm run dev
```

- 서버가 시작되면 브라우저가 자동으로 열립니다
- 기본 주소: `http://localhost:3000`
- 코드를 수정하면 자동으로 새로고침됩니다 (Hot Module Replacement)

### 프로덕션 빌드
```bash
npm run build
npm start
```

- 빌드된 파일은 `.next` 폴더에 생성됩니다
- Next.js 서버로 배포할 수 있습니다

## 📁 프로젝트 구조

```
Interactive Pinball Game/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # 루트 레이아웃
│   │   ├── page.tsx         # 홈페이지 (/)
│   │   ├── plinko/          # 플링코 게임 (/plinko)
│   │   ├── race/            # 레이스 게임 (/race)
│   │   ├── survival/        # 서바이벌 게임 (/survival)
│   │   └── color/           # 컬러 게임 (/color)
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── ui/              # UI 컴포넌트 (버튼, 다이얼로그 등)
│   │   └── Navigation.tsx   # 네비게이션 바
│   └── pages/               # 게임 페이지 컴포넌트들
│       ├── Home.tsx         # 홈 페이지
│       ├── PlinkoGame.tsx   # Plinko 게임
│       ├── RaceGame.tsx     # 레이스 게임
│       ├── SurvivalGame.tsx # 생존 게임
│       └── ColorGame.tsx    # 컬러 게임
├── package.json             # 프로젝트 설정 및 의존성
├── next.config.js           # Next.js 설정
├── tsconfig.json            # TypeScript 설정
└── setup.bat                # 자동 설정 스크립트
```

## ⚙️ 설정 파일 설명

### tsconfig.json
- TypeScript 컴파일러 설정
- 경로 별칭 (`@/*` → `./src/*`) 설정
- 엄격한 타입 검사 활성화

### next.config.js
- Next.js 프레임워크 설정
- React Strict Mode 활성화
- 이미지 최적화 설정

### package.json
- 프로젝트 메타데이터
- 의존성 패키지 목록
- 실행 가능한 스크립트:
  - `npm run dev` - 개발 서버 실행
  - `npm run build` - 프로덕션 빌드

## 🔧 문제 해결

### npm install 실패
1. **Node.js 버전 확인**
   ```bash
   node --version
   ```
   - Node.js 18 이상 필요
   - [Node.js 다운로드](https://nodejs.org/)

2. **캐시 정리 후 재설치**
   ```bash
   npm cache clean --force
   npm install
   ```

3. **권한 문제**
   - 관리자 권한으로 실행
   - 또는 `npm install --legacy-peer-deps` 시도

### 포트 3000이 이미 사용 중
- `next dev -p 3001` 명령어로 다른 포트에서 실행
- 또는 환경 변수 `PORT=3001 npm run dev` 사용

### TypeScript 오류
- `npm install` 후 VS Code나 에디터 재시작
- `node_modules` 폴더 삭제 후 `npm install` 재실행

### 빌드 오류
- `npm run build` 실행 전 `npm install` 확인
- TypeScript 오류가 있으면 먼저 수정

## 📝 추가 정보

- 원본 Figma 디자인: https://www.figma.com/design/LUCwnFeL4DX5nvSRT04g8v/Interactive-Pinball-Game
- Next.js 문서: https://nextjs.org/docs
- React 문서: https://react.dev/
- Tailwind CSS 문서: https://tailwindcss.com/

## ✅ 설정 완료 체크리스트

- [ ] Node.js 설치 확인 (`node --version`)
- [ ] npm 설치 확인 (`npm --version`)
- [ ] `npm install` 실행 완료
- [ ] `node_modules` 폴더 생성 확인
- [ ] `npm run dev` 실행 성공
- [ ] 브라우저에서 게임이 정상적으로 표시됨

설정이 완료되면 즐거운 게임 개발 되세요! 🎮

