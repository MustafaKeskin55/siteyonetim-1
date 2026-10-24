import React from 'react';

interface SiteLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

/**
 * Uygulamanın gerçek resmi logosunu (/logo.png) render eder.
 * Kesinlikle yapay SVG veya sahte çizim içermez.
 */
export const SiteLogo: React.FC<SiteLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const dimensions = {
    sm: { img: 'w-7 h-7', rounded: 'rounded-lg', text: 'text-xs' },
    md: { img: 'w-9 h-9', rounded: 'rounded-xl', text: 'text-sm' },
    lg: { img: 'w-16 h-16', rounded: 'rounded-2xl', text: 'text-base' },
  }[size];

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      <div className="flex items-center justify-center shrink-0">
        <img
          src="/logo-icon-transparent.png"
          alt="Site Yönetimi"
          className={`${dimensions.img} object-contain drop-shadow-[0_2px_8px_rgba(99,102,241,0.2)]`}
          draggable={false}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-extrabold ${dimensions.text} tracking-tight text-slate-900 leading-none`}>
            Site Yönetimi
          </span>
          <span className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
            Dijital Apartman & Tesis
          </span>
        </div>
      )}
    </div>
  );
};
