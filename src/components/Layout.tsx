import type { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center p-4">
      <div className="bg-[#FAF8F2] text-[#3E3A39] rounded-[2rem] w-full max-w-sm h-[750px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col border border-[#E8E1D5]">
        
        {/* Subtle noise/texture overlay (optional CSS pattern) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};
