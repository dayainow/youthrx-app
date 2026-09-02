import { useEffect, useState } from 'react';

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "당신의 마음을 읽는 중...",
    "마포구 청년정책 탐색 중...",
    "당신을 위한 처방전 작성 중...",
    "조금만 기다려주세요 🤍"
  ];

  useEffect(() => {
    if (textIndex >= texts.length - 1) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setTextIndex((prev) => prev + 1);
    }, 800);

    return () => clearInterval(interval);
  }, [textIndex, onComplete, texts.length]);

  return (
    <div className="p-8 flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in relative z-20">
      <div className="relative w-32 h-32 flex items-center justify-center">
         <div className="absolute inset-0 bg-[#D35400]/5 rounded-full blur-xl animate-pulse-slow"></div>
         <div className="w-20 h-20 border-[3px] border-[#E8E1D5] border-t-[#D35400] rounded-full animate-spin"></div>
         <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse-slow">
          💊
         </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-[#2C3E50] h-8">{texts[textIndex]}</h3>
      </div>
    </div>
  );
};
