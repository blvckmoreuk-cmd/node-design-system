export interface ClientMarqueeProps {
  clients: string[];
}

export function ClientMarquee({ clients }: ClientMarqueeProps) {
  const doubled = [...clients, ...clients];

  return (
    <div className="border-b border-line-strong bg-base overflow-hidden relative" aria-label="Clients">
      <div className="absolute inset-y-0 left-0 w-12 md:w-20 z-10 bg-linear-to-r from-base to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 md:w-20 z-10 bg-linear-to-l from-base to-transparent pointer-events-none" />
      <div className="marquee-track py-3">
        {doubled.map((client, i) => (
          <span
            key={`${client}-${i}`}
            className="flex items-center whitespace-nowrap px-5 md:px-7 font-mono text-[11px] uppercase tracking-[0.25em] text-fg-muted"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(47,111,237,0.7)] mr-5 md:mr-7" />
            {client}
          </span>
        ))}
      </div>
    </div>
  );
}
