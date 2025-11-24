
  # Interactive Pinball Game

  This is a code bundle for Interactive Pinball Game. The original project is available at https://www.figma.com/design/LUCwnFeL4DX5nvSRT04g8v/Interactive-Pinball-Game.

  ## 프로젝트 분석

  이 프로젝트는 다음과 같은 기술 스택을 사용합니다:
  - **React 18.3.1** - UI 라이브러리
  - **TypeScript** - 타입 안정성
  - **Vite 6.3.5** - 빌드 도구 및 개발 서버
  - **Tailwind CSS v4** - 스타일링
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
  ```
  빌드된 파일은 `build` 폴더에 생성됩니다.

  ## 프로젝트 구조

  ```
  Interactive Pinball Game/
  ├── src/
  │   ├── components/     # 재사용 가능한 컴포넌트
  │   │   ├── ui/         # UI 컴포넌트 (Radix UI 기반)
  │   │   └── ...
  │   ├── pages/          # 게임 페이지들
  │   │   ├── Home.tsx
  │   │   ├── PlinkoGame.tsx
  │   │   ├── RaceGame.tsx
  │   │   ├── SurvivalGame.tsx
  │   │   └── ColorGame.tsx
  │   ├── App.tsx         # 메인 앱 컴포넌트
  │   └── main.tsx        # 진입점
  ├── index.html
  ├── package.json
  ├── tsconfig.json       # TypeScript 설정
  └── vite.config.ts      # Vite 설정
  ```

  ## 문제 해결

  - **의존성 설치 오류**: `npm cache clean --force` 후 다시 설치
  - **포트 충돌**: `vite.config.ts`에서 포트 번호 변경 가능
  - **타입 오류**: `npm install` 후 TypeScript 서버 재시작
  