export function updateEnvelope(previous: number, raw: number, attack: number, decay: number): number {
  const rate = raw > previous ? attack : decay;
  return previous + (raw - previous) * rate;
}

export function computeBassRaw(dataArray: Uint8Array, sampleRate: number): { volume: number; bassRaw: number } {
  const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 128;

  const nyquist = sampleRate / 2;
  const binHz = nyquist / dataArray.length;
  const bassBinCount = Math.max(2, Math.round(200 / binHz));

  let bassSum = 0;
  for (let b = 0; b < bassBinCount; b++) bassSum += dataArray[b];
  const bassRaw = bassSum / bassBinCount / 255;

  return { volume, bassRaw };
}
