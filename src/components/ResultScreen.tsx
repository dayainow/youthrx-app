import type { Policy, UserEmotion } from '../hooks/usePrescription';
import { Download } from 'lucide-react';

interface Props {
  policies: Policy[];
  userEmotion: UserEmotion | null;
  onReset: () => void;
}

export const ResultScreen = ({ policies, userEmotion, onReset }: Props) => {
  const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '-').replace(/ /g, '');
  const timeStr = new Date().toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit' });

  const getComfortMessage = () => {
    if (userEmotion === '지쳤어') return "갓생 사느라 너무 고생 많았어요.\n잠시 내려놓아도 괜찮아요.\n당신의 짐을 조금 덜어드릴게요.";
    if (userEmotion === '우울해') return "아무것도 안 한 것 같아도 괜찮아요.\n숨 쉬고 버텨낸 것만으로도 대단한걸요.\n당신의 속도대로 천천히 가도 좋아요.";
    if (userEmotion === '완벽해') return "폼 미친 오늘! 너무 멋져요 🔥\n지금의 에너지를 계속 이어갈 수 있게\n든든한 부스터를 처방해 드릴게요.";
    return "조급해하지 말고 하나씩 천천히 해봐요!\n마포구와 우리가 당신을 곁에서 응원할게요! 🤍";
  };

  return (
    <div className="p-4 flex-1 flex flex-col animate-slide-up relative z-20">
      <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide flex justify-center mt-2">
        {/* Receipt Container */}
        <div className="bg-[#fcfbf9] text-[#2C3E50] w-full max-w-[320px] rounded-sm shadow-xl relative p-6 font-receipt h-fit border border-[#E8E1D5]">
          {/* Jagged top edge effect */}
          <div className="absolute -top-1 left-0 w-full h-2 bg-repeat-x" style={{ backgroundImage: 'radial-gradient(circle, #fcfbf9 4px, transparent 4px)', backgroundSize: '10px 10px', backgroundPosition: 'top -4px left 0' }}></div>
          
          {/* Analog Stamp */}
          <div className="absolute top-8 right-4 border-2 border-[#E74C3C] text-[#E74C3C] px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-sm rotate-[15deg] animate-stamp mix-blend-multiply opacity-80">
            처방완료
          </div>

          <div className="text-center mb-6 mt-2">
            <h2 className="text-3xl font-bold tracking-tighter uppercase mb-1">Youth RX</h2>
            <p className="text-[10px] text-[#7F8C8D] uppercase tracking-widest">Mind Policy Pharmacy</p>
          </div>
          
          <div className="border-b-2 border-dashed border-[#BDC3C7] pb-3 mb-3 text-[10px] flex justify-between uppercase font-bold text-[#7F8C8D]">
            <div>
              <p>DATE: {dateStr}</p>
              <p>TIME: {timeStr}</p>
            </div>
            <div className="text-right">
              <p>NO. 0042</p>
              <p>DR. MAPO</p>
            </div>
          </div>

          <div className="mb-6 text-center">
            <h3 className="font-bold text-xs mb-2 border-b border-[#2C3E50] pb-1 uppercase inline-block">* Prescription *</h3>
            <p className="text-xs leading-relaxed mt-2 font-bold whitespace-pre-line break-keep font-sans">
              {getComfortMessage()}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="text-xs font-bold border-b border-[#2C3E50] pb-1 uppercase">Recommended Policies</div>
            {policies.map((policy, idx) => (
              <a 
                key={policy.id}
                href={policy.url}
                target="_blank"
                rel="noreferrer"
                className="block group"
              >
                <div className="flex justify-between items-start text-sm font-bold">
                  <span className="w-5 text-[#D35400]">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="flex-1 leading-tight group-hover:underline pr-2 font-sans text-[13px]">{policy.title}</span>
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-[#7F8C8D]">
                  <span className="ml-5 font-sans font-medium">{policy.category}</span>
                  <span className="underline">[LINK]</span>
                </div>
              </a>
            ))}
            {policies.length === 0 && (
              <div className="text-xs text-center py-4">NO POLICIES FOUND.</div>
            )}
          </div>

          <div className="border-t-2 border-dashed border-[#BDC3C7] pt-4 text-center">
            {/* Fake Barcode */}
            <div className="flex justify-center space-x-[2px] h-10 mb-2 overflow-hidden opacity-70">
               {Array.from({length: 40}).map((_, i) => (
                 <div key={i} className="bg-[#2C3E50] h-full" style={{ width: `${Math.max(1, Math.floor(Math.random() * 4))}px` }}></div>
               ))}
            </div>
            <p className="text-[10px] tracking-widest uppercase font-bold text-[#7F8C8D]">M A P O - Y O U T H - R X</p>
          </div>
          
          {/* Jagged bottom edge effect */}
          <div className="absolute -bottom-1 left-0 w-full h-2 bg-repeat-x" style={{ backgroundImage: 'radial-gradient(circle, #fcfbf9 4px, transparent 4px)', backgroundSize: '10px 10px', backgroundPosition: 'bottom -4px left 0' }}></div>
        </div>
      </div>
      
      <button 
        onClick={onReset} 
        className="w-full bg-[#2C3E50] hover:bg-[#34495E] text-white font-medium py-5 px-6 rounded-2xl transition-all flex items-center justify-center space-x-2 mt-4 shadow-md active:scale-[0.98]"
      >
        <Download className="w-5 h-5" />
        <span className="text-lg">처방전 저장하기</span>
      </button>
    </div>
  );
};
