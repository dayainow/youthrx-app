import { useEffect, useState } from 'react';
import loadingChick from '../assets/mapo-chick-loading.png';
import { CHAT } from '../engine/chatScript';

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  // 조제 중 문구를 번갈아 보여준다 (구현안내서 3절)
  const [lineIndex, setLineIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setLineIndex((i) => (i + 1) % CHAT.loading.length),
      1200,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-[#FAF8F2] animate-fade-in h-full relative">
      <div className="w-48 h-48 md:w-64 md:h-64 mb-8 md:mb-10">
        <img src={loadingChick} alt="팔을 들고 응원하는 마포 병아리 캐릭터" className="w-full h-full object-contain loading-chick" fetchPriority="high" />
      </div>
      
      <div className="text-center space-y-3" role="status" aria-live="polite">
        <h2 className="text-xl md:text-3xl font-bold text-[#3E3A39] break-keep px-4">
          {CHAT.loading[lineIndex]}
        </h2>
        <p className="text-[#7F8C8D] text-sm md:text-base break-keep">
          잠시만 기다려주세요.
        </p>
      </div>

      <div className="mt-12 flex space-x-2">
        <div className="w-3 h-3 bg-[#B5731A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-[#B5731A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-[#B5731A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] text-gray-400/60 font-light px-4 break-keep">
        서울청년센터마포, 아트앤쉐어링, 올라, 드림잇 수어스터디, 아일랜드 춤과음악
      </div>
    </div>
  );
};
