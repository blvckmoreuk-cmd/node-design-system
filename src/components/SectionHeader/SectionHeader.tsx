import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  num?: string;
  label: string;
  meta?: ReactNode;
}

export function SectionHeader({ num, label, meta }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 md:px-5 py-3 border-b border-line-strong bg-panel">
      <div className="flex items-center gap-3">
        {num && <span className="text-accent font-mono text-xs font-bold">{num}</span>}
        <span className="text-fg-faint font-mono text-[10px] uppercase tracking-[0.35em]">{label}</span>
      </div>
      {meta}
    </div>
  );
}
