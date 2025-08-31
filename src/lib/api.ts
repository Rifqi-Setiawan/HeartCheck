export type SummaryCounts = { L: number; N: number; Q: number; R: number; V: number };
export type PredictSummary = { total_segments: number; counts: SummaryCounts };

const API_BASE = process.env.NEXT_PUBLIC_AI_API ?? "http://localhost:5000";

/** Kirim file CSV ke backend untuk di-convert NPY → segment → infer → summary */
export async function predictBatchFromCsv(
  file: File,
  sr: number,
  windowSec: number
): Promise<PredictSummary> {
  const fd = new FormData();
  fd.append("file", file, file.name);
  fd.append("sr", String(sr));
  fd.append("window_sec", String(windowSec));

  const res = await fetch(`${API_BASE}/predict-ecg-batch`, { method: "POST", body: fd });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Gagal prediksi (HTTP ${res.status}) ${txt}`);
  }
  return (await res.json()) as PredictSummary;
}
