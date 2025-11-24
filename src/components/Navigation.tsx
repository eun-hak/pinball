'use client'

import { Dices, Trophy, Skull, Palette } from 'lucide-react';
import Link from 'next/link';

interface NavigationProps {
  currentGame: 'home' | 'plinko' | 'race' | 'survival' | 'color';
  onGameChange: (game: 'home' | 'plinko' | 'race' | 'survival' | 'color') => void;
}

export function Navigation({ currentGame, onGameChange }: NavigationProps) {

  // 하이드레이션 안정성을 위해 항상 currentGame prop만 사용
  // 각 페이지에서 이미 올바른 currentGame을 전달하고 있으므로 pathname 확인 불필요
  const activeGame = currentGame;

  // 서버와 클라이언트에서 동일한 HTML을 렌더링하도록 보장
  // suppressHydrationWarning으로 하이드레이션 경고 억제
  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
              <Dices className="size-6 text-white" />
            </div>
            <h1 className="text-2xl text-white">
              Spin<span className="text-cyan-400">Snap</span>
            </h1>
          </Link>

          <div className="flex gap-2 bg-gray-800/50 p-1 rounded-lg overflow-x-auto" suppressHydrationWarning>
            <Link
              href="/"
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeGame === 'home'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              홈
            </Link>
            <div className="w-px bg-gray-700 mx-1 hidden md:block" />
            <Link
              href="/plinko"
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeGame === 'plinko'
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Dices className="size-4" />
              플링코
            </Link>
            <Link
              href="/race"
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeGame === 'race'
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Trophy className="size-4" />
              레이스
            </Link>
            <Link
              href="/survival"
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeGame === 'survival'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Skull className="size-4" />
              서바이벌
            </Link>
            <Link
              href="/color"
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeGame === 'color'
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Palette className="size-4" />
              Color
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
