// @ts-nocheck
import { useEffect, useState } from 'react';
import { useLottie } from 'lottie-react';
import loadingAnimation from '../assets/loading.json';
import { CHAT } from '../engine/chatScript';

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const options = {
    animationData: loadingAnimation,
    loop: true
  };
  const { View } = useLottie(options);

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
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-white animate-fade-in h-full">
      <div className="w-48 h-48 md:w-64 md:h-64 mb-8 md:mb-10">
        {View}
      </div>
      
      <div className="text-center space-y-3">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 break-keep px-4">
          {CHAT.loading[lineIndex]}
        </h2>
        <p className="text-gray-500 text-sm md:text-base break-keep">
          잠시만 기다려주세요.
        </p>
      </div>

      <div className="mt-12 flex space-x-2">
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};
