import React from "react";
import { Footer } from "@/components/layout/Footer";
import { Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">문의하기 (Contact)</h1>
        
        <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 space-y-8">
          <p className="text-lg text-gray-300">
            SpinSnap Arcade를 이용해주셔서 감사합니다.<br/>
            게임 버그 제보, 제휴 문의, 기타 의견이 있으시면 아래 채널로 연락해 주세요.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-cyan-500/20 p-3 rounded-full">
                  <Mail className="size-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">이메일 문의</h3>
              </div>
              <p className="text-gray-400 mb-4">
                가장 빠르고 정확한 답변을 받으실 수 있습니다.
              </p>
              <a href="mailto:spinsnap.arcade@gmail.com" className="text-cyan-400 hover:text-cyan-300 font-medium text-lg">
                spinsnap.arcade@gmail.com
              </a>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <MessageCircle className="size-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">SNS / 커뮤니티</h3>
              </div>
              <p className="text-gray-400 mb-4">
                업데이트 소식과 개발 비하인드를 확인하세요.
              </p>
              <div className="flex gap-4">
                <span className="text-gray-500">Twitter (준비중)</span>
                <span className="text-gray-500">Discord (준비중)</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">자주 묻는 질문</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>게임이 실행되지 않는 경우, 브라우저의 캐시를 삭제하고 새로고침 해보세요.</li>
              <li>모바일 화면에서 UI가 깨져 보인다면 가로 모드/세로 모드를 전환해 보세요.</li>
              <li>저작권 및 라이선스 관련 문의는 이메일로 부탁드립니다.</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

