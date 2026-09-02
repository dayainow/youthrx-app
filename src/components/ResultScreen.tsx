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
      <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide flex justify-center">
        {/* Receipt Container */}
        <div className="bg-[#f9f9f9] text-[#111] w-full max-w-[320px] rounded-sm shadow-2xl relative p-6 font-receipt h-fit">
          {/* Jagged top edge effect */}
          <div className="absolute -top-1 left-0 w-full h-2 bg-repeat-x" style={{ backgroundImage: 'radial-gradient(circle, #f9f9f9 4px, transparent 4px)', backgroundSize: '10px 10px', backgroundPosition: 'top -4px left 0' }}></div>
          
          <div className="text-center mb-6 mt-2">
            <h2 className="text-3xl font-bold tracking-tighter uppercase mb-1">Youth RX</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Mind Policy Pharmacy</p>
          </div>
          
          <div className="border-b-2 border-dashed border-gray-400 pb-3 mb-3 text-[10px] flex justify-between uppercase">
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
            <h3 className="font-bold text-xs mb-2 border-b border-black pb-1 uppercase inline-block">* Prescription *</h3>
            <p className="text-xs leading-relaxed mt-2 font-medium whitespace-pre-line">
              {getComfortMessage()}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="text-xs font-bold border-b border-black pb-1 uppercase">Recommended Policies</div>
            {policies.map((policy, idx) => (
              <a 
                key={policy.id}
                href={policy.url}
                target="_blank"
                rel="noreferrer"
                className="block group"
              >
                <div className="flex justify-between items-start text-sm font-bold">
                  <span className="w-5">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="flex-1 leading-tight group-hover:underline pr-2">{policy.title}</span>
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-gray-500">
                  <span className="ml-5">{policy.category}</span>
                  <span className="underline">[LINK]</span>
                </div>
              </a>
            ))}
            {policies.length === 0 && (
              <div className="text-xs text-center py-4">NO POLICIES FOUND.</div>
            )}
          </div>

          <div className="border-t-2 border-dashed border-gray-400 pt-4 text-center">
            {/* Fake Barcode */}
            <div className="flex justify-center space-x-[2px] h-10 mb-2 overflow-hidden">
               {Array.from({length: 40}).map((_, i) => (
                 <div key={i} className="bg-black h-full" style={{ width: `${Math.max(1, Math.floor(Math.random() * 4))}px` }}></div>
               ))}
            </div>
            <p className="text-[10px] tracking-widest uppercase">M A P O - Y O U T H - R X</p>
          </div>
          
          {/* Jagged bottom edge effect */}
          <div className="absolute -bottom-1 left-0 w-full h-2 bg-repeat-x" style={{ backgroundImage: 'radial-gradient(circle, #f9f9f9 4px, transparent 4px)', backgroundSize: '10px 10px', backgroundPosition: 'bottom -4px left 0' }}></div>
        </div>
      </div>
      
      <button 
        onClick={onReset} 
        className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-4 px-6 rounded-full backdrop-blur-md transition-all flex items-center justify-center space-x-2 mt-4 shadow-lg"
      >
        <Download className="w-4 h-4" />
        <span>Save Receipt</span>
      </button>
    </div>
  );
};
