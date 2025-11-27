'use client'

import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Plus, X, Trophy, Palette, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface Player {
  id: number;
  name: string;
  color: string;
  score: number;
  percent: number;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  playerId: number;
  color: string;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

const COLORS = [
  '#FF0055', '#00FF99', '#00CCFF', '#FFCC00', 
  '#CC00FF', '#FF6600', '#00FF00', '#0066FF'
];

export function ColorGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [players, setPlayers] = useState<string[]>(['레드팀', '그린팀', '블루팀', '옐로팀']);
  const [newPlayer, setNewPlayer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [winner, setWinner] = useState<Player | null>(null);

  const isPlayingRef = useRef(false);
  const playersRef = useRef<Player[]>([]);
  const ballsRef = useRef<Ball[]>([]);
  const gridRef = useRef<number[]>([]); // Flat array for grid colors (playerId or -1)
  const shockwavesRef = useRef<Shockwave[]>([]);
  const animationRef = useRef<number>();
  
  const CANVAS_SIZE = 800;
  const GRID_SIZE = 40; // 40x40 grid = 1600 tiles
  const TILE_SIZE = CANVAS_SIZE / GRID_SIZE;
  const GAME_DURATION = 10;

  const initializeGame = () => {
    // Initialize Grid
    gridRef.current = new Array(GRID_SIZE * GRID_SIZE).fill(-1);

    // Initialize Players
    const loadedPlayers = players.map((name, i) => ({
      id: i,
      name,
      color: COLORS[i % COLORS.length],
      score: 0,
      percent: 0
    }));
    playersRef.current = loadedPlayers;

    // Initialize Balls (Each player gets 3 balls)
    const balls: Ball[] = [];
    loadedPlayers.forEach(p => {
      for (let i = 0; i < 3; i++) {
        balls.push({
          x: CANVAS_SIZE / 2 + (Math.random() - 0.5) * 100,
          y: CANVAS_SIZE / 2 + (Math.random() - 0.5) * 100,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15,
          radius: 12,
          playerId: p.id,
          color: p.color
        });
      }
    });
    ballsRef.current = balls;
    shockwavesRef.current = [];

    setTimeLeft(GAME_DURATION);
    setWinner(null);
  };

  const startGame = () => {
    initializeGame();
    setIsPlaying(true);
    isPlayingRef.current = true;
  };

  const resetGame = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    initializeGame();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add visual shockwave
    shockwavesRef.current.push({
      x,
      y,
      radius: 10,
      maxRadius: 150,
      alpha: 1.0
    });

    // Apply physics force to balls
    ballsRef.current.forEach(ball => {
      const dx = ball.x - x;
      const dy = ball.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 150) {
        const angle = Math.atan2(dy, dx);
        const force = (150 - dist) / 5; // Stronger force closer to click
        ball.vx += Math.cos(angle) * force;
        ball.vy += Math.sin(angle) * force;
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlayingRef.current) {
        // Timer
        setTimeLeft(prev => {
          const newTime = Math.max(0, prev - dt);
          if (newTime === 0 && prev > 0) {
            // Game Over
            isPlayingRef.current = false;
            setIsPlaying(false);
            const sorted = [...playersRef.current].sort((a, b) => b.score - a.score);
            setWinner(sorted[0]);
          }
          return newTime;
        });

        // Physics & Painting
        ballsRef.current.forEach(ball => {
          // Move
          ball.x += ball.vx;
          ball.y += ball.vy;
          
          // Friction (Balls slow down to encourage clicking)
          ball.vx *= 0.98;
          ball.vy *= 0.98;

          // Wall Bounce
          if (ball.x < ball.radius) { ball.x = ball.radius; ball.vx *= -0.8; }
          if (ball.x > CANVAS_SIZE - ball.radius) { ball.x = CANVAS_SIZE - ball.radius; ball.vx *= -0.8; }
          if (ball.y < ball.radius) { ball.y = ball.radius; ball.vy *= -0.8; }
          if (ball.y > CANVAS_SIZE - ball.radius) { ball.y = CANVAS_SIZE - ball.radius; ball.vy *= -0.8; }

          // Paint Grid
          const gridX = Math.floor(ball.x / TILE_SIZE);
          const gridY = Math.floor(ball.y / TILE_SIZE);
          
          // Paint 3x3 area around ball
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const tx = gridX + dx;
              const ty = gridY + dy;
              
              if (tx >= 0 && tx < GRID_SIZE && ty >= 0 && ty < GRID_SIZE) {
                const idx = ty * GRID_SIZE + tx;
                // Only repaint if it's not already own color
                if (gridRef.current[idx] !== ball.playerId) {
                  gridRef.current[idx] = ball.playerId;
                }
              }
            }
          }
        });

        // Score Calculation (Every 10 frames or so for performance? Doing per frame is fine for 1600 tiles)
        const counts = new Array(playersRef.current.length).fill(0);
        let totalPainted = 0;
        gridRef.current.forEach(pid => {
          if (pid !== -1) {
            counts[pid]++;
            totalPainted++;
          }
        });

        playersRef.current.forEach(p => {
          p.score = counts[p.id];
          p.percent = (counts[p.id] / (GRID_SIZE * GRID_SIZE)) * 100;
        });

        // Ball Collisions
        for (let i = 0; i < ballsRef.current.length; i++) {
          for (let j = i + 1; j < ballsRef.current.length; j++) {
             const b1 = ballsRef.current[i];
             const b2 = ballsRef.current[j];
             const dx = b2.x - b1.x;
             const dy = b2.y - b1.y;
             const dist = Math.sqrt(dx*dx + dy*dy);
             
             if (dist < b1.radius + b2.radius) {
               // Simple elastic collision
               const angle = Math.atan2(dy, dx);
               const speed1 = Math.sqrt(b1.vx*b1.vx + b1.vy*b1.vy);
               const speed2 = Math.sqrt(b2.vx*b2.vx + b2.vy*b2.vy);
               
               b1.vx = -Math.cos(angle) * speed2 * 0.8;
               b1.vy = -Math.sin(angle) * speed2 * 0.8;
               b2.vx = Math.cos(angle) * speed1 * 0.8;
               b2.vy = Math.sin(angle) * speed1 * 0.8;
               
               // Push apart
               const overlap = (b1.radius + b2.radius - dist) / 2;
               b1.x -= Math.cos(angle) * overlap;
               b1.y -= Math.sin(angle) * overlap;
               b2.x += Math.cos(angle) * overlap;
               b2.y += Math.sin(angle) * overlap;
             }
          }
        }
      }

      // --- RENDER ---
      // 1. Draw Grid
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      gridRef.current.forEach((pid, i) => {
        if (pid !== -1) {
          const x = (i % GRID_SIZE) * TILE_SIZE;
          const y = Math.floor(i / GRID_SIZE) * TILE_SIZE;
          const player = playersRef.current.find(p => p.id === pid);
          if (player) {
            ctx.fillStyle = player.color;
            ctx.globalAlpha = 0.6;
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE); // +1 to remove gaps
            ctx.globalAlpha = 1.0;
          }
        }
      });

      // 2. Draw Grid Lines (Subtle)
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.moveTo(i * TILE_SIZE, 0);
        ctx.lineTo(i * TILE_SIZE, CANVAS_SIZE);
        ctx.moveTo(0, i * TILE_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * TILE_SIZE);
      }
      ctx.stroke();

      // 3. Draw Shockwaves
      shockwavesRef.current.forEach((sw, i) => {
        sw.radius += 5;
        sw.alpha -= 0.05;
        if (sw.alpha <= 0) {
           shockwavesRef.current.splice(i, 1);
           return;
        }
        
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${sw.alpha})`;
        ctx.lineWidth = 4;
        ctx.stroke();
      });

      // 4. Draw Balls
      ballsRef.current.forEach(ball => {
        ctx.save();
        ctx.translate(ball.x, ball.y);
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = ball.color;
        
        ctx.beginPath();
        ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
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
  }, []);

  return (
    <div className="flex gap-6 p-8 min-h-screen">
      {/* Left Panel - PC: 항상 보임, Mobile: 게임 시작 전에만 보임 */}
      <div className={`w-80 space-y-6 ${isPlaying ? 'hidden md:block' : 'block'}`}>
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Palette className="size-5 text-pink-500" /> 
              Color Conquest
            </h3>
            <div className="text-2xl font-mono text-white">
              {timeLeft.toFixed(0)}s
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar mb-6">
            {playersRef.current.length > 0 ? playersRef.current.map((player) => (
              <div
                key={player.id}
                className="bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-700/50 relative overflow-hidden"
              >
                {/* Progress Bar Background */}
                <div 
                  className="absolute left-0 top-0 bottom-0 opacity-20 transition-all duration-300"
                  style={{ 
                    width: `${player.percent}%`,
                    backgroundColor: player.color 
                  }}
                />
                
                <div className="relative flex justify-between items-center z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: player.color }}
                    />
                    <span className="text-white font-medium">{player.name}</span>
                  </div>
                  <span className="text-white font-mono font-bold">
                    {player.percent.toFixed(1)}%
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-gray-500 text-center py-4">시작 버튼을 눌러주세요</div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={startGame}
              disabled={isPlaying}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 border-none shadow-lg"
            >
              <Play className="mr-2 size-5 fill-current" />
              START
            </Button>
            <Button
              onClick={resetGame}
              variant="outline"
              className="flex-1 border-gray-600 hover:bg-gray-800 text-gray-300"
            >
              <RotateCcw className="mr-2 size-5" />
              RESET
            </Button>
          </div>
        </div>

        {winner && (
          <div className="bg-gradient-to-br from-pink-900/50 to-rose-900/50 backdrop-blur-md border border-pink-700 rounded-xl p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-bold text-pink-400 mb-2 flex items-center gap-2">
              <Trophy className="size-6" />
              승리!
            </h3>
            <div className="text-4xl font-black text-white mt-4 mb-2 text-center">
              {winner.name}
            </div>
            <p className="text-pink-200/60 text-center text-sm">
              전체 영역의 {winner.percent.toFixed(1)}% 점령
            </p>
          </div>
        )}
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-sm text-gray-400">
          <div className="flex items-center gap-2 mb-2 text-white font-bold">
            <Zap className="size-4 text-yellow-500" /> 게임 팁
          </div>
          <p>화면을 클릭하여 충격파를 일으키세요!</p>
          <p className="mt-1">공들이 멈추면 클릭해서 다시 굴려야 땅을 더 많이 칠할 수 있습니다.</p>
        </div>
      </div>

      {/* Main Canvas - PC: 항상 보임, Mobile: 게임 시작 후에만 보임 */}
      <div className={`flex-1 flex flex-col items-center justify-center bg-gray-950/50 rounded-xl border border-gray-800 shadow-2xl p-4 ${isPlaying ? 'flex' : 'hidden md:flex'}`}>
        {/* Mobile: 게임 중 상단 바 (뒤로가기 + 시간) */}
        {isPlaying && (
          <div className="w-full flex justify-between items-center mb-3 md:hidden">
            <Button
              onClick={resetGame}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="size-4 mr-2" />
              설정으로
            </Button>
            {/* 모바일 시간 표시 */}
            <div className="bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-lg px-4 py-2">
              <div className="text-2xl font-mono text-white font-bold">
                {timeLeft.toFixed(1)}s
              </div>
            </div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onClick={handleCanvasClick}
          className="rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-black cursor-pointer hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-shadow"
          style={{ 
            maxWidth: '100%', 
            maxHeight: '85vh',
            aspectRatio: '1/1'
          }}
        />
      </div>
    </div>
  );
}