export interface HeaderProps {
  currentPath: string;
}

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Shop', href: '/shop' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
];

function NavGroup({
  items,
  currentPath,
  justify,
}: {
  items: NavItem[];
  currentPath: string;
  justify: 'start' | 'end';
}) {
  const justifyClass = justify === 'start' ? 'justify-start' : 'justify-end';
  return (
    <nav aria-label="Site navigation" className={`flex items-center gap-3 sm:gap-6 md:gap-9 ${justifyClass}`}>
      {items.map((item) => {
        const isActive = currentPath === item.href;
        return (
          <a key={item.href} href={item.href} className="group flex flex-col items-center gap-1.5 no-underline">
            <span
              className={`relative w-10 h-4 sm:h-5 rounded-full border flex items-center px-0.5 transition-colors duration-200 ${
                isActive ? 'border-accent/50 bg-[#12233f]' : 'border-[#2a2f37] bg-[#14181d] group-hover:border-[#3d4550]'
              }`}
            >
              <span
                className={`block w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'translate-x-5.5 sm:translate-x-4.5 bg-accent shadow-[0_0_6px_rgba(47,111,237,0.7)]'
                    : 'translate-x-0 bg-[#5a6472] group-hover:translate-x-5.5 sm:group-hover:translate-x-4.5 group-hover:bg-accent group-hover:shadow-[0_0_6px_rgba(47,111,237,0.7)]'
                }`}
              />
            </span>
            <span
              className={`text-[9px] sm:text-[11px] font-medium uppercase tracking-wider sm:tracking-[0.25em] whitespace-nowrap transition-colors duration-200 ${
                isActive ? 'text-fg' : 'text-fg-faint group-hover:text-fg'
              }`}
            >
              {item.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

export function Header({ currentPath }: HeaderProps) {
  const normalized = currentPath.replace(/\/$/, '') || '/';
  const leftItems = NAV_ITEMS.slice(0, 3);
  const rightItems = NAV_ITEMS.slice(3);

  return (
    <header className="w-full px-3 sm:px-6 md:px-10 py-3 sm:py-4 font-mono border-b border-line">
      <div className="max-w-4xl mx-auto relative flex items-center justify-between gap-2 sm:gap-4">
        <a href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center no-underline">
          <span className="text-lg sm:text-xl md:text-2xl font-display font-bold tracking-[0.18em] text-fg uppercase">
            Node
          </span>
          <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(47,111,237,0.8)]" />
        </a>
        <NavGroup items={leftItems} currentPath={normalized} justify="start" />
        <NavGroup items={rightItems} currentPath={normalized} justify="end" />
      </div>
    </header>
  );
}
