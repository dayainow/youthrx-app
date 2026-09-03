import { Play, Pill } from 'lucide-react';
import mapoLogo from '../assets/mapo_logo.png';

export const IntroScreen = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="p-8 flex-1 flex flex-col items-center justify-center space-y-12 animate-fade-in relative z-20">
      <div className="text-center space-y-4 flex flex-col items-center">
        <img src={mapoLogo} alt="서울청년센터 마포" className="h-10 object-contain mb-2" />
        <h2 className="text-[2.5rem] leading-tight font-extrabold tracking-tight text-gray-900 mt-2">
          마음약방<br/>처방전
        </h2>
        <p className="text-gray-500 text-[15px] leading-relaxed break-keep px-2">
          오늘 하루, 정말 고생 많았어요.<br />
          마포구 청년들을 위한 작은 위로와<br/>
          실질적인 정책을 처방해 드릴게요.
        </p>
      </div>
      
      {/* Modern Medical Icon Area */}
      <div className="relative w-40 h-40 flex items-center justify-center">
         <div className="absolute inset-0 bg-indigo-100 rounded-full animate-pulse-slow opacity-50 blur-xl"></div>
         <div className="w-32 h-32 rounded-full flex items-center justify-center bg-white shadow-[0_10px_30px_rgba(79,70,229,0.15)] relative z-10 border border-indigo-50">
           <Pill className="w-14 h-14 text-indigo-500" />
         </div>
      </div>
      
      <button 
        onClick={onNext} 
        className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-5 px-6 rounded-[1.25rem] transition-all flex items-center justify-center space-x-2 mt-8 z-10 shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-[0.98]"
      >
        <span className="text-[17px]">처방 시작하기</span>
        <Play className="w-5 h-5 fill-current" />
      </button>
    </div>
  );
};
