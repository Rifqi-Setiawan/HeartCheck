import Papa, { ParseResult } from "papaparse";

/** Satu sampel ECG: t = index sample, v = amplitudo */
export type ECGSample = { t: number; v: number };

type Row = Record<string, unknown>;

function toNum(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Deteksi & parse beberapa kemungkinan format ECG */
export function parseECGFromCSVText(text: string): ECGSample[] {
  // 1) Coba CSV header
  const parsed: ParseResult<Row> = Papa.parse<Row>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  // Kasus A: satu kolom "ECG" berisi string angka dipisah '-' dalam SATU baris
  const oneRowECG = parsed.data.find((r) => typeof r?.["ECG"] === "string");
  if (oneRowECG && typeof oneRowECG["ECG"] === "string") {
    const values = (oneRowECG["ECG"] as string)
      .split("-")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));
    return values.map((v, i) => ({ t: i, v }));
  }

  // Kasus B: kolom "ECG" banyak baris angka
  if (parsed.data.length && "ECG" in (parsed.data[0] ?? {})) {
    const vs: number[] = parsed.data
      .map((r) => toNum(r["ECG"]))
      .filter((n): n is number => n !== null);
    if (vs.length) return vs.map((v, i) => ({ t: i, v }));
  }

  // Kasus C: pasangan time/value → cari pasangan kolom umum
  const candidatesTime = ["time", "t", "timestamp", "x"];
  const candidatesVal = ["bpm", "hr", "value", "y", "ecg", "signal"];
  const keys = parsed.meta.fields ?? [];
  const timeKey = keys.find((k) => candidatesTime.includes(k.toLowerCase()));
  const valKey = keys.find((k) => candidatesVal.includes(k.toLowerCase()));
  if (timeKey && valKey) {
    const out: ECGSample[] = [];
    for (const r of parsed.data) {
      const t = toNum(r[timeKey]);
      const v = toNum(r[valKey]);
      if (t !== null && v !== null) out.push({ t, v });
    }
    if (out.length) return out;
  }

  // Kasus D: tanpa header → coba split baris/komma → ambil angka per baris
  const rows = text
    .trim()
    .split(/\r?\n/)
    .map((ln) => ln.split(/[,\s;]+/).filter(Boolean));
  if (rows.length) {
    const vs: number[] = [];
    for (const r of rows) {
      const n = Number(r[0]);
      if (Number.isFinite(n)) vs.push(n);
    }
    if (vs.length) return vs.map((v, i) => ({ t: i, v }));
  }

  // fallback: kosong
  return [];
}

/** Parse dari File (input upload) */
export function loadECGFromFile(file: File): Promise<ECGSample[]> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(fr.error);
    fr.onload = () => {
      try {
        const text = String(fr.result ?? "");
        const data = parseECGFromCSVText(text);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    };
    fr.readAsText(file);
  });
}
