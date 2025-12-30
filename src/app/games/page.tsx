import React from 'react';
import Link from 'next/link';
import { gameContents } from '@/data/game-content';
import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/Navigation';

export default function GamesListPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation은 home 상태로 둠 */}
      <Navigation currentGame="home" onGameChange={() => {}} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            모든 게임
          </h1>
          <p className="text-gray-400 text-lg">
            SpinSnap Arcade에서 제공하는 모든 물리 엔진 게임을 만나보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(gameContents).map((game) => (
            <Link 
              key={game.slug} 
              href={`/games/${game.slug}`}
              className="group relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                  {game.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {game.shortDescription}
                </p>
                <div className="flex items-center text-cyan-500 text-sm font-medium">
                  플레이하기 &rarr;
                </div>
              </div>
              {/* 장식용 그라디언트 */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

