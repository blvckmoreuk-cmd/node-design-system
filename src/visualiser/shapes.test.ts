import { sphereShape, tiltX, torusShape, cubeShape, helixShape, buildShapeSet, PARTICLE_COUNT } from './shapes';

describe('sphereShape', () => {
  it('places every point at the given radius from the origin', () => {
    const pts = sphereShape(50, 2);
    expect(pts).toHaveLength(150);
    for (let i = 0; i < 50; i++) {
      const [x, y, z] = [pts[i * 3], pts[i * 3 + 1], pts[i * 3 + 2]];
      expect(Math.sqrt(x * x + y * y + z * z)).toBeCloseTo(2, 5);
    }
  });
});

describe('tiltX', () => {
  it("preserves point count and each point's distance from the origin", () => {
    const original = sphereShape(20, 1);
    const before = original.slice();
    const tilted = tiltX(original, 0.5);
    expect(tilted).toHaveLength(60);
    for (let i = 0; i < 20; i++) {
      const dBefore = Math.hypot(before[i * 3], before[i * 3 + 1], before[i * 3 + 2]);
      const dAfter = Math.hypot(tilted[i * 3], tilted[i * 3 + 1], tilted[i * 3 + 2]);
      expect(dAfter).toBeCloseTo(dBefore, 5);
    }
  });
});

describe('torusShape', () => {
  it('returns finite coordinates of the right length', () => {
    const pts = torusShape(30, 1.5, 0.6);
    expect(pts).toHaveLength(90);
    expect(pts.every((v) => Number.isFinite(v))).toBe(true);
  });
});

describe('cubeShape', () => {
  it('places every point on one of the six faces (one axis at ±size)', () => {
    const size = 1.6;
    const pts = cubeShape(24, size);
    for (let i = 0; i < 24; i++) {
      const [x, y, z] = [pts[i * 3], pts[i * 3 + 1], pts[i * 3 + 2]];
      const onFace = [x, y, z].some((v) => Math.abs(Math.abs(v) - size) < 1e-4);
      expect(onFace).toBe(true);
    }
  });
});

describe('helixShape', () => {
  it("keeps every point's height within the requested range", () => {
    const height = 3.4;
    const pts = helixShape(40, 1.4, 2.5, height);
    for (let i = 0; i < 40; i++) {
      expect(Math.abs(pts[i * 3 + 1])).toBeLessThanOrEqual(height / 2 + 1e-4);
    }
  });
});

describe('buildShapeSet', () => {
  it('returns four shapes of PARTICLE_COUNT points each by default', () => {
    const set = buildShapeSet();
    expect(set).toHaveLength(4);
    for (const shape of set) {
      expect(shape).toHaveLength(PARTICLE_COUNT * 3);
    }
  });
});
