import type { ECGSample } from "@/lib/loadCsv";
import { preprocessECG } from "@/lib/utils";

/** Hasil klasifikasi dummy */
export type Diagnosis =
  | { label: "Normal"; hr: number; confidence: number }
  | { label: "At-Risk"; hr: number; confidence: number }
  | { label: "High-Risk"; hr: number; confidence: number };

export type DiagnoseOptions = {
  sr?: number;            // sampling rate (Hz)
  thresholdMv?: number;   // ambang puncak (R-peak) sederhana
  minPeakDistanceMs?: number; // jarak minimal antar puncak (ms)
};

/** Deteksi puncak sederhana + estimasi HR dari waveform (mock untuk demo UI) */
export function diagnoseFromECG(
  raw: ECGSample[],
  opts: DiagnoseOptions = {}
): Diagnosis {
  const sr = opts.sr ?? 250;
  const thr = opts.thresholdMv ?? 0.6;          // ambang ~0.6 mV
  const minDist = Math.max(1, Math.round(((opts.minPeakDistanceMs ?? 240) / 1000) * sr)); // ~240ms

  // Preprocess agar stabil (sama seperti monitor)
  const values = raw.map((d) => d.v);
  const v = preprocessECG(values, { clampLowerPct: 0.5, clampUpperPct: 99.5, smoothKernel: 3, targetRangeMv: 1.5 });

  // Peak detection sangat sederhana (cukup untuk demo UI)
  const peaksIdx: number[] = [];
  let lastIdx = -minDist;
  for (let i = 1; i < v.length - 1; i++) {
    if (i - lastIdx < minDist) continue;
    // local maxima di atas threshold
    if (v[i] > thr && v[i] > v[i - 1] && v[i] > v[i + 1]) {
      peaksIdx.push(i);
      lastIdx = i;
    }
  }

  const durationSec = v.length / sr;
  const peaksPerSec = durationSec > 0 ? peaksIdx.length / durationSec : 0;
  const hr = Math.round(peaksPerSec * 60); // BPM

  // Rule-of-thumb klasifikasi
  let diag: Diagnosis["label"] = "Normal";
  if (hr < 60 || hr > 100) diag = "At-Risk";
  if (hr < 45 || hr > 130) diag = "High-Risk";

  // confidence dummy dari “konsistensi” interval
  let confidence = 0.7;
  if (peaksIdx.length >= 2) {
    const intervals = peaksIdx.slice(1).map((p, i) => p - peaksIdx[i]);
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const sd = Math.sqrt(intervals.reduce((s, x) => s + (x - mean) ** 2, 0) / intervals.length);
    const cv = sd / (mean || 1);
    confidence = Math.max(0.3, Math.min(0.95, 0.95 - cv)); // makin stabil → makin yakin
  }

  return { label: diag, hr, confidence: Math.round(confidence * 100) / 100 };
}

export function recommendationsFor(label: Diagnosis["label"]): string[] {
  if (label === "Normal") {
    return [
      "Pertahankan pola hidup sehat",
      "Olahraga aerobik ringan 30 menit/hari",
      "Pola makan bergizi seimbang",
      "Cukup tidur 7–8 jam",
    ];
  }
  if (label === "At-Risk") {
    return [
      "Kurangi kafein & rokok",
      "Kelola stres (relaksasi/meditasi)",
      "Pantau gejala: pusing, nyeri dada, sesak",
      "Konsultasi bila keluhan berlanjut",
    ];
  }
  return [
    "Hentikan aktivitas berat",
    "Periksa segera ke fasilitas kesehatan",
    "Bawa riwayat medis & obat yang dikonsumsi",
    "Ikuti instruksi dokter",
  ];
}
