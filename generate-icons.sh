#!/bin/bash

# SpinSnap Arcade 아이콘 생성 스크립트
# SVG 파일을 PNG 및 ICO로 변환합니다.

# ImageMagick이 설치되어 있는지 확인
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick이 설치되어 있지 않습니다."
    echo ""
    echo "설치 방법:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  Windows: https://imagemagick.org/script/download.php"
    echo ""
    echo "또는 온라인 도구를 사용하세요:"
    echo "  - https://cloudconvert.com/svg-to-png"
    echo "  - https://convertio.co/svg-png/"
    exit 1
fi

echo "🎨 아이콘 생성 중..."

cd public

# PNG 파일 생성
echo "📦 PNG 파일 생성 중..."
convert -background none -resize 192x192 favicon.svg icon-192.png
convert -background none -resize 512x512 favicon.svg icon-512.png
convert -background none -resize 180x180 favicon.svg apple-touch-icon.png

# ICO 파일 생성 (여러 크기 포함)
echo "📦 ICO 파일 생성 중..."
convert -background none favicon.svg -define icon:auto-resize=16,32,48,64,128,256 favicon.ico

echo "✅ 완료!"
echo ""
echo "생성된 파일:"
echo "  - icon-192.png (192x192)"
echo "  - icon-512.png (512x512)"
echo "  - apple-touch-icon.png (180x180)"
echo "  - favicon.ico (다중 크기)"
echo ""
echo "다음 단계:"
echo "  1. src/app/layout.tsx에서 주석 처리된 아이콘 설정을 활성화하세요"
echo "  2. public/manifest.json에서 PNG 아이콘을 추가하세요"

