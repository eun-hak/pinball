'use client'

import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Plus, X, Trophy, Skull, Bomb, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Player {
  id: number;
  name: string;
  color: string;
  alive: boolean;
  deathTime?: number;
}

interface PhysicsBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
}

interface GameBall extends PhysicsBody {
  playerId: number;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  force: number;
  life: number; // 0 to 1
  type: 'warning' | 'boom';
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#A29BFE', '#FD79A8', '#6C5CE7', 
  '#00B894', '#FDCB6E', '#E17055', '#FF85A2'
];

export function SurvivalGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [players, setPlayers] = useState<string[]>(['철수', '영희', '맹구', '훈이']);
  const [newPlayer, setNewPlayer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameTime, setGameTime] = useState(0);
  
  const isPlayingRef = useRef(false);
  const playersRef = useRef<Player[]>([]);
  const ballsRef = useRef<GameBall[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const nextBombTimeRef = useRef(0);

  const CANVAS_SIZE = 800;
  const INITIAL_SAFE_RADIUS = 350;
  const BALL_RADIUS = 20;
  const FRICTION = 0.98;
  const RESTITUTION = 0.8; // Bounciness

  // Game State Refs for loop access
  const safeRadiusRef = useRef(INITIAL_SAFE_RADIUS);

  const initializeGame = () => {
    const loadedPlayers: Player[] = players.map((name, i) => ({
      id: i,
      name,
      color: COLORS[i % COLORS.length],
      alive: true
    }));
    
    playersRef.current = loadedPlayers;
    
    // Spawn balls in a circle
    const radius = 200;
    const angleStep = (Math.PI * 2) / players.length;
    
    ballsRef.current = loadedPlayers.map((p, i) => ({
      playerId: p.id,
      x: CANVAS_SIZE/2 + Math.cos(angleStep * i) * radius,
      y: CANVAS_SIZE/2 + Math.sin(angleStep * i) * radius,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
      mass: 1
    }));

    explosionsRef.current = [];
    safeRadiusRef.current = INITIAL_SAFE_RADIUS;
    timeRef.current = 0;
    nextBombTimeRef.current = 2; // First bomb after 2s
    setWinner(null);
    setGameTime(0);
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

  const addPlayer = () => {
    if (newPlayer.trim() && players.length < 16) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer('');
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      if (isPlayingRef.current) {
        const dt = 1/60;
        timeRef.current += dt;
        setGameTime(timeRef.current);

        // 1. Shrink Safe Zone
        if (safeRadiusRef.current > 100) {
          safeRadiusRef.current -= 0.1; // Slow shrink
        }

        // 2. Spawn Bombs
        if (timeRef.current > nextBombTimeRef.current) {
          // Difficulty curve: Bombs spawn faster over time
          const interval = Math.max(0.5, 2 - timeRef.current * 0.05); 
          nextBombTimeRef.current = timeRef.current + interval;

          const angle = Math.random() * Math.PI * 2;
          const r = Math.sqrt(Math.random()) * (safeRadiusRef.current - 50); // Within safe zone mostly
          
          explosionsRef.current.push({
            id: Math.random(),
            x: CANVAS_SIZE/2 + Math.cos(angle) * r,
            y: CANVAS_SIZE/2 + Math.sin(angle) * r,
            radius: 0,
            maxRadius: 80 + Math.random() * 40, // Random size
            force: 15 + Math.random() * 10,
            life: 0,
            type: 'warning'
          });
        }

        // 3. Update Explosions
        explosionsRef.current = explosionsRef.current.filter(exp => {
          if (exp.type === 'warning') {
            exp.life += 0.02;
            if (exp.life >= 1) {
              exp.type = 'boom';
              exp.life = 1.0; // Reset for boom decay
              
              // Apply force to balls immediately on boom
              ballsRef.current.forEach(ball => {
                const dx = ball.x - exp.x;
                const dy = ball.y - exp.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < exp.maxRadius + ball.radius + 50) {
                   const angle = Math.atan2(dy, dx);
                   const force = exp.force * (1 - dist / (exp.maxRadius + 100)); // Falloff
                   if (force > 0) {
                     ball.vx += Math.cos(angle) * force;
                     ball.vy += Math.sin(angle) * force;
                   }
                }
              });
            }
            return true;
          } else {
            // Boom phase
            exp.life -= 0.05; // Quick fade
            return exp.life > 0;
          }
        });

        // 4. Physics Update
        // Ball-Ball Collision
        for (let i = 0; i < ballsRef.current.length; i++) {
          for (let j = i + 1; j < ballsRef.current.length; j++) {
            const b1 = ballsRef.current[i];
            const b2 = ballsRef.current[j];
            
            // Skip if either is dead (far away) - actually we remove them but let's be safe
            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = b1.radius + b2.radius;

            if (dist < minDist) {
              const angle = Math.atan2(dy, dx);
              const tx = Math.cos(angle) * minDist;
              const ty = Math.sin(angle) * minDist;
              
              // Separate
              const overlap = minDist - dist;
              const ax = Math.cos(angle) * overlap * 0.5;
              const ay = Math.sin(angle) * overlap * 0.5;
              
              b1.x -= ax;
              b1.y -= ay;
              b2.x += ax;
              b2.y += ay;

              // Bounce (Elastic)
              const nx = Math.cos(angle);
              const ny = Math.sin(angle);
              
              // Dot product velocity along normal
              const dvx = b2.vx - b1.vx;
              const dvy = b2.vy - b1.vy;
              const dot = dvx * nx + dvy * ny;

              if (dot < 0) {
                const impulse = -(1 + RESTITUTION) * dot * 0.5; // 0.5 because equal mass
                b1.vx -= nx * impulse;
                b1.vy -= ny * impulse;
                b2.vx += nx * impulse;
                b2.vy += ny * impulse;
              }
            }
          }
        }

        // Movement & Friction
        ballsRef.current.forEach(ball => {
          ball.x += ball.vx;
          ball.y += ball.vy;
          ball.vx *= FRICTION;
          ball.vy *= FRICTION;

          // Check Death
          const distFromCenter = Math.sqrt(
            Math.pow(ball.x - CANVAS_SIZE/2, 2) + 
            Math.pow(ball.y - CANVAS_SIZE/2, 2)
          );

          if (distFromCenter > safeRadiusRef.current + ball.radius) {
             // Player died
             const player = playersRef.current.find(p => p.id === ball.playerId);
             if (player && player.alive) {
               player.alive = false;
               player.deathTime = timeRef.current;
             }
          }
        });

        // Remove dead balls from physics array
        const aliveIds = new Set(playersRef.current.filter(p => p.alive).map(p => p.id));
        ballsRef.current = ballsRef.current.filter(b => aliveIds.has(b.playerId));

        // Check Winner
        const alivePlayers = playersRef.current.filter(p => p.alive);
        if (alivePlayers.length <= 1 && players.length > 1 && !winner) {
           if (alivePlayers.length === 1) {
             setWinner(alivePlayers[0]);
             setIsPlaying(false);
             isPlayingRef.current = false;
           } else if (alivePlayers.length === 0 && !winner) {
             // Everyone died same frame? Tie or last one
             setIsPlaying(false);
             isPlayingRef.current = false;
           }
        }
      }

      // --- RENDER ---
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      const centerX = CANVAS_SIZE / 2;
      const centerY = CANVAS_SIZE / 2;

      // Draw Void/Danger Zone
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.arc(centerX, centerY, safeRadiusRef.current, 0, Math.PI * 2, true);
      ctx.fillStyle = 'rgba(255, 50, 50, 0.15)'; // Red tint for void
      ctx.fill();
      ctx.restore();

      // Draw Safe Zone Boundary
      ctx.beginPath();
      ctx.arc(centerX, centerY, safeRadiusRef.current, 0, Math.PI * 2);
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 4;
      ctx.setLineDash([20, 10]);
      // Rotate the border for visual effect
      ctx.lineDashOffset = -timeRef.current * 20; 
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00ffff';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Explosions
      explosionsRef.current.forEach(exp => {
        if (exp.type === 'warning') {
          // Warning circle
          ctx.beginPath();
          ctx.arc(exp.x, exp.y, exp.maxRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 50, 0, ${0.2 + exp.life * 0.3})`;
          ctx.fill();
          ctx.strokeStyle = '#ff3300';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Loading timer (growing inner circle)
          ctx.beginPath();
          ctx.arc(exp.x, exp.y, exp.maxRadius * exp.life, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 200, 0, 0.3)';
          ctx.fill();
        } else {
          // BOOM
          ctx.beginPath();
          ctx.arc(exp.x, exp.y, exp.maxRadius, 0, Math.PI * 2);
          const alpha = exp.life;
          const gradient = ctx.createRadialGradient(exp.x, exp.y, 0, exp.x, exp.y, exp.maxRadius);
          gradient.addColorStop(0, `rgba(255, 255, 200, ${alpha})`);
          gradient.addColorStop(0.4, `rgba(255, 100, 0, ${alpha})`);
          gradient.addColorStop(1, `rgba(50, 0, 0, 0)`);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      // Draw Balls
      ballsRef.current.forEach(ball => {
        const player = playersRef.current.find(p => p.id === ball.playerId);
        if (!player) return;

        ctx.save();
        ctx.translate(ball.x, ball.y);
        
        // Body
        ctx.beginPath();
        ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Face (cute expression)
        ctx.fillStyle = '#fff';
        // Eyes
        const speed = Math.sqrt(ball.vx*ball.vx + ball.vy*ball.vy);
        const eyeOffset = Math.min(5, speed); // Eyes move with speed
        const angle = Math.atan2(ball.vy, ball.vx);
        
        const eyeX = Math.cos(angle) * eyeOffset;
        const eyeY = Math.sin(angle) * eyeOffset;

        ctx.beginPath();
        ctx.arc(-6 + eyeX, -2 + eyeY, 4, 0, Math.PI * 2);
        ctx.arc(6 + eyeX, -2 + eyeY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Name
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.fillText(player.name, 0, -ball.radius - 8);

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
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            💣 서바이벌 참가자
          </h3>
          
          <div className="flex gap-2 mb-4">
            <Input
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="이름 입력"
              className="bg-gray-800 border-gray-700 text-white"
              disabled={isPlaying}
            />
            <Button
              onClick={addPlayer}
              size="icon"
              disabled={isPlaying || players.length >= 16}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="size-5" />
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {players.map((player, i) => {
              const playerData = playersRef.current.find(p => p.name === player);
              const isDead = isPlaying && playerData && !playerData.alive;
              
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg border transition-all ${
                    isDead 
                      ? 'bg-red-900/20 border-red-800 opacity-60' 
                      : 'bg-gray-800/50 border-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isDead ? (
                      <Skull className="size-4 text-red-500" />
                    ) : (
                      <div
                        className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]"
                        style={{ backgroundColor: COLORS[i % COLORS.length], color: COLORS[i % COLORS.length] }}
                      />
                    )}
                    <span className={`text-white ${isDead ? 'line-through text-gray-500' : ''}`}>
                      {player}
                    </span>
                  </div>
                  <button
                    onClick={() => removePlayer(i)}
                    disabled={isPlaying}
                    className="text-gray-500 hover:text-red-400 disabled:opacity-50"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={startGame}
              disabled={isPlaying || players.length < 2}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-none shadow-lg"
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
          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 backdrop-blur-md border border-yellow-700 rounded-xl p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
              <Trophy className="size-6" />
              최종 생존자!
            </h3>
            <div className="text-4xl font-black text-white mt-4 mb-2 text-center">
              {winner.name}
            </div>
            <p className="text-yellow-200/60 text-center text-sm">
              {gameTime.toFixed(1)}초 동안 생존
            </p>
          </div>
        )}
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-sm text-gray-400">
          <div className="flex items-center gap-2 mb-2 text-white font-bold">
            <Bomb className="size-4 text-red-500" /> 게임 규칙
          </div>
          <ul className="list-disc list-inside space-y-1">
            <li>폭탄을 피해 안전 구역에 머무르세요.</li>
            <li>안전 구역(파란 원) 밖으로 나가면 탈락합니다.</li>
            <li>시간이 지날수록 안전 구역이 줄어듭니다!</li>
            <li>마지막까지 살아남는 사람이 승리합니다.</li>
          </ul>
        </div>
      </div>

      {/* Main Canvas - PC: 항상 보임, Mobile: 게임 시작 후에만 보임 */}
      <div className={`flex-1 flex flex-col items-center justify-center bg-gray-950/50 rounded-xl border border-gray-800 shadow-2xl p-4 ${isPlaying ? 'flex' : 'hidden md:flex'}`}>
        {/* Mobile: 게임 중 뒤로가기 버튼 */}
        {isPlaying && (
          <div className="w-full flex justify-start mb-3 md:hidden">
            <Button
              onClick={resetGame}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="size-4 mr-2" />
              설정으로
            </Button>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-gray-900"
          style={{ 
            maxWidth: '100%', 
            maxHeight: '85vh',
            aspectRatio: '1/1'
          }}
        />
        <div className="mt-4 text-gray-500 font-mono text-xl">
          ⏱️ Time: <span className="text-white">{gameTime.toFixed(1)}s</span>
        </div>
      </div>
    </div>
  );
}
