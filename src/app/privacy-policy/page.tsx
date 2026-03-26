import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">개인정보처리방침</h1>
        
        <div className="space-y-8 text-sm leading-relaxed bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. 총칙</h2>
            <p>
              PlentyArcade(이하 &ldquo;회사&rdquo;)는 이용자의 개인정보를 중요시하며, &ldquo;정보통신망 이용촉진 및 정보보호&rdquo;에 관한 법률을 준수하고 있습니다.
              본 사이트는 별도의 회원가입 없이 이용 가능한 무료 게임 서비스를 제공하며, 게임 플레이 과정에서 개인을 식별할 수 있는 민감한 정보를 수집하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. 수집하는 개인정보 항목</h2>
            <p>회사는 서비스 제공을 위해 아래와 같은 최소한의 정보를 자동으로 수집할 수 있습니다.</p>
            <ul className="list-disc list-inside mt-2 ml-2 space-y-1 text-gray-400">
              <li>접속 로그, 쿠키, 접속 IP 정보 (서비스 안정성 및 통계 목적)</li>
              <li>게임 설정값 (로컬 스토리지에 저장되며 서버로 전송되지 않음)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. 개인정보의 수집 및 이용 목적</h2>
            <p>수집된 정보는 다음의 목적을 위해서만 이용됩니다.</p>
            <ul className="list-disc list-inside mt-2 ml-2 space-y-1 text-gray-400">
              <li>서비스 제공 및 콘텐츠 이용</li>
              <li>접속 빈도 파악 및 서비스 이용 통계</li>
              <li>부정 이용 방지 및 비인가 사용 방지</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. 쿠키(Cookie)의 운용 및 거부</h2>
            <p>
              회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 &apos;쿠키(cookie)&apos;를 사용합니다.
              이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 웹브라우저 옵션 설정을 통해 모든 쿠키를 허용하거나, 거부할 수 있습니다.
              단, 쿠키 설치를 거부하였을 경우 게임 설정 저장 등 일부 서비스 이용에 어려움이 있을 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. 광고 서비스</h2>
            <p>
              본 사이트는 서비스 운영을 위해 Google AdSense 등 타사 광고 서비스가 포함될 수 있습니다.
              타사 광고 사업자는 이용자의 관심사에 맞는 광고를 제공하기 위해 쿠키를 사용할 수 있으며, 이에 대한 자세한 내용은 Google의 광고 및 콘텐츠 네트워크 개인정보보호 정책을 참고하시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. 개인정보 보호책임자</h2>
            <p>이용자는 회사의 서비스를 이용하며 발생하는 모든 개인정보보호 관련 민원을 아래 연락처로 신고하실 수 있습니다.</p>
            <p className="mt-2 font-medium text-cyan-400">문의: plentyarcade@gmail.com</p>
          </section>
        </div>
      </div>
    </main>
  );
}

