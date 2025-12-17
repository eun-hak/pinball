"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Plus, X, Trophy, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useIsMobile } from "../ui/use-mobile";

interface RaceBall {
  id: number;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  finished: boolean;
  finishTime?: number;
  rank?: number;
}

interface Obstacle {
  type: "peg" | "zigzag" | "triangle" | "spinner" | "platform";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  angle?: number;
  speed?: number;
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#A29BFE",
  "#FD79A8",
  "#6C5CE7",
  "#00B894",
  "#FDCB6E",
  "#E17055",
  "#FF85A2",
];

export function RaceGame() {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ballsRef = useRef<RaceBall[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const [players, setPlayers] = useState<string[]>(["짱아", "짱구", "봉미선"]);
  const [newPlayer, setNewPlayer] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [rankings, setRankings] = useState<
    { name: string; time: number; color: string }[]
  >([]);
  const animationRef = useRef<number>();
  const isPlayingRef = useRef(false);
  const timeRef = useRef(0);
  
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 4000;
  
  // 카메라 시스템 (roulette-main 방식 - Canvas 변환)
  const cameraRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    zoom: number;
    targetZoom: number;
    shouldFollow: boolean;
  }>({
    x: CANVAS_WIDTH / 2,
    y: 0,
    targetX: CANVAS_WIDTH / 2,
    targetY: 0,
    zoom: 1,
    targetZoom: 1, // 게임 시작 전에는 확대하지 않음
    shouldFollow: false,
  });
  const TRACK_WIDTH = 800; // Increased track width
  const BALL_RADIUS = 22; // Increased ball size
  const GRAVITY = 0.5;
  const BOUNCE = 0.8; // Higher bounce for "glass/marble" feel
  const FRICTION = 0.999; // Very low friction (almost none)
  const FINISH_LINE = CANVAS_HEIGHT - 200;
  const MIN_DOWNWARD_VELOCITY = 0.5; // Reduced artificial push

  useEffect(() => {
    initializeObstacles();
  }, []);

  const initializeObstacles = () => {
    const obstacles: Obstacle[] = [];
    const centerX = CANVAS_WIDTH / 2;

    // 1. THE SPLITTER (Top)
    // Large triangle to break up the pack immediately
    obstacles.push({
      type: "triangle",
      x: centerX,
      y: 400,
      radius: 60,
    });

    // 2. CROSSOVER RAMPS (High speed funneling)
    // Steep angles to ensure no stopping
    const rampAngle = 0.4; // ~23 degrees

    // Left-to-Right Ramps
    obstacles.push({
      type: "zigzag",
      x: centerX - 250,
      y: 600,
      width: 350,
      height: 20,
      angle: rampAngle,
    });
    obstacles.push({
      type: "zigzag",
      x: centerX + 250,
      y: 800,
      width: 350,
      height: 20,
      angle: -rampAngle,
    });

    // Right-to-Left Ramps
    obstacles.push({
      type: "zigzag",
      x: centerX - 250,
      y: 1000,
      width: 350,
      height: 20,
      angle: rampAngle,
    });
    obstacles.push({
      type: "zigzag",
      x: centerX + 250,
      y: 1200,
      width: 350,
      height: 20,
      angle: -rampAngle,
    });

    // 3. SPINNER CHAOS ZONE (Active Obstacles)
    // Multiple spinners rotating in different directions
    for (let i = 0; i < 4; i++) {
      const y = 1500 + i * 450;

      // Center spinner
      obstacles.push({
        type: "spinner",
        x: centerX,
        y: y,
        width: 300,
        height: 20,
        angle: Math.PI / 4, // Start at angle so balls don't hit flat
        speed: i % 2 === 0 ? 0.03 : -0.03,
      });

      // Side bumpers to keep balls in play
      obstacles.push({ type: "triangle", x: centerX - 300, y: y, radius: 30 });
      obstacles.push({ type: "triangle", x: centerX + 300, y: y, radius: 30 });
    }

    // 4. THE PLINKO FIELD (Randomness)
    // Dense grid of pegs for final scrambling
    for (let row = 0; row < 12; row++) {
      const y = 3000 + row * 120;
      const isOdd = row % 2 !== 0;
      const cols = isOdd ? 6 : 7;

      for (let col = 0; col < cols; col++) {
        const x = centerX - 300 + col * 100 + (isOdd ? 50 : 0);
        // Randomly skip some pegs to create "lanes"
        if (Math.random() > 0.1) {
          obstacles.push({
            type: "peg",
            x: x,
            y: y,
            radius: 10,
          });
        }
      }
    }

    obstaclesRef.current = obstacles;
  };

  const addPlayer = () => {
    if (newPlayer.trim() && players.length < 20) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer("");
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const startRace = () => {
    setIsPlaying(true);
    isPlayingRef.current = true;
    setRankings([]);
    timeRef.current = 0;

    const centerX = CANVAS_WIDTH / 2;
    const availableWidth = TRACK_WIDTH - 100;
    const spacing = Math.min(60, availableWidth / players.length);
    const startX = centerX - ((players.length - 1) * spacing) / 2;

    // 카메라 초기화 (Canvas 변환 방식)
    // 게임 시작 시에는 확대하지 않음 (모바일: 0.3, PC: 1)
    const mobileZoom = 0.3;
    const startZoom = isMobile ? mobileZoom : 1;
    
    cameraRef.current.x = CANVAS_WIDTH / 2;
    cameraRef.current.y = 150;
    cameraRef.current.targetX = CANVAS_WIDTH / 2;
    cameraRef.current.targetY = 150;
    cameraRef.current.zoom = startZoom;
    cameraRef.current.targetZoom = startZoom; // 게임 시작 시 확대하지 않음
    cameraRef.current.shouldFollow = true;

    ballsRef.current = players.map((name, i) => ({
      id: i,
      name,
      x: startX + i * spacing,
      y: 150,
      vx: (Math.random() - 0.5) * 4, // More initial chaos
      vy: Math.random() * 5 + 2, // Ensure downward start
      radius: BALL_RADIUS,
      color: COLORS[i % COLORS.length],
      finished: false,
    }));
  };

  const resetRace = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    ballsRef.current = [];
    setRankings([]);
    timeRef.current = 0;
    cameraRef.current.shouldFollow = false;
    cameraRef.current.x = CANVAS_WIDTH / 2;
    cameraRef.current.y = 0;
    cameraRef.current.targetX = CANVAS_WIDTH / 2;
    cameraRef.current.targetY = 0;
    // 모바일에서는 전체 맵이 보이도록 작게, PC에서는 기본 크기
    const resetZoom = isMobile ? 0.3 : 1;
    cameraRef.current.zoom = resetZoom;
    cameraRef.current.targetZoom = resetZoom;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas 크기를 컨테이너에 맞춤
    const resizeCanvas = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      if (isPlayingRef.current) {
        timeRef.current += 1 / 60;
      }

      // Canvas 크기 재조정
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
      }

      // 카메라 업데이트: 선두 구슬 찾기 및 포커스 (Canvas 변환 방식)
      const cam = cameraRef.current;
      
      // 모바일과 PC의 zoom 설정
      const mobileZoom = 0.3; // 모바일: 전체 맵이 보이도록 더 작게
      
      // 게임 시작 전에는 확대하지 않음
      if (!cam.shouldFollow) {
        cam.targetZoom = isMobile ? mobileZoom : 1;
      } else {
        // 게임 중에도 모바일에서는 작게, PC에서는 기본 크기 유지 (확대하지 않음)
        cam.targetZoom = isMobile ? mobileZoom : 1;
      }
      
      if (cam.shouldFollow && ballsRef.current.length > 0) {
        const activeBalls = ballsRef.current.filter((ball) => !ball.finished);
        if (activeBalls.length > 0) {
          // 선두 구슬 찾기 (Y값이 가장 큰 구슬 = 가장 아래로 가는 구슬 = 가장 앞서있는 구슬)
          const leadingBall = activeBalls.reduce((prev, current) => 
            current.y > prev.y ? current : prev
          );
          
          // 카메라가 선두 구슬을 화면 중앙에 오도록 타겟 설정
          cam.targetX = leadingBall.x;
          cam.targetY = leadingBall.y;
        }
      }

      // 카메라 부드러운 보간 (roulette-main 참고)
      const interp = (current: number, target: number) => {
        const d = target - current;
        if (Math.abs(d) < 0.01) return target;
        return current + d / 10;
      };
      
      cam.x = interp(cam.x, cam.targetX);
      cam.y = interp(cam.y, cam.targetY);
      cam.zoom = interp(cam.zoom, cam.targetZoom);

      // Canvas 변환 적용 (뷰포트 고정, 확대, 포커스)
      ctx.save();
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 카메라 변환: 화면 중앙에 구슬이 오도록
      const viewWidth = canvas.width;
      const viewHeight = canvas.height;
      ctx.translate(viewWidth / 2, viewHeight / 2);
      ctx.scale(cam.zoom, cam.zoom);
      ctx.translate(-cam.x, -cam.y);

      // Track boundaries
      const centerX = CANVAS_WIDTH / 2;
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 5;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00ffff";
      ctx.beginPath();
      ctx.moveTo(centerX - TRACK_WIDTH / 2, 50);
      ctx.lineTo(centerX - TRACK_WIDTH / 2, FINISH_LINE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX + TRACK_WIDTH / 2, 50);
      ctx.lineTo(centerX + TRACK_WIDTH / 2, FINISH_LINE);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Finish line
      ctx.strokeStyle = "#ffff00";
      ctx.lineWidth = 8;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#ffff00";
      const finishY = FINISH_LINE;

      // Checkerboard pattern for finish line
      const checkSize = 40;
      const numChecks = TRACK_WIDTH / checkSize;
      for (let i = 0; i < numChecks; i++) {
        if (i % 2 === 0) {
          ctx.fillStyle = "#ffff00";
          ctx.fillRect(
            centerX - TRACK_WIDTH / 2 + i * checkSize,
            finishY,
            checkSize,
            20
          );
        }
      }

      ctx.shadowBlur = 0;

      // Update and draw obstacles
      obstaclesRef.current.forEach((obs) => {
        ctx.fillStyle = "#333";
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 3;

        if (obs.type === "zigzag" && obs.width && obs.height && obs.angle) {
          ctx.save();
          ctx.translate(obs.x, obs.y);
          ctx.rotate(obs.angle);
          ctx.fillStyle = "#2a2a2a";
          ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
          ctx.strokeRect(
            -obs.width / 2,
            -obs.height / 2,
            obs.width,
            obs.height
          );

          // Add direction arrows
          ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
          ctx.beginPath();
          ctx.moveTo(-20, -10);
          ctx.lineTo(20, 0);
          ctx.lineTo(-20, 10);
          ctx.fill();

          ctx.restore();
        } else if (obs.type === "triangle" && obs.radius) {
          ctx.save();
          ctx.translate(obs.x, obs.y);
          ctx.beginPath();
          for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
            const x = Math.cos(angle) * obs.radius;
            const y = Math.sin(angle) * obs.radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fillStyle = "#444";
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        } else if (obs.type === "peg" && obs.radius) {
          ctx.beginPath();
          ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
          ctx.fillStyle = "#555";
          ctx.fill();
          ctx.stroke();
        } else if (
          obs.type === "spinner" &&
          obs.width &&
          obs.height &&
          obs.speed
        ) {
          obs.angle = (obs.angle || 0) + obs.speed;
          ctx.save();
          ctx.translate(obs.x, obs.y);
          ctx.rotate(obs.angle);
          ctx.fillStyle = "#666";
          ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
          ctx.strokeRect(
            -obs.width / 2,
            -obs.height / 2,
            obs.width,
            obs.height
          );
          ctx.restore();
        }
      });

      // Update balls
      if (isPlayingRef.current) {
        ballsRef.current = ballsRef.current.map((ball) => {
          if (ball.finished) return ball;

          let newBall = { ...ball };

          newBall.vy += GRAVITY;
          newBall.vx *= FRICTION;
          newBall.vy *= FRICTION;
          newBall.x += newBall.vx;
          newBall.y += newBall.vy;

          // Collision with obstacles
          obstaclesRef.current.forEach((obs) => {
            // Circle collision (Pegs & Triangles approximated as circles for smoother bounce)
            if (obs.type === "peg" || obs.type === "triangle") {
              const r = obs.radius || 10;
              const dx = newBall.x - obs.x;
              const dy = newBall.y - obs.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDist = newBall.radius + r;

              if (distance < minDist) {
                const angle = Math.atan2(dy, dx);
                // Move out of collision
                newBall.x = obs.x + Math.cos(angle) * minDist;
                newBall.y = obs.y + Math.sin(angle) * minDist;

                // Add some random deviation to prevent stacking
                const noise = (Math.random() - 0.5) * 0.2;

                // Bounce with energy preservation
                const speed = Math.sqrt(
                  newBall.vx * newBall.vx + newBall.vy * newBall.vy
                );
                newBall.vx = Math.cos(angle + noise) * speed * 0.9; // High restitution
                newBall.vy = Math.sin(angle + noise) * speed * 0.9;

                // Ensure minimal bounce speed
                if (speed < 1) {
                  newBall.vx += Math.cos(angle) * 1;
                  newBall.vy += Math.sin(angle) * 1;
                }
              }
            } else if (
              (obs.type === "zigzag" || obs.type === "spinner") &&
              obs.width &&
              obs.height &&
              obs.angle !== undefined
            ) {
              // Rotated rectangle collision
              const localX = newBall.x - obs.x;
              const localY = newBall.y - obs.y;
              const cos = Math.cos(-obs.angle);
              const sin = Math.sin(-obs.angle);
              const rotatedX = localX * cos - localY * sin;
              const rotatedY = localX * sin + localY * cos;

              const halfW = obs.width / 2;
              const halfH = obs.height / 2;

              if (
                Math.abs(rotatedX) < halfW + newBall.radius &&
                Math.abs(rotatedY) < halfH + newBall.radius
              ) {
                let dx = 0,
                  dy = 0;

                if (Math.abs(rotatedX) < halfW) {
                  if (rotatedY > 0) {
                    dy = halfH + newBall.radius - rotatedY;
                  } else {
                    dy = -(halfH + newBall.radius + rotatedY);
                  }
                } else {
                  if (rotatedX > 0) {
                    dx = halfW + newBall.radius - rotatedX;
                  } else {
                    dx = -(halfW + newBall.radius + rotatedX);
                  }
                }

                // Rotate back
                const worldDx = dx * cos + dy * sin;
                const worldDy = -dx * sin + dy * cos;

                newBall.x += worldDx;
                newBall.y += worldDy;

                // Reflect velocity logic
                // Normal vector depends on which face was hit
                let nx = 0,
                  ny = 0;
                if (dx !== 0) nx = Math.sign(dx);
                if (dy !== 0) ny = Math.sign(dy);

                // Rotate normal to world space
                const worldNx = nx * cos + ny * sin;
                const worldNy = -nx * sin + ny * cos;

                // V' = V - 2(V.N)N
                const dot = newBall.vx * worldNx + newBall.vy * worldNy;

                newBall.vx = (newBall.vx - 2 * dot * worldNx) * BOUNCE;
                newBall.vy = (newBall.vy - 2 * dot * worldNy) * BOUNCE;

                // Add "spin" energy from spinner
                if (obs.type === "spinner" && obs.speed) {
                  const spinForce = obs.speed * 100;
                  newBall.vx += worldNy * spinForce; // Tangential force
                  newBall.vy -= worldNx * spinForce;
                }
              }
            }
          });

          // --- STRICT DOWNWARD LOGIC ---
          // 1. Minimum Velocity: Subtle push only if nearly stopped
          if (newBall.vy < MIN_DOWNWARD_VELOCITY) {
            newBall.vy += 0.1;
          }

          // 2. Anti-Stuck Nudge: If horizontal velocity is near zero, give it a push
          // This helps if it balances perfectly on a tip
          if (Math.abs(newBall.vx) < 0.5 && Math.abs(newBall.vy) < 2) {
            newBall.vx += (Math.random() - 0.5) * 3; // Stronger nudge
          }

          // 3. Wall collisions
          const leftWall = centerX - TRACK_WIDTH / 2;
          const rightWall = centerX + TRACK_WIDTH / 2;

          if (newBall.x - newBall.radius < leftWall) {
            newBall.x = leftWall + newBall.radius;
            newBall.vx = Math.abs(newBall.vx) * BOUNCE;
          }
          if (newBall.x + newBall.radius > rightWall) {
            newBall.x = rightWall - newBall.radius;
            newBall.vx = -Math.abs(newBall.vx) * BOUNCE;
          }

          // 4. Finish Check
          if (newBall.y >= FINISH_LINE && !newBall.finished) {
            newBall.finished = true;
            newBall.finishTime = timeRef.current;
            const currentRank =
              ballsRef.current.filter((b) => b.finished).length + 1;
            newBall.rank = currentRank;

            const finishTime = newBall.finishTime;
            if (finishTime !== undefined) {
              setRankings((prev) =>
                [
                  ...prev,
                  {
                    name: newBall.name,
                    time: finishTime,
                    color: newBall.color,
                  },
                ].sort((a, b) => a.time - b.time)
              );
            }
          }

          return newBall;
        });
      }

      // Draw balls
      ballsRef.current.forEach((ball) => {
        ctx.save();

        // Trail/Glow
        if (!ball.finished) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = ball.color;
        }

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Name label
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.shadowBlur = 4;
        ctx.shadowColor = "#000";
        ctx.fillText(ball.name, ball.x, ball.y - ball.radius - 10);

        ctx.restore();
      });

      // Canvas 변환 해제
      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="flex gap-6 p-8 h-screen overflow-hidden">
      {/* Left Panel - PC: 항상 보임, Mobile: 게임 시작 전에만 보임 */}
      <div
        className={`w-80 flex-shrink-0 flex flex-col gap-6 h-full overflow-y-auto pb-8 ${
          isPlaying ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            🏁 참가자 설정
          </h3>

          <div className="flex gap-2 mb-4">
            <Input
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              placeholder="이름 입력"
              className="bg-gray-800 border-gray-700 text-white"
              disabled={isPlaying}
            />
            <Button
              onClick={addPlayer}
              size="icon"
              disabled={isPlaying || players.length >= 20}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Plus className="size-5" />
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {players.map((player, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]"
                    style={{
                      backgroundColor: COLORS[i % COLORS.length],
                      color: COLORS[i % COLORS.length],
                    }}
                  />
                  <span className="text-white font-medium">{player}</span>
                </div>
                <button
                  onClick={() => removePlayer(i)}
                  disabled={isPlaying}
                  className="text-gray-500 hover:text-red-400 disabled:opacity-50 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={startRace}
              disabled={isPlaying || players.length === 0}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-none shadow-lg shadow-green-900/20"
            >
              <Play className="mr-2 size-5 fill-current" />
              START
            </Button>
            <Button
              onClick={resetRace}
              variant="outline"
              className="flex-1 border-gray-600 hover:bg-gray-800 text-gray-300"
            >
              <RotateCcw className="mr-2 size-5" />
              RESET
            </Button>
          </div>
        </div>

        {rankings.length > 0 && (
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-lg flex-1 overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="size-6 text-yellow-400" />
              경기 결과
            </h3>
            <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar">
              {rankings.map((rank, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                    i === 0
                      ? "bg-yellow-900/20 border-yellow-700/50"
                      : i === 1
                      ? "bg-gray-800/40 border-gray-600/50"
                      : i === 2
                      ? "bg-orange-900/20 border-orange-800/50"
                      : "bg-gray-800/20 border-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center font-bold">
                      {i === 0
                        ? "🥇"
                        : i === 1
                        ? "🥈"
                        : i === 2
                        ? "🥉"
                        : `${i + 1}`}
                    </span>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: rank.color }}
                    />
                    <span className="text-white font-medium">{rank.name}</span>
                  </div>
                  <span className="text-gray-400 font-mono">
                    {rank.time.toFixed(2)}s
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas Container - PC: 항상 보임, Mobile: 게임 시작 후에만 보임 */}
      <div
        ref={containerRef}
        className={`flex-1 h-full overflow-hidden rounded-xl bg-gray-950/50 border border-gray-800 shadow-2xl relative ${
          isPlaying ? "" : "hidden md:flex"
        }`}
      >
        {/* Mobile: 게임 중 뒤로가기 버튼 */}
        {isPlaying && (
          <div className="absolute top-4 left-4 z-10 md:hidden">
            <Button
              onClick={resetRace}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white bg-gray-900/80 backdrop-blur"
            >
              <ArrowLeft className="size-4 mr-2" />
              설정으로
            </Button>
          </div>
        )}

        <div className="w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="bg-gray-900 rounded-lg shadow-2xl w-full h-full"
            style={{
              display: "block",
            }}
          />

          {!isPlaying && ballsRef.current.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="bg-black/80 backdrop-blur px-10 py-8 rounded-2xl border border-gray-700 shadow-2xl animate-pulse">
                <p className="text-white text-2xl text-center font-bold">
                  참가자를 추가하고 시작하세요! 🏁
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
