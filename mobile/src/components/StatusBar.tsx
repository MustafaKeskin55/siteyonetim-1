import React from 'react';
import { Wifi, Signal, BatteryCharging } from 'lucide-react';

interface StatusBarProps {
  darkText?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ darkText = true }) => {
  const textColor = darkText ? 'text-slate-900' : 'text-white';

  return (
    <div className={`w-full flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold select-none ${textColor}`}>
      {/* Time */}
      <span className="tracking-tight text-sm font-bold">9:41</span>
      
      {/* Dynamic Island / Speaker cutout simulation */}
      <div className="w-24 h-4 bg-black/10 rounded-full hidden sm:block"></div>

      {/* Status Icons */}
      <div className="flex items-center space-x-1.5 opacity-90">
        <Signal className="w-3.5 h-3.5 fill-current" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center space-x-0.5">
          <div className="w-5 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
            <div className="w-full h-full bg-current rounded-2xs"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
