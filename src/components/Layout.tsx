import type { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white text-gray-900 rounded-[2.5rem] w-full max-w-sm h-[750px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col border border-gray-100">
        
        {/* Modern subtle glow effect */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none"></div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col relative z-10 w-full h-full min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};
