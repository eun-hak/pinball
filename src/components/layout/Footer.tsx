import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/90 text-gray-400 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* 브랜드 정보 */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">PlentyArcade</h2>
            <p className="text-sm leading-relaxed mb-4 max-w-sm">
              PlentyArcade는 물리 엔진을 기반으로 한 다양한 인터랙티브 웹 게임을 제공합니다. 
              설치 없이 브라우저에서 바로 즐기는 무료 게임 플랫폼입니다.
            </p>
            <p className="text-xs text-gray-500">
              © {currentYear} PlentyArcade. All rights reserved.
            </p>
          </div>

          {/* 게임 링크 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Games</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/plinko" className="hover:text-cyan-400 transition-colors">플링코 (Plinko)</Link></li>
              <li><Link href="/race" className="hover:text-cyan-400 transition-colors">마블 레이스 (Race)</Link></li>
              <li><Link href="/survival" className="hover:text-cyan-400 transition-colors">서바이벌 (Survival)</Link></li>
              <li><Link href="/color" className="hover:text-cyan-400 transition-colors">컬러 컨퀘스트 (Color)</Link></li>
            </ul>
          </div>

          {/* 정보 및 정책 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Info</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-cyan-400 transition-colors">서비스 소개</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">문의하기</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-cyan-400 transition-colors">개인정보처리방침</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">이용약관</Link></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}

