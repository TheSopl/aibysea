'use client';

import { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content, side = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const sideClasses = {
    top: 'bottom-full mb-2 start-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 start-1/2 -translate-x-1/2',
    left: 'end-full me-2 top-1/2 -translate-y-1/2',
    right: 'start-full ms-2 top-1/2 -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'top-full start-1/2 -translate-x-1/2 border-s-4 border-e-4 border-t-4 border-s-transparent border-e-transparent border-t-slate-900 dark:border-t-slate-700',
    bottom: 'bottom-full start-1/2 -translate-x-1/2 border-s-4 border-e-4 border-b-4 border-s-transparent border-e-transparent border-b-slate-900 dark:border-b-slate-700',
    left: 'start-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-s-4 border-t-transparent border-b-transparent border-s-slate-900 dark:border-s-slate-700',
    right: 'end-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-e-4 border-t-transparent border-b-transparent border-e-slate-900 dark:border-e-slate-700',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>

      {visible && (
        <div
          className={`absolute whitespace-nowrap px-3 py-2 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold shadow-lg z-50 pointer-events-none ${sideClasses[side]}`}
        >
          {content}
          <div className={`absolute w-0 h-0 ${arrowClasses[side]}`} />
        </div>
      )}
    </div>
  );
}
