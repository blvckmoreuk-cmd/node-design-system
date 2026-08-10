import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'px-6 py-3 bg-accent-dim text-white font-mono font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors',
  secondary:
    'px-6 py-3 bg-panel border border-line-strong text-fg-muted font-mono font-bold text-[11px] uppercase tracking-[0.2em] hover:text-accent hover:border-accent transition-colors',
};

interface CommonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button({ variant = 'primary', children, className = '', ...rest }: ButtonProps) {
  const classes = `${VARIANT_CLASSES[variant]} ${className}`.trim();

  if (rest.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
