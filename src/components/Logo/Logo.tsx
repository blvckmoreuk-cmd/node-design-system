export interface LogoProps {
  size?: number;
}

export function Logo({ size = 128 }: LogoProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width={size} height={size}>
      <defs>
        <radialGradient id="node-logo-glow" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#2f6fed" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#2f6fed" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={64} cy={64} r={60} fill="url(#node-logo-glow)" />
      <circle cx={64} cy={64} r={30} fill="#2f6fed" />
    </svg>
  );
}
