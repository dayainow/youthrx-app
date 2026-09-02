import { Play } from 'lucide-react';

export const IntroScreen = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="p-8 flex-1 flex flex-col items-center justify-center space-y-12 animate-fade-in relative z-20">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-light tracking-wide text-white">마음약국<br/>처방전</h2>
        <p className="text-white/70 text-sm font-light leading-relaxed">
          오늘 하루, 정말 고생 많았어요.<br />
          마포구 청년들을 위한 작은 위로와<br/>
          실질적인 정책을 처방해 드릴게요.
        </p>
      </div>
      
      {/* Soft blob representation instead of alien */}
      <div className="relative w-40 h-40 flex items-center justify-center">
         <div className="absolute inset-0 bg-pink-400/30 rounded-full blur-xl animate-pulse-slow pointer-events-none"></div>
         <div className="relative w-32 h-32 bg-gradient-to-tr from-pink-400 to-indigo-400 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(236,72,153,0.4)] border border-white/20 z-10 animate-pulse-slow">
           🤍
         </div>
      </div>
      
      <button 
        onClick={onNext} 
        className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-4 px-6 rounded-full backdrop-blur-md transition-all flex items-center justify-center space-x-2 mt-8 z-10 shadow-lg"
      >
        <span>처방 시작하기</span>
        <Play className="w-4 h-4 fill-current" />
      </button>
    </div>
  );
};
