import type { ECGSample } from "@/lib/loadCsv";

export type Arr<T> = T[];

/** Kelas target: L N Q R V */
export type ClassLabel = "L" | "N" | "Q" | "R" | "V";

export type Segment = {
  startIndex: number;            // index sampel awal (global)
  endIndex: number;              // index sampel akhir (global, inklusif)
  samples: Arr<number>;          // amplitudo di window
};

export type SegDiagnosis = {
  label: ClassLabel;
  confidence: number;            // 0..1 (dummy)
};

export type Summary = {
  totalSegments: number;                      // jumlah annotation (window)
  counts: Record<ClassLabel, number>;         // hitung per kelas
  percentages: Record<ClassLabel, number>;    // %
};

/** Potong sinyal jadi segmen windowSec (default 0.7 s) */
export function segmentECG(samples: ECGSample[], sr = 250, windowSec = 0.7): Segment[] {
  const L = samples.length;
  const win = Math.max(1, Math.round(sr * windowSec));
  const segments: Segment[] = [];
  for (let i = 0; i + win <= L; i += win) {
    const seg = samples.slice(i, i + win).map(s => s.v);
    segments.push({
      startIndex: i,
      endIndex: i + win - 1,
      samples: seg,
    });
  }
  return segments;
}

/** Dummy classifier: heuristik ringan biar UI punya variasi */
export function classifySegmentDummy(seg: Segment): SegDiagnosis {
  const v = seg.samples;
  // fitur sederhana
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  const variance = v.reduce((s, x) => s + (x - mean) ** 2, 0) / v.length;
  const sd = Math.sqrt(variance);
  const maxAbs = v.reduce((m, x) => Math.max(m, Math.abs(x)), 0);

  // aturan dummy supaya ada sebaran kelas
  let label: ClassLabel = "N";
  if (maxAbs > 1.2 && sd > 0.5) label = "R";        // spike kuat → R
  else if (sd > 0.35) label = "V";                  // variabilitas tinggi → V
  else if (mean > 0.15) label = "L";                // baseline agak naik → L
  else if (mean < -0.15) label = "Q";               // baseline turun → Q
  // else N

  const confidence = Math.max(0.4, Math.min(0.95, 0.6 + sd / 2));
  return { label, confidence: Math.round(confidence * 100) / 100 };
}

/** Buat ringkasan count & persen dari daftar label */
export function summarize(labels: Arr<ClassLabel>): Summary {
  const counts: Record<ClassLabel, number> = { L: 0, N: 0, Q: 0, R: 0, V: 0 };
  for (const lb of labels) counts[lb] += 1;
  const total = labels.length || 1;
  const percentages = {
    L: +(counts.L * 100 / total).toFixed(1),
    N: +(counts.N * 100 / total).toFixed(1),
    Q: +(counts.Q * 100 / total).toFixed(1),
    R: +(counts.R * 100 / total).toFixed(1),
    V: +(counts.V * 100 / total).toFixed(1),
  };
  return { totalSegments: labels.length, counts, percentages };
}
