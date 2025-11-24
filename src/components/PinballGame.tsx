import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

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

export function PinballGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const pegsRef = useRef<Peg[]>([]);
  const slotsRef = useRef<Slot[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [ballCount, setBallCount] = useState(0);
  const animationRef = useRef<number>();
  const ballIdRef = useRef(0);
  const isPlayingRef = useRef(false);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 900;
  const PEG_RADIUS = 4;
  const BALL_RADIUS = 8;
  const GRAVITY = 0.3;
  const BOUNCE = 0.7;
  const FRICTION = 0.99;
  const NUM_ROWS = 14;
  const NUM_SLOTS = 11;

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Create pegs in a triangular pattern
    const newPegs: Peg[] = [];
    const startY = 150;
    const rowSpacing = 50;
    const pegSpacing = 50;

    for (let row = 0; row < NUM_ROWS; row++) {
      const pegsInRow = row + 3;
      const rowWidth = (pegsInRow - 1) * pegSpacing;
      const startX = (CANVAS_WIDTH - rowWidth) / 2;

      for (let col = 0; col < pegsInRow; col++) {
        newPegs.push({
          x: startX + col * pegSpacing,
          y: startY + row * rowSpacing,
          radius: PEG_RADIUS
        });
      }
    }

    pegsRef.current = newPegs;

    // Create slots at the bottom
    const newSlots: Slot[] = [];
    const slotWidth = CANVAS_WIDTH / NUM_SLOTS;
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
  };

  const dropBall = () => {
    if (!isPlayingRef.current) return;

    const newBall: Ball = {
      id: ballIdRef.current++,
      x: CANVAS_WIDTH / 2 + (Math.random() - 0.5) * 20,
      y: 50,
      vx: (Math.random() - 0.5) * 2,
      vy: 0,
      radius: BALL_RADIUS,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      landed: false,
      scale: 1,
      nearGoal: false
    };

    ballsRef.current.push(newBall);
    setBallCount(prev => prev + 1);
  };

  const startGame = () => {
    setIsPlaying(true);
    isPlayingRef.current = true;
    setScore(0);
    setBallCount(0);
    ballsRef.current = [];
    slotsRef.current = slotsRef.current.map(s => ({ ...s, count: 0 }));
    ballIdRef.current = 0;
    
    // Start dropping balls
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

    const animate = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw walls
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 100, CANVAS_WIDTH - 100, CANVAS_HEIGHT - 200);

      // Draw pegs
      pegsRef.current.forEach(peg => {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#555';
        ctx.fill();
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw slot dividers and labels
      const slotWidth = CANVAS_WIDTH / NUM_SLOTS;
      const slotY = CANVAS_HEIGHT - 100;
      
      slotsRef.current.forEach((slot, i) => {
        const x = i * slotWidth;
        
        // Divider
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, slotY);
        ctx.lineTo(x, CANVAS_HEIGHT - 20);
        ctx.stroke();

        // Slot background
        ctx.fillStyle = slot.color + '20';
        ctx.fillRect(x, slotY, slotWidth, CANVAS_HEIGHT - slotY - 20);

        // Multiplier text
        ctx.fillStyle = slot.color;
        ctx.textAlign = 'center';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`×${slot.multiplier}`, x + slotWidth / 2, slotY + 30);

        // Count
        if (slot.count > 0) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 12px Arial';
          ctx.fillText(`${slot.count}`, x + slotWidth / 2, slotY + 50);
        }
      });

      // Update balls physics
      ballsRef.current = ballsRef.current.map(ball => {
        if (ball.landed) return ball;

        let newBall = { ...ball };

        // Apply gravity
        newBall.vy += GRAVITY;

        // Apply friction
        newBall.vx *= FRICTION;
        newBall.vy *= FRICTION;

        // Update position
        newBall.x += newBall.vx;
        newBall.y += newBall.vy;

        // Check if near goal (approaching slots)
        if (newBall.y > slotY - 150 && newBall.y < slotY) {
          newBall.nearGoal = true;
          newBall.scale = 1 + (newBall.y - (slotY - 150)) / 150 * 0.8; // Scale up to 1.8x
        } else {
          newBall.nearGoal = false;
          newBall.scale = 1;
        }

        // Collision with pegs
        pegsRef.current.forEach(peg => {
          const dx = newBall.x - peg.x;
          const dy = newBall.y - peg.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDist = newBall.radius + peg.radius;

          if (distance < minDist) {
            // Calculate collision normal
            const angle = Math.atan2(dy, dx);
            const targetX = peg.x + Math.cos(angle) * minDist;
            const targetY = peg.y + Math.sin(angle) * minDist;

            // Update position
            newBall.x = targetX;
            newBall.y = targetY;

            // Reflect velocity
            const speed = Math.sqrt(newBall.vx * newBall.vx + newBall.vy * newBall.vy);
            newBall.vx = Math.cos(angle) * speed * BOUNCE;
            newBall.vy = Math.sin(angle) * speed * BOUNCE;

            // Add some randomness
            newBall.vx += (Math.random() - 0.5) * 1;
          }
        });

        // Wall collisions
        if (newBall.x - newBall.radius < 50) {
          newBall.x = 50 + newBall.radius;
          newBall.vx *= -BOUNCE;
        }
        if (newBall.x + newBall.radius > CANVAS_WIDTH - 50) {
          newBall.x = CANVAS_WIDTH - 50 - newBall.radius;
          newBall.vx *= -BOUNCE;
        }

        // Check if ball landed in a slot
        if (newBall.y >= slotY && !newBall.landed) {
          newBall.landed = true;
          newBall.vy = 0;
          newBall.vx = 0;
          newBall.scale = 1;

          // Determine which slot
          const slotIndex = Math.floor((newBall.x / CANVAS_WIDTH) * NUM_SLOTS);
          const clampedIndex = Math.max(0, Math.min(NUM_SLOTS - 1, slotIndex));
          newBall.slot = clampedIndex;

          // Update slot count
          slotsRef.current[clampedIndex].count++;
          
          // Update score
          setScore(prev => prev + slotsRef.current[clampedIndex].multiplier * 100);

          // Center ball in slot
          const slotWidth = CANVAS_WIDTH / NUM_SLOTS;
          newBall.x = clampedIndex * slotWidth + slotWidth / 2;
        }

        return newBall;
      }).filter(ball => !ball.landed || ball.y < CANVAS_HEIGHT);

      // Draw balls
      ballsRef.current.forEach(ball => {
        ctx.save();
        
        // Apply scale transform for near-goal effect
        ctx.translate(ball.x, ball.y);
        ctx.scale(ball.scale, ball.scale);
        
        // Glow effect when near goal
        if (ball.nearGoal) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = ball.color;
        }

        ctx.beginPath();
        ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        
        // Shine effect
        ctx.beginPath();
        ctx.arc(-ball.radius / 3, -ball.radius / 3, ball.radius / 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // Empty dependency array - runs once

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
      <div className="flex items-center justify-between w-full max-w-4xl">
        <div className="text-white">
          <h1 className="text-3xl mb-2">🎯 핀볼 게임</h1>
          <div className="flex gap-8">
            <div>
              <span className="text-gray-400">점수:</span>
              <span className="ml-2 text-2xl text-yellow-400">{score.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400">공 개수:</span>
              <span className="ml-2 text-xl">{ballCount}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={startGame}
            disabled={isPlaying}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="mr-2 size-5" />
            시작
          </Button>
          <Button
            onClick={resetGame}
            size="lg"
            variant="outline"
          >
            <RotateCcw className="mr-2 size-5" />
            리셋
          </Button>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border border-gray-700 rounded-lg shadow-2xl"
        />
        {!isPlaying && ballCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 px-8 py-6 rounded-lg border border-gray-700">
              <p className="text-white text-xl text-center">
                시작 버튼을 눌러 게임을 시작하세요! 🎮
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="text-gray-400 text-center max-w-2xl">
        <p>공이 떨어지면서 페그에 부딪히며 슬롯에 도착합니다.</p>
        <p>골인 직전에는 공이 확대되며 긴장감을 더합니다! 🎯</p>
      </div>
    </div>
  );
}
