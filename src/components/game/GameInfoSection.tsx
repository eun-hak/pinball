import React from 'react';
import { GameContent } from '@/data/game-content';
import Link from 'next/link';
import { HelpCircle, BookOpen, AlertCircle, PlayCircle } from 'lucide-react';

interface GameInfoSectionProps {
  content: GameContent;
}

export function GameInfoSection({ content }: GameInfoSectionProps) {
  if (!content) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 text-gray-300 space-y-12">
      
      {/* 소개 섹션 */}
      <section className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="text-cyan-400" />
          {content.title} 소개
        </h2>
        <p className="leading-relaxed text-gray-300">
          {content.description}
        </p>
      </section>

      {/* 사용 방법 & 규칙 (2열 레이아웃) */}
      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <PlayCircle className="text-green-400" />
            게임 방법
          </h3>
          <ol className="space-y-3 list-decimal list-inside bg-gray-900/30 p-5 rounded-xl border border-gray-800/50">
            {content.howTo.map((step, idx) => (
              <li key={idx} className="pl-2 marker:text-green-500 marker:font-bold">
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="text-yellow-400" />
            규칙 및 원리
          </h3>
          <ul className="space-y-3 list-disc list-inside bg-gray-900/30 p-5 rounded-xl border border-gray-800/50">
            {content.rules.map((rule, idx) => (
              <li key={idx} className="pl-2 marker:text-yellow-500">
                {rule}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* FAQ 섹션 */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <HelpCircle className="text-purple-400" />
          자주 묻는 질문 (FAQ)
        </h3>
        <div className="grid gap-4">
          {content.faq.map((item, idx) => (
            <div key={idx} className="bg-gray-800/40 rounded-lg p-5 hover:bg-gray-800/60 transition-colors border border-gray-700/30">
              <h4 className="font-semibold text-white mb-2 flex items-start gap-2">
                <span className="text-purple-400 font-bold">Q.</span>
                {item.question}
              </h4>
              <p className="text-gray-400 pl-6 text-sm leading-relaxed">
                <span className="text-gray-500 font-bold mr-2">A.</span>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 관련 게임 링크 */}
      <section className="border-t border-gray-800 pt-8 mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">다른 게임도 즐겨보세요</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/plinko" className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-cyan-600 hover:text-white transition-colors">
            #플링코
          </Link>
          <Link href="/race" className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-cyan-600 hover:text-white transition-colors">
            #마블레이스
          </Link>
          <Link href="/survival" className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-cyan-600 hover:text-white transition-colors">
            #서바이벌
          </Link>
          <Link href="/color" className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-cyan-600 hover:text-white transition-colors">
            #컬러컨퀘스트
          </Link>
        </div>
      </section>

    </div>
  );
}

