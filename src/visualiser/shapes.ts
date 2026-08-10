export function sphereShape(count: number, radius: number): Float32Array {
  const pts = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    pts[i * 3] = Math.cos(theta) * r * radius;
    pts[i * 3 + 1] = y * radius;
    pts[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return pts;
}

export function tiltX(pts: Float32Array, angle: number): Float32Array {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  for (let i = 0; i < pts.length; i += 3) {
    const y = pts[i + 1];
    const z = pts[i + 2];
    pts[i + 1] = y * cos - z * sin;
    pts[i + 2] = y * sin + z * cos;
  }
  return pts;
}

export function torusShape(count: number, R: number, r: number): Float32Array {
  const pts = new Float32Array(count * 3);
  const a = Math.PI * (3 - Math.sqrt(5));
  const b = Math.PI * 2 * 0.6180339887;
  for (let i = 0; i < count; i++) {
    const u = i * a;
    const v = i * b;
    pts[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
    pts[i * 3 + 1] = r * Math.sin(v);
    pts[i * 3 + 2] = (R + r * Math.cos(v)) * Math.sin(u);
  }
  return pts;
}

export function cubeShape(count: number, size: number): Float32Array {
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const face = i % 6;
    const u = (((i * 12.9898) % 1) * 2 - 1) * size;
    const v = (((i * 78.233) % 1) * 2 - 1) * size;
    let x = 0, y = 0, z = 0;
    if (face === 0) { x = size; y = u; z = v; }
    else if (face === 1) { x = -size; y = u; z = v; }
    else if (face === 2) { y = size; x = u; z = v; }
    else if (face === 3) { y = -size; x = u; z = v; }
    else if (face === 4) { z = size; x = u; y = v; }
    else { z = -size; x = u; y = v; }
    pts[i * 3] = x;
    pts[i * 3 + 1] = y;
    pts[i * 3 + 2] = z;
  }
  return pts;
}

export function helixShape(count: number, radius: number, turns: number, height: number): Float32Array {
  const pts = new Float32Array(count * 3);
  const half = Math.floor(count / 2);
  for (let i = 0; i < count; i++) {
    const onSecondStrand = i >= half;
    const idx = onSecondStrand ? i - half : i;
    const n = onSecondStrand ? count - half : half;
    const t = idx / n;
    const angle = t * Math.PI * 2 * turns + (onSecondStrand ? Math.PI : 0);
    pts[i * 3] = Math.cos(angle) * radius;
    pts[i * 3 + 1] = (t - 0.5) * height;
    pts[i * 3 + 2] = Math.sin(angle) * radius;
  }
  return pts;
}

export const PARTICLE_COUNT = 4200;

export function buildShapeSet(count: number = PARTICLE_COUNT): Float32Array[] {
  return [
    sphereShape(count, 2),
    tiltX(torusShape(count, 1.5, 0.6), 0.95),
    tiltX(cubeShape(count, 1.6), 0.5),
    helixShape(count, 1.4, 2.5, 3.4),
  ];
}
