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
         <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse-slow"></div>
         <div className="w-20 h-20 border-[3px] border-gray-100 border-t-indigo-600 rounded-full animate-spin"></div>
         <div className="absolute inset-0 flex items-center justify-center animate-pulse-slow">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pill text-indigo-500"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
         </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-gray-900 h-8">{texts[textIndex]}</h3>
      </div>
    </div>
  );
};
