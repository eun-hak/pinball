'use client'

import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  landed: boolean;
  slot?: number;
  scale: number;
  nearGoal: boolean;
}

interface Peg {
  x: number;
  y: number;
  radius: number;
}

interface Slot {
  x: number;
  multiplier: number;
  color: string;
  count: number;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DFE6E9', '#A29BFE', '#FD79A8',
  '#6C5CE7', '#00B894', '#FDCB6E', '#E17055'
];

// 화면 크기 감지 훅
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export function PlinkoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const pegsRef = useRef<Peg[]>([]);
  const slotsRef = useRef<Slot[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [ballCount, setBallCount] = useState(0);
  const animationRef = useRef<number>();
  const ballIdRef = useRef(0);
  const isPlayingRef = useRef(false);

  const windowSize = useWindowSize();

  // 반응형 Canvas 크기 계산
  const getCanvasSize = useCallback(() => {
    if (!containerRef.current) {
      return { width: 800, height: 900 };
    }

    const containerWidth = containerRef.current.clientWidth;
    const isMobile = windowSize.width < 1024; // 1024px 미만은 모바일/태블릿

    // PC (1024px 이상): 원래 디자인대로 800x900 고정
    if (!isMobile) {
      return { width: 800, height: 900 };
    }

    // 모바일/태블릿: 반응형
    const padding = 32; // 좌우 패딩
    const minWidth = 320;

    // 화면 너비에 맞춰 계산 (최소 320px, 최대 800px)
    const canvasWidth = Math.max(minWidth, Math.min(800, containerWidth - padding));
    // 모바일에서는 세로로 길게 (비율 8:12로 변경하여 더 길게)
    const canvasHeight = (canvasWidth / 8) * 12;

    return { width: canvasWidth, height: canvasHeight };
  }, [windowSize.width]);

  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 900 });

  // 게임 상수 (비율 기반)
  const BASE_WIDTH = 800;
  const BASE_HEIGHT = 900;
  const PEG_RADIUS_RATIO = 4 / BASE_WIDTH;
  const BALL_RADIUS_RATIO = 8 / BASE_WIDTH;
  const GRAVITY = 0.3;
  const BOUNCE = 0.7;
  const FRICTION = 0.99;
  const NUM_ROWS = 14;
  const NUM_SLOTS = 11;

  // 비율을 실제 크기로 변환
  const getActualSize = useCallback((ratio: number, dimension: 'width' | 'height') => {
    return ratio * (dimension === 'width' ? canvasSize.width : canvasSize.height);
  }, [canvasSize]);

  // Canvas 크기 업데이트
  useEffect(() => {
    const newSize = getCanvasSize();
    setCanvasSize(newSize);
  }, [windowSize, getCanvasSize]);

  const initializeGame = useCallback(() => {
    const { width, height } = canvasSize;

    const newPegs: Peg[] = [];
    const startY = getActualSize(150 / BASE_HEIGHT, 'height');
    const rowSpacing = getActualSize(50 / BASE_HEIGHT, 'height');
    const pegSpacing = getActualSize(50 / BASE_WIDTH, 'width');

    for (let row = 0; row < NUM_ROWS; row++) {
      const pegsInRow = row + 3;
      const rowWidth = (pegsInRow - 1) * pegSpacing;
      const startX = (width - rowWidth) / 2;

      for (let col = 0; col < pegsInRow; col++) {
        newPegs.push({
          x: startX + col * pegSpacing,
          y: startY + row * rowSpacing,
          radius: getActualSize(PEG_RADIUS_RATIO, 'width')
        });
      }
    }

    pegsRef.current = newPegs;

    const newSlots: Slot[] = [];
    const slotWidth = width / NUM_SLOTS;
    const multipliers = [10, 5, 3, 2, 1, 0.5, 1, 2, 3, 5, 10];
    const slotColors = ['#FF6B6B', '#FFA07A', '#FFD700', '#90EE90', '#87CEEB', '#DDA0DD', '#87CEEB', '#90EE90', '#FFD700', '#FFA07A', '#FF6B6B'];

    for (let i = 0; i < NUM_SLOTS; i++) {
      newSlots.push({
        x: i * slotWidth + slotWidth / 2,
        multiplier: multipliers[i],
        color: slotColors[i],
        count: 0
      });
    }

    slotsRef.current = newSlots;
  }, [canvasSize, getActualSize]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const dropBall = useCallback(() => {
    if (!isPlayingRef.current) return;

    const { width } = canvasSize;
    const ballRadius = getActualSize(BALL_RADIUS_RATIO, 'width');

    const newBall: Ball = {
      id: ballIdRef.current++,
      x: width / 2 + (Math.random() - 0.5) * getActualSize(20 / BASE_WIDTH, 'width'),
      y: getActualSize(50 / BASE_HEIGHT, 'height'),
      vx: (Math.random() - 0.5) * getActualSize(2 / BASE_WIDTH, 'width'),
      vy: 0,
      radius: ballRadius,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      landed: false,
      scale: 1,
      nearGoal: false
    };

    ballsRef.current.push(newBall);
    setBallCount(prev => prev + 1);
  }, [canvasSize, getActualSize]);

  const startGame = () => {
    setIsPlaying(true);
    isPlayingRef.current = true;
    setScore(0);
    setBallCount(0);
    ballsRef.current = [];
    slotsRef.current = slotsRef.current.map(s => ({ ...s, count: 0 }));
    ballIdRef.current = 0;

    // 게임 시작 시 화면을 부드럽게 약간 내려줌
    window.scrollBy({ top: 150, behavior: 'smooth' });

    const interval = setInterval(() => {
      dropBall();
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setTimeout(() => {
        setIsPlaying(false);
        isPlayingRef.current = false;
      }, 5000);
    }, 10000);
  };

  const resetGame = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    ballsRef.current = [];
    setScore(0);
    setBallCount(0);
    slotsRef.current = slotsRef.current.map(s => ({ ...s, count: 0 }));
    ballIdRef.current = 0;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSize;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    // Canvas 실제 해상도 설정 (고화질 대응)
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // CSS 크기는 논리적 크기로 유지
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const animate = () => {
      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      const marginX = getActualSize(50 / BASE_WIDTH, 'width');
      const marginY = getActualSize(100 / BASE_HEIGHT, 'height');
      const gameAreaHeight = height - getActualSize(200 / BASE_HEIGHT, 'height');

      ctx.strokeStyle = '#333';
      ctx.lineWidth = getActualSize(2 / BASE_WIDTH, 'width');
      ctx.strokeRect(marginX, marginY, width - marginX * 2, gameAreaHeight);

      pegsRef.current.forEach(peg => {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#555';
        ctx.fill();
        ctx.strokeStyle = '#888';
        ctx.lineWidth = getActualSize(1 / BASE_WIDTH, 'width');
        ctx.stroke();
      });

      const slotWidth = width / NUM_SLOTS;
      const slotY = height - getActualSize(100 / BASE_HEIGHT, 'height');

      slotsRef.current.forEach((slot, i) => {
        const x = i * slotWidth;

        ctx.strokeStyle = '#444';
        ctx.lineWidth = getActualSize(2 / BASE_WIDTH, 'width');
        ctx.beginPath();
        ctx.moveTo(x, slotY);
        ctx.lineTo(x, height - getActualSize(20 / BASE_HEIGHT, 'height'));
        ctx.stroke();

        ctx.fillStyle = slot.color + '20';
        ctx.fillRect(x, slotY, slotWidth, height - slotY - getActualSize(20 / BASE_HEIGHT, 'height'));

        ctx.fillStyle = slot.color;
        ctx.textAlign = 'center';
        const fontSize = getActualSize(16 / BASE_WIDTH, 'width');
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillText(`×${slot.multiplier}`, x + slotWidth / 2, slotY + getActualSize(30 / BASE_HEIGHT, 'height'));

        if (slot.count > 0) {
          ctx.fillStyle = '#fff';
          const countFontSize = getActualSize(12 / BASE_WIDTH, 'width');
          ctx.font = `bold ${countFontSize}px Arial`;
          ctx.fillText(`${slot.count}`, x + slotWidth / 2, slotY + getActualSize(50 / BASE_HEIGHT, 'height'));
        }
      });

      const nearGoalStartY = slotY - getActualSize(150 / BASE_HEIGHT, 'height');

      ballsRef.current = ballsRef.current.map(ball => {
        if (ball.landed) return ball;

        let newBall = { ...ball };

        // 화면 크기에 비례하여 중력 조정 (모바일에서 너무 빠르지 않게)
        const currentGravity = getActualSize(0.3 / BASE_HEIGHT, 'height');
        newBall.vy += currentGravity;
        newBall.vx *= FRICTION;
        newBall.vy *= FRICTION;
        newBall.x += newBall.vx;
        newBall.y += newBall.vy;

        if (newBall.y > nearGoalStartY && newBall.y < slotY) {
          newBall.nearGoal = true;
          const goalRange = getActualSize(150 / BASE_HEIGHT, 'height');
          newBall.scale = 1 + (newBall.y - nearGoalStartY) / goalRange * 0.8;
        } else {
          newBall.nearGoal = false;
          newBall.scale = 1;
        }

        pegsRef.current.forEach(peg => {
          const dx = newBall.x - peg.x;
          const dy = newBall.y - peg.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDist = newBall.radius + peg.radius;

          if (distance < minDist) {
            const angle = Math.atan2(dy, dx);
            const targetX = peg.x + Math.cos(angle) * minDist;
            const targetY = peg.y + Math.sin(angle) * minDist;

            newBall.x = targetX;
            newBall.y = targetY;

            const speed = Math.sqrt(newBall.vx * newBall.vx + newBall.vy * newBall.vy);
            newBall.vx = Math.cos(angle) * speed * BOUNCE;
            newBall.vy = Math.sin(angle) * speed * BOUNCE;
            newBall.vx += (Math.random() - 0.5) * getActualSize(1 / BASE_WIDTH, 'width');
          }
        });

        const wallMargin = getActualSize(50 / BASE_WIDTH, 'width');
        if (newBall.x - newBall.radius < wallMargin) {
          newBall.x = wallMargin + newBall.radius;
          newBall.vx *= -BOUNCE;
        }
        if (newBall.x + newBall.radius > width - wallMargin) {
          newBall.x = width - wallMargin - newBall.radius;
          newBall.vx *= -BOUNCE;
        }

        if (newBall.y >= slotY && !newBall.landed) {
          newBall.landed = true;
          newBall.vy = 0;
          newBall.vx = 0;
          newBall.scale = 1;

          const slotIndex = Math.floor((newBall.x / width) * NUM_SLOTS);
          const clampedIndex = Math.max(0, Math.min(NUM_SLOTS - 1, slotIndex));
          newBall.slot = clampedIndex;

          slotsRef.current[clampedIndex].count++;
          setScore(prev => prev + slotsRef.current[clampedIndex].multiplier * 100);

          const slotWidth = width / NUM_SLOTS;
          newBall.x = clampedIndex * slotWidth + slotWidth / 2;
        }

        return newBall;
      }).filter(ball => !ball.landed || ball.y < height);

      ballsRef.current.forEach(ball => {
        ctx.save();

        ctx.translate(ball.x, ball.y);
        ctx.scale(ball.scale, ball.scale);

        if (ball.nearGoal) {
          ctx.shadowBlur = getActualSize(20 / BASE_WIDTH, 'width');
          ctx.shadowColor = ball.color;
        }

        ctx.beginPath();
        ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(-ball.radius / 3, -ball.radius / 3, ball.radius / 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();

        ctx.restore();
      });

      ctx.restore();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasSize, getActualSize]);

  const isMobile = windowSize.width < 1024;

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 gap-4 sm:gap-6 ${isMobile ? 'pt-2' : ''}`}>
      {/* 헤더 - 모바일 반응형 */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl gap-4 ${isMobile ? 'mb-2' : ''}`}>
        <div className="text-white">
          <h2 className="text-xl sm:text-2xl mb-2">🎯 플링코 게임</h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div>
              <span className="text-gray-400 text-sm sm:text-base">점수:</span>
              <span className="ml-2 text-xl sm:text-2xl text-yellow-400">{score.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400 text-sm sm:text-base">공 개수:</span>
              <span className="ml-2 text-lg sm:text-xl">{ballCount}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            onClick={startGame}
            disabled={isPlaying}
            size="lg"
            className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
          >
            <Play className="mr-2 size-4 sm:size-5" />
            <span className="text-sm sm:text-base">시작</span>
          </Button>
          <Button
            onClick={resetGame}
            size="lg"
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            <RotateCcw className="mr-2 size-4 sm:size-5" />
            <span className="text-sm sm:text-base">리셋</span>
          </Button>
        </div>
      </div>

      {/* Canvas 컨테이너 - 반응형 */}
      <div
        ref={containerRef}
        className={`relative w-full max-w-[800px] flex justify-center ${isMobile ? 'flex-1 min-h-0' : ''}`}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="border border-gray-700 rounded-lg shadow-2xl"
          style={{
            width: windowSize.width >= 1024 ? '800px' : '100%',
            height: windowSize.width >= 1024 ? '900px' : 'auto',
            maxWidth: '100%',
          }}
        />
        {!isPlaying && ballCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 px-4 sm:px-8 py-4 sm:py-6 rounded-lg border border-gray-700 mx-4">
              <p className="text-white text-sm sm:text-xl text-center">
                시작 버튼을 눌러 게임을 시작하세요! 🎮
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 설명 - 모바일 반응형 */}
      <div className="text-gray-400 text-center max-w-2xl px-4">
        <p className="text-sm sm:text-base">공이 떨어지면서 페그에 부딪히며 슬롯에 도착합니다.</p>
        <p className="text-sm sm:text-base">골인 직전에는 공이 확대되며 긴장감을 더합니다! 🎯</p>
      </div>
    </div>
  );
}
