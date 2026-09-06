import { useState, useEffect } from 'react';
import { RefreshCw, ChevronRight, X } from 'lucide-react';
import mapoLogo from '../assets/mapo_logo.png';
import { QRCodeSVG } from 'qrcode.react';
import useSound from 'use-sound';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { buildQrUrl } from '../engine/qr';
import { RESULT_BASE } from '../engine/config';
import { ICONS } from '../engine/content';
import type { Answers, Prescription } from '../engine/types';

interface Props {
  prescription: Prescription;
  answers: Answers;
  onReset: () => void;
}

export const ResultScreen = ({ prescription, answers, onReset }: Props) => {
  const { policies, main, sub } = prescription;
  const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const [showQR, setShowQR] = useState(false);
  const [playStamp] = useSound('https://actions.google.com/sounds/v1/foley/wooden_door_shut.ogg', { volume: 0.8 });
  const [playPaper] = useSound('https://actions.google.com/sounds/v1/foley/paper_rustle.ogg', { volume: 0.5 });

  useEffect(() => {
    // Play paper sound immediately
    playPaper();
    // Play stamp sound after 0.8s (matching CSS animation delay)
    const timer = setTimeout(() => {
      playStamp();
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }, 800);
    return () => clearTimeout(timer);
  }, [playPaper, playStamp]);

  // QR 은 링크를 그림으로 그리는 순수 계산이라 인터넷 없이 만들어진다.
  const qrUrl = buildQrUrl(RESULT_BASE, prescription, answers);

  // 위로 문구는 엔진(계열별 문구)에서 가져온다.
  const comfortLetter = prescription.comfort;

  /** 성분 분석표 — 메인·보조 계열 점수 비율로 만든다 */
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
    const dosages = [
      "1일 3회 / 식후 30분",
      "1일 1회 / 취침 전",
      "스트레스 받을 때 즉시",
      "아침 기상 직후 1회"
    ];
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

  const { width, height } = useWindowSize();

  return (
    <div className="flex-1 flex flex-col relative z-20 h-full bg-[#F4EFE6]">
      <Confetti 
        width={width} 
        height={height} 
        recycle={false} 
        numberOfPieces={300} 
        gravity={0.15}
        colors={['#E74C3C', '#F1C40F', '#3498DB', '#2ECC71', '#9B59B6']}
      />
      
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-28 scrollbar-hide flex justify-center animate-slide-up">
        
        {/* Authentic Korean Medicine Bag (약봉투) */}
        <div 
          className="w-full max-w-[360px] md:max-w-[640px] h-fit relative flex flex-col font-sans"
        >
          {/* Folded Flap at the top */}
          <div className="w-full h-8 bg-[#EFE9DF] rounded-t-md shadow-[0_2px_4px_rgba(0,0,0,0.05)] border-b border-[#D8CFC0] relative z-10 flex items-end px-4 pb-1">
             <div className="w-full h-[1px] bg-[#D8CFC0] opacity-50"></div>
          </div>

          {/* Main Bag Body */}
          <div className="bg-[#FAF8F2] text-[#111] shadow-[0_20px_40px_rgba(0,0,0,0.12)] border-x border-b border-[#E8E1D5] rounded-b-md p-5 sm:p-6 md:p-8 relative overflow-hidden">
            
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            {/* Header */}
            <div className="text-center mb-8 md:mb-7 relative">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#8B4513] mb-4">
                <span className="text-2xl">{ICONS.result}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#3E3A39] mb-2 font-serif">마음약국</h2>
              <p className="text-sm md:text-base text-[#7F8C8D] tracking-wide">당신의 마음을 처방합니다</p>
            </div>

            {/* Patient Info */}
            <div className="flex justify-between items-end border-b-2 border-[#E8E1D5] pb-2 mb-6 px-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-lg md:text-xl font-bold text-[#3E3A39]">{main} 처방</span>
                <span className="text-xs text-[#7F8C8D]">귀하</span>
              </div>
              <span className="text-xs md:text-sm font-medium text-[#7F8C8D]">{dateStr}</span>
            </div>

            <div className="md:grid md:grid-cols-[1.08fr_0.92fr] md:gap-5 md:items-stretch mb-8">
              {/* Comforting Quote Letter */}
              <div className="mt-4 mb-8 md:mb-0 px-5 py-6 md:px-6 md:py-7 relative bg-[#FFFDF9] rounded-2xl border border-[#E2D9C8] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FAF8F2] px-3.5 py-0.5 text-[12px] font-bold text-[#8B4513] border border-[#E8E1D5] rounded-full shadow-sm whitespace-nowrap">
                  마음 주치의의 편지 ✉️
                </div>
                <p className="mt-2 text-[13px] md:text-[13.5px] font-letter text-[#4A4543] leading-[1.9] break-keep tracking-tight text-left">
                  {comfortLetter}
                </p>
              </div>

              {/* Prescription Ingredients Chart */}
              <div className="mb-8 md:mb-0 bg-white border border-[#E8E1D5] rounded-2xl p-5 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <h3 className="font-bold text-[14px] md:text-[15px] text-[#3E3A39] mb-4 flex items-center tracking-tight">
                  <span className="mr-2 text-lg">🧪</span> 맞춤 처방약 성분 분석표
                </h3>
                <div className="space-y-4">
                  {getIngredientData().map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[12px] md:text-[13px] font-bold text-[#666] mb-1.5 px-0.5">
                        <span>{item.label}</span>
                        <span>{item.percent}%</span>
                      </div>
                      <div className="w-full bg-[#F0EBE1] rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full animate-bar ${item.color}`}
                          style={{ width: `${item.percent}%`, animationDelay: `${i * 150}ms` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Prescription List (Toss Style) */}
            <div className="mb-2">
              <h3 className="font-bold text-lg text-[#3E3A39] mb-4 px-1">처방 내역</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {policies.map((policy, idx) => (
                    <a 
                      key={policy.id}
                      href={policy.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block bg-white border border-[#E8E1D5] rounded-2xl p-4 md:p-5 shadow-sm hover:border-[#D35400] hover:shadow-md transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center">
                        {/* Pill Icon Placeholder */}
                        <div className="w-12 h-12 rounded-full bg-[#FFF3E0] text-[#D35400] flex items-center justify-center text-xl mr-4 shrink-0 font-serif shadow-inner">
                          {idx === 0 ? prescription.pillEmoji : '💊'}
                        </div>
                        <div className="flex-1">
                          <div className="text-[11px] font-bold text-[#D35400] mb-0.5">
                            [{policy.series}] {policy.period}
                          </div>
                          <div className="text-[16px] font-extrabold text-[#3E3A39] leading-tight mb-1.5 group-hover:text-[#D35400] transition-colors">
                            {policy.title}
                          </div>
                          <div className="text-[12px] text-[#666] mb-2.5 leading-snug break-keep line-clamp-2">
                            {policy.support}
                          </div>
                          <div className="text-[11px] font-bold text-[#8B4513] flex items-center bg-[#F0EBE1]/50 w-fit px-2 py-1 rounded-md">
                            <span className="mr-1.5 opacity-80">🕒</span> {getDosageText(idx)}
                          </div>
                        </div>
                        <div className="text-[#95A5A6] group-hover:text-[#D35400] transition-colors pl-2">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </a>
                ))}
                {policies.length === 0 && (
                  <div className="text-sm text-center py-10 text-[#7F8C8D] font-medium bg-white rounded-2xl border border-[#E8E1D5]">
                    처방 가능한 내역이 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* Precautions (Witty Side Effects) */}
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
              <p className="text-[12.5px] md:text-[13px] font-serif italic text-[#7F8C8D] break-keep leading-relaxed">
                “{prescription.quote}”
              </p>
            </div>

            
            
            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-dashed border-[#D8CFC0] relative flex items-center justify-center">
              <img src={mapoLogo} alt="서울청년센터 마포" className="h-7 object-contain opacity-80" />
              {/* Animated Red Stamp */}
              <div className="absolute top-1 right-2 w-12 h-12 border-[2.5px] border-[#E74C3C] rounded-full flex items-center justify-center text-[#E74C3C] text-[11px] font-bold -rotate-[15deg] mix-blend-multiply opacity-0 animate-stamp z-20">
                조제<br/>완료
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Action Buttons */}
      <div className="flex gap-3 mt-auto bg-[#F4EFE6] p-4 md:px-8 md:py-5 z-30 relative shrink-0 border-t border-[#E8E1D5]">
        <button 
          onClick={onReset} 
          className="flex-1 bg-white border border-[#E8E1D5] text-[#3E3A39] font-bold py-4 px-3 md:px-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
        >
          <RefreshCw className="w-5 h-5" />
          <span className="text-base">다시 진단</span>
        </button>
        <button 
          onClick={() => setShowQR(true)}
          className="flex-[2] bg-[#3E3A39] text-white font-bold py-4 px-3 md:px-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md hover:bg-[#2C2928] active:scale-[0.98]"
        >
          <span className="text-lg leading-none">{ICONS.mobile}</span>
          <span className="text-base">모바일로 결과 받기</span>
        </button>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="absolute inset-0 z-50 bg-[#3E3A39]/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div className="bg-[#FAF8F2] w-full max-w-[320px] md:max-w-[380px] rounded-3xl p-7 md:p-9 flex flex-col items-center relative shadow-2xl animate-slide-up border border-[#E8E1D5]">
            <button 
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 min-w-11 p-2 text-[#7F8C8D] hover:text-[#3E3A39] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-14 h-14 bg-[#F0EBE1] rounded-full flex items-center justify-center mb-5 border border-[#D8CFC0]">
              <span className="text-3xl leading-none">{ICONS.mobile}</span>
            </div>
            
            <h3 className="text-xl font-bold text-[#3E3A39] mb-2 font-serif">모바일로 결과 받기</h3>
            <p className="text-[13px] text-[#7F8C8D] text-center mb-8 break-keep">
              스마트폰 카메라로 아래 QR 코드를 스캔하면<br/>처방전을 기기에 저장할 수 있습니다.
            </p>
            
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#E8E1D5]">
              <QRCodeSVG 
                value={qrUrl}
                size={160}
                bgColor={"#ffffff"}
                fgColor={"#3E3A39"}
                level={"H"}
                includeMargin={false}
              />
            </div>
            
            <div className="mt-8 text-[11px] font-bold tracking-widest text-[#95A5A6]">
              TYPE-{main}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
