import { updateEnvelope, computeBassRaw } from './envelope';

describe('updateEnvelope', () => {
  it('moves toward a rising value at the attack rate', () => {
    const next = updateEnvelope(0, 1, 0.55, 0.07);
    expect(next).toBeCloseTo(0.55, 5);
  });

  it('moves toward a falling value at the decay rate', () => {
    const next = updateEnvelope(1, 0, 0.55, 0.07);
    expect(next).toBeCloseTo(0.93, 5);
  });

  it('decay is slower than attack for the same-size step', () => {
    const attackStep = updateEnvelope(0, 1, 0.55, 0.07) - 0;
    const decayStep = 1 - updateEnvelope(1, 0, 0.55, 0.07);
    expect(attackStep).toBeGreaterThan(decayStep);
  });
});

describe('computeBassRaw', () => {
  it('computes overall volume as the mean level over 128', () => {
    const data = new Uint8Array([128, 128, 128, 128]);
    const { volume } = computeBassRaw(data, 44100);
    expect(volume).toBeCloseTo(1, 5);
  });

  it('isolates roughly the bottom 200Hz into bassRaw', () => {
    // 4 bins over 44100 sampleRate: nyquist 22050, binHz 5512.5 -> bassBinCount = max(2, round(200/5512.5)) = 2
    const data = new Uint8Array([255, 255, 0, 0]);
    const { bassRaw } = computeBassRaw(data, 44100);
    expect(bassRaw).toBeCloseTo(1, 5); // both bass bins maxed, ignores the zeroed top bins
  });
});
