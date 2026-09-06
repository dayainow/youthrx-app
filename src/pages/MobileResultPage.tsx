import { useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { Prescription } from '../engine/types';
import { useResultImage } from '../hooks/useResultImage';
import { PolicyInfo } from '../components/PolicyInfo';
import { Download, Share2 } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import mapoLogo from '../assets/mapo_logo.png';
import { restoreFromUrl } from '../engine/qr';
import { ICONS } from '../engine/content';

const MobileResultContent = ({ prescription }: { prescription: Prescription }) => {
  const prescriptionRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();

  const { policies, main, sub } = prescription;

  const dateStr = new Date(`${prescription.issuedOn}T12:00:00+09:00`).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric' });

  const comfortLetter = prescription.comfort;

  /** 성분 분석표 — 메인·보조 계열 점수 비율로 만든다 */
  const saved = useResultImage(prescriptionRef, `마음약국_${main}_${prescription.issuedOn}.png`);

  const getIngredientData = () => {
    const palette: Record<string, string> = {
      주거: 'bg-emerald-400',
      일자리: 'bg-blue-400',
      금융: 'bg-amber-400',
      심리: 'bg-rose-400',
    };
    const total = Object.values(prescription.scores).reduce((a, b) => a + b, 0) || 1;
    return (Object.keys(prescription.scores) as (keyof typeof prescription.scores)[])
      .filter((k) => prescription.scores[k] > 0)
      .sort((a, b) => prescription.scores[b] - prescription.scores[a])
      .map((k) => ({
        label: `${k} 처방`,
        percent: Math.round((prescription.scores[k] / total) * 100),
        color: palette[k],
      }));
  };

  const getDosageText = (idx: number) => {
    const dosages = ["1일 3회 / 식후 30분", "1일 1회 / 취침 전", "스트레스 받을 때 즉시", "아침 기상 직후 1회"];
    return dosages[idx % dosages.length];
  };

  /** 복용 시 주의사항 — 메인 계열별 위트 문구 */
  const getSideEffectText = () => {
    switch (main) {
      case '주거':
        return '부작용: 부동산 앱을 새벽까지 들여다볼 수 있음. 오늘은 앱을 끄고 푹 주무세요!';
      case '일자리':
        return '부작용: 갑자기 자소서가 술술 써질 수 있음. 무리하지 말고 중간중간 쉬어갈 것!';
      case '금융':
        return '부작용: 통장을 자꾸 확인하게 될 수 있음. 오늘은 커피 한 잔쯤 사 마셔도 괜찮아요!';
      case '심리':
      default:
        return '부작용: 잦은 멍때림이 발생할 수 있음. 오늘은 고민 내려놓고 일찍 잘 것!';
    }
  };


  return (
    <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center p-0 sm:p-4 md:p-6 w-full">
      <div className="result-page-frame bg-[#FAF8F2] text-gray-900 w-full shadow-xl relative overflow-y-auto flex flex-col sm:rounded-3xl">
        
        <Confetti width={width} height={height} recycle={false} numberOfPieces={300} gravity={0.15} colors={['#E74C3C', '#F1C40F', '#3498DB', '#2ECC71', '#9B59B6']} />
        <div className="p-4 sm:p-6 flex-1 flex flex-col relative z-20 h-full min-h-0">
          <div className="flex-1 pb-6 flex justify-center animate-slide-up">
            
            {/* Authentic Korean Medicine Bag (약봉투) */}
            <div ref={prescriptionRef} className="w-full max-w-[360px] h-fit relative flex flex-col font-sans">
              {/* Folded Flap at the top */}
              <div className="w-full h-8 bg-[#EFE9DF] rounded-t-md shadow-[0_2px_4px_rgba(0,0,0,0.05)] border-b border-[#D8CFC0] relative z-10 flex items-end px-4 pb-1">
                 <div className="w-full h-[1px] bg-[#D8CFC0] opacity-50"></div>
              </div>

              {/* Main Bag Body */}
              <div className="bg-[#FAF8F2] text-[#111] shadow-[0_20px_40px_rgba(0,0,0,0.12)] border-x border-b border-[#E8E1D5] rounded-b-md p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                {/* Header */}
                <div className="text-center mb-8 relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#8B4513] mb-4">
                    <span className="text-2xl">{ICONS.result}</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#3E3A39] mb-2 font-serif">마음약국</h2>
                  <p className="text-sm text-[#7F8C8D] tracking-wide">당신의 마음을 처방합니다</p>
                </div>

<p className="text-center text-sm font-bold text-[#8B4513] mb-5 break-keep">{prescription.pillEmoji} {prescription.pillName}</p>

                {/* Patient Info */}
                <div className="flex justify-between items-end border-b-2 border-[#E8E1D5] pb-2 mb-6 px-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-bold text-[#3E3A39]">{main} 처방</span>
                    <span className="text-xs text-[#7F8C8D]">귀하</span>
                  </div>
                  <span className="text-xs font-medium text-[#7F8C8D]">{dateStr}</span>
                </div>

                {/* Comforting Quote Letter */}
                <div className="mt-8 px-5 py-6 relative bg-[#FFFDF9] rounded-2xl border border-[#E2D9C8] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FAF8F2] px-3.5 py-0.5 text-[12px] font-bold text-[#8B4513] border border-[#E8E1D5] rounded-full shadow-sm whitespace-nowrap">
                    마음 주치의의 편지 ✉️
                  </div>
                  <p className="mt-2 text-[13px] font-letter text-[#4A4543] leading-[1.9] break-keep tracking-tight text-left">
                    {comfortLetter}
                  </p>
                </div>

                {/* Prescription Ingredients Chart */}
                <div className="mb-8 bg-white border border-[#E8E1D5] rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <h3 className="font-bold text-[14px] text-[#3E3A39] mb-4 flex items-center tracking-tight">
                    <span className="mr-2 text-lg">🧪</span> 맞춤 처방약 성분 분석표
                  </h3>
                  <div className="space-y-4">
                    {getIngredientData().map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[12px] font-bold text-[#666] mb-1.5 px-0.5">
                          <span>{item.label}</span>
                          <span>{item.percent}%</span>
                        </div>
                        <div className="w-full bg-[#F0EBE1] rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`h-2.5 rounded-full transition-[width] duration-[900ms] ease-out ${item.color}`}
                            style={{
                              width: `${item.percent}%`,
                              transitionDelay: `${i * 150}ms`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prescription List */}
                <div className="mb-2">
                  <h3 className="font-bold text-lg text-[#3E3A39] mb-4 px-1">처방 내역</h3>
                  <div className="space-y-3">
                    {policies.map((policy, idx) => (
                        <div key={policy.id} className="block bg-white border border-[#E8E1D5] rounded-2xl p-4 shadow-sm group">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-[#FFF3E0] text-[#D35400] flex items-center justify-center text-xl mr-4 shrink-0 font-serif shadow-inner">
                              {prescription.policyEmojis[idx] ?? '💊'}
                            </div>
                            <div className="flex-1">
                              <div className="text-[11px] font-bold text-[#D35400] mb-0.5">[{policy.series}] {policy.period}</div>
                              <div className="text-[16px] font-extrabold text-[#3E3A39] leading-tight mb-1.5">{policy.title}</div>
                              <div className="text-[12px] text-[#666] mb-2.5 leading-snug break-keep line-clamp-2">{policy.support}</div>
                              <div className="text-[11px] font-bold text-[#8B4513] flex items-center bg-[#F0EBE1]/50 w-fit px-2 py-1 rounded-md">
                                <span className="mr-1.5 opacity-80">🕒</span> {getDosageText(idx)}
                              </div>
                            </div>
                          </div>
                          <a data-no-export href={policy.sourceUrl ?? policy.url} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center text-sm font-bold text-[#8B4513] mt-3 pt-3 border-t border-[#E8E1D5] min-h-11">공식 안내 보기<span aria-hidden="true">↗</span><span className="sr-only">(새 탭)</span></a>
                          <details data-no-export className="mt-2 text-sm text-[#555]"><summary className="cursor-pointer min-h-8">추천 이유와 신청 조건</summary><PolicyInfo policy={policy} /></details>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Precautions */}
                <div className="mt-6 p-4 bg-[#F0EBE1]/60 rounded-xl border border-[#D8CFC0]">
                  <div className="text-[12px] font-bold text-[#8B4513] mb-1.5 flex items-center">
                    <span className="mr-1.5 text-sm">⚠️</span> 복용 시 주의사항
                  </div>
                  <div className="text-[13px] font-medium text-[#555] leading-relaxed break-keep">
                    {getSideEffectText()}
                  </div>
                </div>

                {/* 보조 처방 한 줄 */}
                <div className="mt-4 p-4 bg-white rounded-xl border border-dashed border-[#D8CFC0]">
                  <div className="text-[12px] font-bold text-[#8B4513] mb-1.5 flex items-center">
                    <span className="mr-1.5 text-sm">🧾</span> 보조 처방 · {sub}
                  </div>
                  <div className="text-[13px] font-medium text-[#555] leading-relaxed break-keep">
                    {prescription.subLine}
                  </div>
                </div>

                {/* 오늘의 한마디 */}
                <div className="mt-4 text-center px-2">
                  <p className="text-[12.5px] font-serif italic text-[#7F8C8D] break-keep leading-relaxed">
                    “{prescription.quote}”
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-dashed border-[#D8CFC0] relative flex items-center justify-center">
                  <img src={mapoLogo} alt="서울청년센터 마포" className="h-7 object-contain opacity-80" />
                  <div className="absolute -top-2 right-0 w-20 h-20 border-[3.5px] border-[#E74C3C] rounded-full flex items-center justify-center text-center text-[#E74C3C] text-[15px] font-bold leading-tight -rotate-[15deg] mix-blend-multiply opacity-80 z-20">
                    조제<br/>완료
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-[#7F8C8D] mb-3">
            <button className="min-h-11 underline underline-offset-4 text-[#8B4513]" onClick={saved.copyLink}>결과 링크 복사</button>
            <p role="status" aria-live="polite" className="leading-relaxed">{saved.message}</p>
            {saved.showLink && <input className="border border-[#D8CFC0] rounded-lg p-3 w-full mt-2" aria-label="내 결과 링크" readOnly value={window.location.href} onFocus={(event) => event.target.select()} />}
            {saved.error && <div role="alert"><p>이미지를 만들지 못했어요. 화면을 캡처하거나 링크를 보관해 주세요.</p><button className="min-h-11 underline text-[#8B4513]" onClick={saved.retry}>이미지 다시 만들기</button></div>}
            {saved.showPreview && saved.image && <details open className="mt-3"><summary className="min-h-11 cursor-pointer">저장이 안 되면 이미지를 길게 눌러주세요</summary><img src={saved.image.url} alt="저장용 마음약국 처방전" className="w-full h-auto" /></details>}
          </div>
          {/* Share Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-auto bg-[#FAF8F2] pt-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:pb-2 z-30 relative shrink-0">
            <button 
              onClick={saved.download}
              disabled={!saved.image}
              className="w-full bg-[#3E3A39] text-white font-bold py-4 px-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-md hover:bg-[#2C2928] active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              <span className="text-base">{saved.image ? '인스타그램용 이미지 저장' : saved.error ? '이미지 생성 실패' : '이미지 준비 중…'}</span>
            </button>
            <button 
              onClick={saved.share}
              disabled={saved.isSharing}
              className="w-full bg-[#FEE500] text-[#191919] font-bold py-4 px-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-sm hover:brightness-95 active:scale-[0.98]"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-base">{saved.isSharing ? '공유 중…' : '결과 공유하기'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function MobileResultPage() {
  const { search } = useLocation();
  const prescription = useMemo(() => restoreFromUrl(search), [search]);
  if (!prescription) return <main className="min-h-screen bg-[#FAF8F2] flex flex-col items-center justify-center p-6 text-center text-[#3E3A39]">
    <span className="text-5xl" aria-hidden="true">✉️</span><h1 className="text-2xl font-bold mt-6">처방전을 확인할 수 없어요</h1>
    <p className="mt-4 text-[#7F8C8D] leading-relaxed">QR 주소가 잘렸거나 이전 버전의 결과입니다.<br />부스 화면의 QR을 다시 찍어주세요.</p>
    <a className="enhance-button enhance-primary mt-6" href="/">새 처방 받기</a>
  </main>;
  return <MobileResultContent key={search} prescription={prescription} />;
}
