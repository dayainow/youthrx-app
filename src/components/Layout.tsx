import type { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="app-shell bg-[#F6F5F2] flex items-center justify-center">
      <div className="app-frame bg-white text-gray-900 rounded-none min-[480px]:rounded-[2rem] md:rounded-[2.5rem] w-full shadow-[0_24px_70px_-24px_rgba(62,58,57,0.22)] relative overflow-hidden flex flex-col border-0 min-[480px]:border border-gray-100">
        
        {/* Modern subtle glow effect */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#F4EFE6] to-transparent pointer-events-none"></div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col relative z-10 w-full h-full min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};
