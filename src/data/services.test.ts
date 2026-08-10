import { services } from './services';

describe('services data', () => {
  it('has six services with unique numerals and valid hex colours', () => {
    expect(services).toHaveLength(6);
    const nums = services.map((s) => s.num);
    expect(new Set(nums).size).toBe(6);
    for (const s of services) {
      expect(s.hex).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('flags exactly two services with the first-order offer', () => {
    expect(services.filter((s) => s.firstOrderOffer)).toHaveLength(2);
  });
});
