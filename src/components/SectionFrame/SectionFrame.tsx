import type { ReactNode } from 'react';

export interface SectionFrameProps {
  id?: string;
  max?: string;
  className?: string;
  children: ReactNode;
}

export function SectionFrame({ id, max = 'max-w-4xl', className = '', children }: SectionFrameProps) {
  return (
    <div id={id} className={`w-full border border-line-strong bg-base relative z-10 ${max} ${className}`.trim()}>
      {children}
    </div>
  );
}
