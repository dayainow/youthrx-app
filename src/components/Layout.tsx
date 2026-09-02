import type { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white rounded-[2.5rem] w-full max-w-sm h-[750px] shadow-2xl relative overflow-hidden flex flex-col border border-white/10">
        {/* Glow effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[50%] rounded-full bg-blue-500/30 blur-[80px]"></div>
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-500/30 blur-[80px]"></div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};
