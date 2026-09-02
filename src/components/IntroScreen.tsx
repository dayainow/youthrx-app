import { Play } from 'lucide-react';

export const IntroScreen = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="p-8 flex-1 flex flex-col items-center justify-center space-y-12 animate-fade-in relative z-20">
      <div className="text-center space-y-5">
        <div className="inline-block border-2 border-[#D35400] text-[#D35400] px-3 py-1 font-bold text-sm tracking-widest uppercase rounded-sm rotate-[-3deg] animate-stamp shadow-sm">
          마포구 보건소
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-[#2C3E50]">마음약방<br/>처방전</h2>
        <p className="text-[#7F8C8D] text-base leading-relaxed break-keep px-4">
          오늘 하루, 정말 고생 많았어요.<br />
          마포구 청년들을 위한 작은 위로와<br/>
          실질적인 정책을 처방해 드릴게요.
        </p>
      </div>
      
      {/* Analog Medicine Icon */}
      <div className="relative w-40 h-40 flex items-center justify-center">
         <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#BDC3C7] flex items-center justify-center text-6xl text-[#E74C3C] bg-white shadow-sm">
           💊
         </div>
      </div>
      
      <button 
        onClick={onNext} 
        className="w-full bg-[#2C3E50] hover:bg-[#34495E] text-white font-medium py-5 px-6 rounded-2xl transition-all flex items-center justify-center space-x-2 mt-8 z-10 shadow-md active:scale-[0.98]"
      >
        <span className="text-lg">처방 시작하기</span>
        <Play className="w-5 h-5 fill-current" />
      </button>
    </div>
  );
};
