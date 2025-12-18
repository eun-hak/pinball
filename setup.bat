@echo off
chcp 65001 >nul
echo ====================================
echo Interactive Pinball Game 설정 시작
echo ====================================
echo.

echo [1/2] 의존성 패키지 설치 중...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo 오류: npm install 실패했습니다.
    echo Node.js가 설치되어 있는지 확인하세요.
    pause
    exit /b 1
)

echo.
echo [2/2] 설정 완료!
echo.
echo ====================================
echo 다음 명령어로 개발 서버를 실행하세요:
echo   npm run dev
echo ====================================
echo.
pause


