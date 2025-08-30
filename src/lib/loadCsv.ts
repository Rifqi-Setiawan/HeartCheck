import Papa, { ParseResult } from "papaparse";
export type ECGSample = { t: number; v: number };
type Row = { ECG?: string | null };

export async function loadECGWaveCsv(path: string): Promise<ECGSample[]> {
  const res = await fetch(path, { cache: "no-store" });
  const text = await res.text();

  const parsed: ParseResult<Row> = Papa.parse<Row>(text, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = parsed.data.filter((r) => r && typeof r.ECG === "string" && r.ECG.trim() !== "");
  if (rows.length === 0) return [];

  const ecgString = rows[0].ECG as string;
  const values = ecgString
    .split("-")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n));

  // waktu = index sample
  return values.map((v, i) => ({ t: i, v }));
}
