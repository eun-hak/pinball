import React from "react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">이용약관</h1>
        
        <div className="space-y-8 text-sm leading-relaxed bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제1조 (목적)</h2>
            <p>
              본 약관은 PlentyArcade(이하 &ldquo;회사&rdquo;)가 제공하는 웹 게임 서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제2조 (서비스의 제공)</h2>
            <p>
              1. 회사는 이용자에게 온라인 물리 엔진 게임 서비스를 무료로 제공합니다.<br/>
              2. 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 단, 시스템 점검이나 불가항력적인 사유로 서비스가 일시 중단될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제3조 (저작권의 귀속 및 이용제한)</h2>
            <p>
              1. 회사가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 회사에 귀속합니다.<br/>
              2. 이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제4조 (면책조항)</h2>
            <p>
              1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.<br/>
              2. 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.<br/>
              3. 본 서비스에서 제공하는 게임 결과는 난수 생성 알고리즘과 물리 엔진에 의한 것으로, 회사는 특정 결과를 보장하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">제5조 (준거법 및 재판관할)</h2>
            <p>
              1. 회사와 이용자 간에 제기된 소송은 대한민국법을 준거법으로 합니다.<br/>
              2. 서비스 이용과 관련하여 분쟁이 발생할 경우 관할법원에 소를 제기할 수 있습니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

