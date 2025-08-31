"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import type { ECGSample } from "@/lib/loadCsv";
import { Stethoscope } from "lucide-react";
import ModelSelect, { type ModelId } from "@/components/diagnosis/ModelSelect";
import DiagnosisSummary from "@/components/diagnosis/DiagnosisSummary";
import { segmentECG, classifySegmentDummy, summarize, type ClassLabel } from "@/lib/diagnosiSegments";
import { predictBatchFromCsv, type PredictSummary } from "@/lib/api";

type Props = {
  samples?: ECGSample[];
  originalFile?: File;   // ← CSV asli untuk dikirim ke backend
  sr?: number;
  windowSec?: number;
};

export default function DiagnosisPanel({ samples, originalFile, sr = 250, windowSec = 0.7 }: Props) {
  const [running, setRunning] = useState(false);
  const [model, setModel] = useState<ModelId>("conformer");
  const [remoteSum, setRemoteSum] = useState<PredictSummary | null>(null);
  const [localLabels, setLocalLabels] = useState<ClassLabel[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onDiagnose() {
    if (!samples?.length) return;
    setRunning(true);
    setError(null);
    setRemoteSum(null);
    setLocalLabels(null);

    try {
      if (originalFile) {
        // Mode backend: CSV → NPY → segment (0.7s) → model → summary
        const out = await predictBatchFromCsv(originalFile, sr, windowSec);
        setRemoteSum(out);
      } else {
        // Fallback lokal (dummy): segmentasi + klasifikasi dummy → summary
        const segs = segmentECG(samples, sr, windowSec);
        const labels = segs.map(s => classifySegmentDummy(s).label);
        setLocalLabels(labels);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setRunning(false);
    }
  }

  const disabled = !samples?.length || running;

  const summaryView = (() => {
    if (remoteSum) return <DiagnosisSummary summary={{
      totalSegments: remoteSum.total_segments,
      counts: remoteSum.counts,
      percentages: {
        L: +(remoteSum.counts.L * 100 / remoteSum.total_segments).toFixed(1),
        N: +(remoteSum.counts.N * 100 / remoteSum.total_segments).toFixed(1),
        Q: +(remoteSum.counts.Q * 100 / remoteSum.total_segments).toFixed(1),
        R: +(remoteSum.counts.R * 100 / remoteSum.total_segments).toFixed(1),
        V: +(remoteSum.counts.V * 100 / remoteSum.total_segments).toFixed(1),
      },
    }} className="md:col-span-2" />;
    if (localLabels) return <DiagnosisSummary summary={summarize(localLabels)} className="md:col-span-2" />;
    return null;
  })();

  return (
    <Card className="rounded-xl">
      {!remoteSum && !localLabels ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Stethoscope className="h-8 w-8 text-primary" />
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">Diagnosis Kondisi</h3>
            <p className="text-sm text-muted-foreground">
              Sistem akan mengubah CSV → NPY, memotong 0,7 detik/segmen, lalu mengklasifikasikan (L, N, Q, R, V).
            </p>
            <ModelSelect value={model} onChange={setModel} disabled={running} />
          </div>
          <Button onClick={onDiagnose} className="min-w-48" disabled={disabled}>
            {running ? (<><Spinner className="mr-2" />Memproses…</>) : "Diagnosis"}
          </Button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {summaryView}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h4 className="mb-2 text-base font-semibold text-foreground">Pengaturan</h4>
            <div className="flex flex-wrap items-center gap-3">
              <ModelSelect value={model} onChange={setModel} />
              <Button variant="outline" onClick={() => { setRemoteSum(null); setLocalLabels(null); }}>
                Diagnosis Ulang
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Window: {windowSec}s · Sampling: {sr} Hz · Total sampel: {samples?.length ?? 0}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
