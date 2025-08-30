export type PreprocessOpts = {
  clampLowerPct?: number; // persen pemotongan bawah (robust terhadap outlier)
  clampUpperPct?: number; // persen pemotongan atas
  smoothKernel?: number;  // moving average N (ganjil, ex: 3 atau 5)
  targetRangeMv?: number; // skala tampilan +/- mV
};

export function movingAverage(values: number[], k = 3): number[] {
  if (k <= 1 || k % 2 === 0) return values.slice();
  const half = Math.floor(k / 2);
  const out = new Array(values.length).fill(0);
  for (let i = 0; i < values.length; i++) {
    let s = 0, c = 0;
    for (let j = i - half; j <= i + half; j++) {
      if (j >= 0 && j < values.length) { s += values[j]; c++; }
    }
    out[i] = s / c;
  }
  return out;
}

export function clampByPercentile(values: number[], lowPct = 1, highPct = 99): number[] {
  const vs = values.slice().sort((a, b) => a - b);
  const q = (p: number) => {
    const idx = Math.min(vs.length - 1, Math.max(0, Math.round((p / 100) * (vs.length - 1))));
    return vs[idx];
  };
  const lo = q(lowPct), hi = q(highPct);
  return values.map(v => Math.max(lo, Math.min(hi, v)));
}

/** Centering (zero-baseline) + robust clamp + smoothing + scaling ke mV */
export function preprocessECG(raw: number[], opts: PreprocessOpts = {}): number[] {
  const {
    clampLowerPct = 1,
    clampUpperPct = 99,
    smoothKernel = 3,
    targetRangeMv = 1.5, // tampilkan pada +/-1.5 mV
  } = opts;

  // 1) zero-center (kurangi median)
  const sorted = raw.slice().sort((a, b) => a - b);
  const med = sorted[Math.floor(sorted.length / 2)];
  let v = raw.map(x => x - med);

  // 2) robust clamp (buang outlier ekstrem)
  v = clampByPercentile(v, clampLowerPct, clampUpperPct);

  // 3) smoothing ringan (moving average)
  v = movingAverage(v, smoothKernel);

  // 4) scaling ke mV: normalisasi ke maxAbs lalu kalikan targetRange
  const maxAbs = Math.max(1e-9, Math.max(...v.map(Math.abs)));
  const scale = targetRangeMv / maxAbs;
  v = v.map(x => x * scale); // sekarang kira-kira di rentang +/- targetRangeMv mV

  return v;
}
