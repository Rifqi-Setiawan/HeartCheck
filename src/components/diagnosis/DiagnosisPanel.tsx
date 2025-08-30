"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { loadECGWaveCsv, type ECGSample } from "@/lib/loadCsv";
import { diagnoseFromECG, recommendationsFor, type Diagnosis } from "@/lib/diagnosis";
import { Stethoscope } from "lucide-react";

type Props = {
  csvPath?: string; // default "/data/ecg_data_0.csv"
  sr?: number;      // sampling rate untuk diagnosis (default 250)
};

export default function DiagnosisPanel({ csvPath = "/data/ecg_data_0.csv", sr = 250 }: Props) {
  const [signal, setSignal] = useState<ECGSample[]>([]);
  const [loading, setLoading] = useState(true);

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Diagnosis | null>(null);

  useEffect(() => {
    loadECGWaveCsv(csvPath)
      .then(setSignal)
      .finally(() => setLoading(false));
  }, [csvPath]);

  async function onDiagnose() {
    setRunning(true);
    setResult(null);

    // 👉 nanti ganti ini dengan fetch ke Flask/AI:
    // const res = await fetch("/api/diagnose", { method:"POST", body: JSON.stringify({ samples: signal, sr }) })
    // const out = await res.json()

    // Mock synchronous (pakai heuristic)
    const out = diagnoseFromECG(signal, { sr });
    await new Promise((r) => setTimeout(r, 600)); // kasih UX feel

    setResult(out);
    setRunning(false);
  }

  return (
    <Card className="rounded-xl">
      {!result ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Stethoscope className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-base font-semibold text-foreground">Diagnosis Kondisi</h3>
            <p className="text-sm text-muted-foreground">
              Tekan tombol di bawah untuk mengirim sinyal ECG ke model & melihat klasifikasinya.
            </p>
          </div>

          <Button
            onClick={onDiagnose}
            className="min-w-48"
            disabled={loading || signal.length === 0 || running}
            title={loading ? "Memuat data..." : undefined}
          >
            {running ? "Menganalisis..." : "Diagnosis"}
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Hasil Prediksi */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h4 className="mb-3 text-base font-semibold text-foreground">Hasil Prediksi</h4>

            <span
              className={[
                "inline-flex w-fit items-center rounded-md px-3 py-1 text-sm font-semibold",
                result.label === "Normal" && "bg-green-100 text-green-700",
                result.label === "At-Risk" && "bg-yellow-100 text-yellow-800",
                result.label === "High-Risk" && "bg-red-100 text-red-700",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {result.label}
            </span>

            <div className="mt-3 text-sm">
              <p>
                <b className="text-foreground">Estimasi Detak:</b>{" "}
                <span className="text-foreground">{result.hr} BPM</span>
              </p>
              <p className="text-muted-foreground">
                Keyakinan model: {Math.round(result.confidence * 100)}%
              </p>
            </div>
          </div>

          {/* Rekomendasi */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h4 className="mb-3 text-base font-semibold text-foreground">Rekomendasi</h4>
            <p className="text-sm text-muted-foreground">
              Langkah yang disarankan berdasarkan hasil pemeriksaan
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground">
              {recommendationsFor(result.label).map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>

            <div className="mt-4">
              <Button variant="outline" onClick={() => setResult(null)}>
                Diagnosis Ulang
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
