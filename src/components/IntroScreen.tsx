import { Play, Pill } from 'lucide-react';
import mapoLogo from '../assets/mapo_logo.png';

export const IntroScreen = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="p-6 sm:p-8 md:p-12 flex-1 flex flex-col items-center justify-center gap-8 sm:gap-10 md:grid md:grid-cols-[1.08fr_0.92fr] md:grid-rows-[1fr_auto] md:gap-x-10 md:gap-y-8 animate-fade-in relative z-20">
      <div className="text-center md:text-left space-y-4 md:space-y-5 flex flex-col items-center md:items-start md:self-center">
        <img src={mapoLogo} alt="서울청년센터 마포" className="h-10 md:h-12 object-contain mb-1 md:mb-2" />
        <h2 className="text-[2.5rem] md:text-5xl leading-tight font-extrabold tracking-tight text-gray-900 mt-1 md:mt-2">
          마음약방<br/>처방전
        </h2>
        <p className="text-gray-500 text-[15px] md:text-lg leading-relaxed break-keep px-2 md:px-0">
          오늘 하루, 정말 고생 많았어요.<br />
          마포구 청년들을 위한 작은 위로와<br/>
          실질적인 정책을 처방해 드릴게요.
        </p>
      </div>
      
      {/* Modern Medical Icon Area */}
      <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center md:justify-self-center">
         <div className="absolute inset-0 bg-indigo-100 rounded-full animate-pulse-slow opacity-50 blur-xl"></div>
         <div className="w-32 h-32 md:w-44 md:h-44 rounded-full flex items-center justify-center bg-white shadow-[0_16px_40px_rgba(79,70,229,0.16)] relative z-10 border border-indigo-50">
           <Pill className="w-14 h-14 md:w-20 md:h-20 text-indigo-500" />
         </div>
      </div>
      
      <button 
        onClick={onNext} 
        className="w-full md:col-span-2 md:max-w-[520px] md:justify-self-center bg-gray-900 hover:bg-black text-white font-semibold py-4 sm:py-5 px-6 rounded-[1.25rem] transition-all flex items-center justify-center space-x-2 z-10 shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-[0.98]"
      >
        <span className="text-[17px] md:text-lg">처방 시작하기</span>
        <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
      </button>
    </div>
  );
};
