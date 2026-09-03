import { useRef } from 'react';
import type { Policy, UserEmotion } from '../hooks/usePrescription';
import { Download, RefreshCw, ChevronRight } from 'lucide-react';
import { toPng } from 'html-to-image';

interface Props {
  policies: Policy[];
  userEmotion: UserEmotion | null;
  userConcern?: string | null;
  onReset: () => void;
}

export const ResultScreen = ({ policies, userEmotion, onReset }: Props) => {
  const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const prescriptionRef = useRef<HTMLDivElement>(null);

  const getDosageText = (idx: number) => {
    const dosages = [
      "1일 3회 / 식후 30분",
      "1일 1회 / 취침 전",
      "스트레스 받을 때 즉시",
      "아침 기상 직후 1회"
    ];
    return dosages[idx % dosages.length];
  };

  const handleDownload = async () => {
    if (prescriptionRef.current === null) return;
    try {
      const dataUrl = await toPng(prescriptionRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = '마음약국_약봉투.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 flex-1 flex flex-col relative z-20">
      <div className="flex-1 overflow-y-auto pb-6 scrollbar-hide flex justify-center animate-slide-up">
        
        {/* Authentic Korean Medicine Bag (약봉투) */}
        <div 
          ref={prescriptionRef} 
          className="w-full max-w-[360px] h-fit relative flex flex-col font-sans"
        >
          {/* Folded Flap at the top */}
          <div className="w-full h-8 bg-[#EFE9DF] rounded-t-md shadow-[0_2px_4px_rgba(0,0,0,0.05)] border-b border-[#D8CFC0] relative z-10 flex items-end px-4 pb-1">
             <div className="w-full h-[1px] bg-[#D8CFC0] opacity-50"></div>
          </div>

          {/* Main Bag Body */}
          <div className="bg-[#FAF8F2] text-[#111] shadow-[0_20px_40px_rgba(0,0,0,0.12)] border-x border-b border-[#E8E1D5] rounded-b-md p-6 relative overflow-hidden">
            
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            {/* Header */}
            <div className="text-center mb-8 relative">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#8B4513] text-[#8B4513] mb-4">
                <span className="text-2xl font-bold">✚</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#3E3A39] mb-2 font-serif">마음약국</h2>
              <p className="text-sm text-[#7F8C8D] tracking-wide">당신의 마음을 처방합니다</p>
            </div>

            {/* Patient Info */}
            <div className="flex justify-between items-end border-b-2 border-[#E8E1D5] pb-2 mb-6 px-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-bold text-[#3E3A39]">마포 청년</span>
                <span className="text-xs text-[#7F8C8D]">귀하</span>
              </div>
              <span className="text-xs font-medium text-[#7F8C8D]">{dateStr}</span>
            </div>

            {/* Prescription List (Toss Style) */}
            <div className="mb-2">
              <h3 className="font-bold text-lg text-[#3E3A39] mb-4 px-1">처방 내역</h3>
              <div className="space-y-3">
                {policies.map((policy, idx) => (
                    <a 
                      key={policy.id}
                      href={policy.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block bg-white border border-[#E8E1D5] rounded-2xl p-4 shadow-sm hover:border-[#D35400] hover:shadow-md transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center">
                        {/* Pill Icon Placeholder */}
                        <div className="w-12 h-12 rounded-full bg-[#FFF3E0] text-[#D35400] flex items-center justify-center text-xl mr-4 shrink-0 font-serif shadow-inner">
                          💊
                        </div>
                        <div className="flex-1">
                          <div className="text-[11px] font-bold text-[#D35400] mb-0.5">
                            {policy.category}
                          </div>
                          <div className="text-[15px] font-bold text-[#3E3A39] leading-tight mb-1 group-hover:text-[#D35400] transition-colors">
                            {policy.pill_name}
                          </div>
                          <div className="text-[12px] font-medium text-[#7F8C8D] flex items-center">
                            <span className="mr-1">🕒</span> {getDosageText(idx)}
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
            
            {/* Footer */}
            <div className="mt-8 text-center pt-6 border-t border-dashed border-[#D8CFC0] relative">
              <p className="text-xs text-[#7F8C8D] font-medium tracking-widest">MAPO YOUTH PHARMACY</p>
              {/* Red Stamp */}
              <div className="absolute top-2 right-2 w-12 h-12 border-2 border-[#E74C3C] rounded-full flex items-center justify-center text-[#E74C3C] text-[11px] font-bold -rotate-[15deg] mix-blend-multiply opacity-70">
                조제<br/>완료
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Action Buttons */}
      <div className="flex space-x-3 mt-auto bg-[#F4EFE6] pt-4 pb-2 z-30">
        <button 
          onClick={onReset} 
          className="flex-1 bg-white border border-[#E8E1D5] text-[#3E3A39] font-bold py-4 px-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-sm active:scale-[0.98]"
        >
          <RefreshCw className="w-5 h-5" />
          <span className="text-base">다시 진단</span>
        </button>
        <button 
          onClick={handleDownload}
          className="flex-[2] bg-[#3E3A39] text-white font-bold py-4 px-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-md hover:bg-[#2C2928] active:scale-[0.98]"
        >
          <Download className="w-5 h-5" />
          <span className="text-base">약봉투 저장하기</span>
        </button>
      </div>
    </div>
  );
};
