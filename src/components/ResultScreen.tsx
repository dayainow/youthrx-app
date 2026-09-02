import type { Policy, UserEmotion, UserConcern, UserState } from '../hooks/usePrescription';
import { Download, RefreshCw } from 'lucide-react';

interface Props {
  policies: Policy[];
  userEmotion: UserEmotion | null;
  userConcern?: UserConcern | null; // Note: passed from App if we have it, or we can just use emotion
  onReset: () => void;
}

export const ResultScreen = ({ policies, userEmotion, onReset }: Props) => {
  const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  const getSymptomText = () => {
    if (userEmotion === '지쳤어') return "갓생 피로 증후군 및 에너지고갈";
    if (userEmotion === '우울해') return "급성 무기력증 및 일상 우울감";
    if (userEmotion === '완벽해') return "과다 열정 증후군 (휴식 요망)";
    return "만성 고민 증후군 및 방향 상실";
  };

  const getDosageText = (idx: number) => {
    const dosages = [
      "식후 30분, 마음이 답답할 때 1회 복용",
      "취침 전, 생각이 많아질 때 1회 복용",
      "스트레스 수치가 올라갈 때 즉시 투여",
      "아침 기상 직후, 활력이 필요할 때 복용"
    ];
    return dosages[idx % dosages.length];
  };

  return (
    <div className="p-4 sm:p-6 flex-1 flex flex-col relative z-20">
      <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide flex justify-center animate-slide-up">
        
        {/* Authentic Korean Prescription Form (처방전) */}
        <div className="bg-white text-[#111] w-full max-w-[340px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] h-fit border border-[#D3D3D3] relative overflow-hidden flex flex-col font-sans">
          
          {/* Header */}
          <div className="text-center pt-8 pb-4 border-b-2 border-black relative">
            <h2 className="text-3xl font-bold tracking-[0.5em] ml-[0.5em] text-black">처방전</h2>
            <div className="absolute top-4 right-4 border border-black text-[10px] px-1 py-0.5 tracking-wider">
              환자보관용
            </div>
            <div className="absolute top-4 left-4 text-2xl text-[#E74C3C]">
              ✚
            </div>
          </div>

          {/* Form Table */}
          <div className="flex flex-col border-b-2 border-black">
            
            <div className="flex border-b border-black/20 text-xs">
              <div className="w-[80px] bg-[#F8F9FA] border-r border-black/20 flex items-center justify-center font-bold py-3 text-center tracking-widest text-[#333]">
                교부일자
              </div>
              <div className="flex-1 px-3 py-3 font-medium text-[#222]">
                {dateStr}
              </div>
            </div>

            <div className="flex border-b border-black/20 text-xs">
              <div className="w-[80px] bg-[#F8F9FA] border-r border-black/20 flex items-center justify-center font-bold py-3 text-center tracking-widest text-[#333]">
                성<span className="text-transparent w-4 inline-block"></span>명
              </div>
              <div className="flex-1 px-3 py-3 font-medium text-[#222] flex justify-between items-center">
                <span>마포 청년</span>
                <span className="text-[10px] text-gray-500">(만 19~39세)</span>
              </div>
            </div>

            <div className="flex border-b border-black/20 text-xs">
              <div className="w-[80px] bg-[#F8F9FA] border-r border-black/20 flex items-center justify-center font-bold py-3 text-center tracking-widest text-[#333]">
                병<span className="text-transparent w-4 inline-block"></span>명
              </div>
              <div className="flex-1 px-3 py-3 font-bold text-[#E74C3C]">
                {getSymptomText()}
              </div>
            </div>

          </div>

          {/* Prescription List */}
          <div className="flex flex-col flex-1 p-4 bg-[#FAFAFA]">
            <div className="text-[11px] font-bold mb-4 flex items-center space-x-1 text-black">
              <span className="text-[#E74C3C]">Rx.</span>
              <span>처방 내역 (명칭 / 용법 / 용량)</span>
            </div>

            <div className="space-y-4">
              {policies.map((policy, idx) => (
                <a 
                  key={policy.id}
                  href={policy.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-white border border-[#E0E0E0] p-3 rounded-sm shadow-sm hover:border-[#2C3E50] transition-colors"
                >
                  <div className="flex items-start mb-1.5">
                    <div className="bg-[#2C3E50] text-white text-[9px] px-1.5 py-0.5 rounded-sm mr-2 font-bold whitespace-nowrap mt-0.5">
                      {policy.category}
                    </div>
                    <div className="text-[13px] font-bold text-[#111] leading-tight flex-1 underline decoration-gray-300 underline-offset-2">
                      {policy.title}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#555] font-medium flex items-start space-x-1 pl-[1px]">
                    <span className="text-[#E74C3C] text-[10px] mt-[1px]">▶</span>
                    <span className="leading-snug">{getDosageText(idx)}</span>
                  </div>
                </a>
              ))}
              {policies.length === 0 && (
                <div className="text-xs text-center py-8 text-gray-500 font-medium">
                  처방 가능한 내역이 없습니다.
                </div>
              )}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-[10px] text-gray-500 mb-1">위와 같이 처방함.</p>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="border-t border-black/20 p-4 flex justify-end items-center bg-white relative">
            <div className="text-xs font-bold text-[#333] flex items-center">
              <span className="mr-3">담당의 :</span>
              <span className="tracking-widest">마포 마음약국</span>
            </div>
            {/* Red Stamp */}
            <div className="w-10 h-10 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 text-[10px] font-bold ml-2 -rotate-[15deg] mix-blend-multiply opacity-80 shrink-0">
              마포<br/>약국
            </div>
          </div>
          
        </div>
      </div>
      
      <div className="flex space-x-3 mt-2">
        <button 
          onClick={onReset} 
          className="flex-1 bg-white border border-[#E8E1D5] text-[#2C3E50] font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm">다시 진단하기</span>
        </button>
        <button 
          className="flex-[2] bg-[#2C3E50] text-white font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">처방전 저장</span>
        </button>
      </div>
    </div>
  );
};
