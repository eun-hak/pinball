'use client'

import { Dices, Trophy, Skull, Palette, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface HomeProps {
  onGameSelect: (game: 'plinko' | 'race' | 'survival' | 'color') => void;
}

export function Home({ onGameSelect }: HomeProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/40 via-black to-black -z-10" />
        
        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          SpinSnap Arcade
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          물리 엔진으로 구현된 다양한 인터랙티브 게임을 즐겨보세요.
          <br />
          운, 속도, 전략, 그리고 영토 전쟁까지!
        </p>
      </div>

      {/* Game Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Plinko Card */}
        <Link 
          href="/plinko"
          onClick={() => onGameSelect('plinko')}
          className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden block"
        >
          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-cyan-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Dices className="size-6 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">플링코</h3>
          <p className="text-gray-400 text-sm mb-4 h-10">
            공을 떨어뜨려 행운을 시험하세요. 고전적인 확률 게임.
          </p>
          <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:gap-2 transition-all">
            Play Now <ArrowRight className="size-4 ml-1" />
          </div>
        </Link>

        {/* Race Card */}
        <Link 
          href="/race"
          onClick={() => onGameSelect('race')}
          className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden block"
        >
          <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-green-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Trophy className="size-6 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">마블 레이스</h3>
          <p className="text-gray-400 text-sm mb-4 h-10">
            장애물을 피해 가장 먼저 결승선에 도착하는 구슬은 누구일까요?
          </p>
          <div className="flex items-center text-green-400 text-sm font-medium group-hover:gap-2 transition-all">
            Play Now <ArrowRight className="size-4 ml-1" />
          </div>
        </Link>

        {/* Survival Card */}
        <Link 
          href="/survival"
          onClick={() => onGameSelect('survival')}
          className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden block"
        >
          <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-purple-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Skull className="size-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">서바이벌</h3>
          <p className="text-gray-400 text-sm mb-4 h-10">
            폭탄과 자기장을 피해 마지막까지 살아남으세요. 배틀로얄!
          </p>
          <div className="flex items-center text-purple-400 text-sm font-medium group-hover:gap-2 transition-all">
            Play Now <ArrowRight className="size-4 ml-1" />
          </div>
        </Link>

        {/* Color Conquest Card (New) */}
        <Link 
          href="/color"
          onClick={() => onGameSelect('color')}
          className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden block"
        >
          <div className="absolute top-0 right-0 p-2">
            <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="size-3" /> NEW
            </span>
          </div>
          <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-pink-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Palette className="size-6 text-pink-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Color Conquest</h3>
          <p className="text-gray-400 text-sm mb-4 h-10">
            공을 굴려 가장 많은 땅을 색칠하세요. 치열한 영토 전쟁!
          </p>
          <div className="flex items-center text-pink-400 text-sm font-medium group-hover:gap-2 transition-all">
            Play Now <ArrowRight className="size-4 ml-1" />
          </div>
        </Link>

      </div>
    </div>
  );
}