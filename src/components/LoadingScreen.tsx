// @ts-nocheck
import { useEffect } from 'react';
import { useLottie } from 'lottie-react';
import loadingAnimation from '../assets/loading.json';

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const options = {
    animationData: loadingAnimation,
    loop: true
  };
  const { View } = useLottie(options);

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
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 animate-pulse break-keep">
          맞춤형 처방을 조제 중입니다...
        </h2>
        <p className="text-gray-500 text-sm md:text-base break-keep">
          잠시만 기다려주세요. 당신을 위한 정책을 찾고 있어요.
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
