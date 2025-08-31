import type { ECGSample } from "@/lib/loadCsv";

export type DummyLabel = "Normal" | "At-Risk" | "High-Risk";
export type DummyResult = { label: DummyLabel; hr: number; confidence: number };

/**
 * Dummy diagnosis:
 * - Estimasi HR kasar dari jumlah puncak sederhana
 * - Aturan label: Normal (60–100), At-Risk (<60 atau >100), High-Risk (<45 atau >130)
 * - Confidence dummy dari “kestabilan” interval puncak
 */
export function diagnoseDummy(samples: ECGSample[], sr = 250): DummyResult {
  if (samples.length === 0) return { label: "Normal", hr: 0, confidence: 0.5 };

  // ambil amplitudo
  const v = samples.map((s) => s.v);

  // threshold adaptif
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  const sd = Math.sqrt(v.reduce((s, x) => s + (x - mean) ** 2, 0) / v.length);
  const thr = Math.max(0.4 * sd, 0.2);

  // deteksi puncak lokal sederhana (+ refractory 240 ms)
  const minDist = Math.max(1, Math.round(0.24 * sr));
  const peaks: number[] = [];
  let last = -minDist;

  for (let i = 1; i < v.length - 1; i++) {
    if (i - last < minDist) continue;
    if (v[i] > thr && v[i] > v[i - 1] && v[i] > v[i + 1]) {
      peaks.push(i);
      last = i;
    }
  }

  const durationSec = v.length / sr;
  const hr = Math.max(0, Math.round((peaks.length / Math.max(durationSec, 1e-6)) * 60));

  // label rule-of-thumb
  let label: DummyLabel = "Normal";
  if (hr < 60 || hr > 100) label = "At-Risk";
  if (hr < 45 || hr > 130) label = "High-Risk";

  // confidence dummy dari koefisien variasi interval
  let confidence = 0.6;
  if (peaks.length >= 2) {
    const ints = peaks.slice(1).map((p, i) => p - peaks[i]);
    const m = ints.reduce((a, b) => a + b, 0) / ints.length;
    const s = Math.sqrt(ints.reduce((S, x) => S + (x - m) ** 2, 0) / ints.length);
    const cv = s / (m || 1);
    confidence = Math.max(0.3, Math.min(0.95, 0.95 - cv));
  }

  return { label, hr, confidence: Math.round(confidence * 100) / 100 };
}

export function recommendationsDummy(label: DummyLabel): string[] {
  if (label === "Normal")
    return [
      "Pertahankan gaya hidup sehat",
      "Olahraga aerobik ringan 30 menit/hari",
      "Konsumsi makanan bergizi seimbang",
      "Cukup tidur 7–8 jam",
    ];
  if (label === "At-Risk")
    return [
      "Kurangi kafein & rokok",
      "Kelola stres (meditasi/relaksasi)",
      "Pantau gejala: pusing, nyeri dada, sesak",
      "Konsultasi bila keluhan berlanjut",
    ];
  return [
    "Hentikan aktivitas berat",
    "Periksa segera ke fasilitas kesehatan",
    "Bawa riwayat medis & obat yang dikonsumsi",
    "Ikuti instruksi tenaga kesehatan",
  ];
}
