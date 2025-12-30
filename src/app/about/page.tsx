import React from "react";
import { Footer } from "@/components/layout/Footer";
import { Dices, Zap, Shield, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* 헤더 섹션 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            About <span className="text-cyan-400">SpinSnap Arcade</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            순수한 물리 엔진의 재미, 설치 없는 간편함.<br/>
            웹 브라우저에서 즐기는 차세대 아케이드 플랫폼입니다.
          </p>
        </div>

        {/* 특징 그리드 */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <Zap className="size-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Real Physics</h3>
            <p className="text-gray-400">
              Matter.js 기반의 정교한 2D 물리 엔진을 사용하여, 공의 튕김과 충돌을 현실감 있게 구현했습니다. 예측 불가능한 결과가 주는 짜릿함을 느껴보세요.
            </p>
          </div>
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <Globe className="size-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Install</h3>
            <p className="text-gray-400">
              앱을 다운로드하거나 설치할 필요가 없습니다. PC, 태블릿, 모바일 어디서든 링크 접속만으로 즉시 플레이할 수 있습니다.
            </p>
          </div>
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <Dices className="size-8 text-pink-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Fair Play</h3>
            <p className="text-gray-400">
              모든 결과는 클라이언트 사이드에서 실시간 연산됩니다. 조작 없는 공정한 난수와 물리 법칙만이 게임의 결과를 결정합니다.
            </p>
          </div>
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <Shield className="size-8 text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Clean & Safe</h3>
            <p className="text-gray-400">
              과도한 광고나 개인정보 수집 없이, 게임 본연의 재미에 집중할 수 있는 쾌적한 환경을 제공합니다.
            </p>
          </div>
        </div>

        {/* 미션 섹션 */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">우리의 목표</h2>
          <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
            "복잡한 로그인도, 긴 로딩도 없이 1초 만에 즐거움을 찾을 수 있다면 어떨까?"<br/>
            SpinSnap Arcade는 이런 고민에서 시작되었습니다. 심심할 때, 친구와 내기가 필요할 때, 
            언제든 꺼내 쓸 수 있는 디지털 장난감 상자가 되는 것이 우리의 목표입니다.
          </p>
        </div>

      </div>
      <Footer />
    </main>
  );
}

