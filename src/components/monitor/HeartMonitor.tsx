"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Square } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ECGWaveChart from "@/components/chart/ECGWaveChart";
import { loadECGWaveCsv, type ECGSample } from "@/lib/loadCsv";
import { preprocessECG } from "@/lib/utils";

export default function HeartMonitor() {
  // parameter klinis tampilan
  const SR = 250;          // sampling rate asumsi (Hz)
  const WINDOW = 1000;     // tampilkan ~4 detik (1000/250)
  const CHUNK = 4;         // berapa sample per frame (agar ~60 fps → 4 sampel @ 250Hz)

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sourceData, setSourceData] = useState<ECGSample[]>([]);
  const [displayData, setDisplayData] = useState<ECGSample[]>([]);

  const idxRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentAmp = useMemo(
    () => (displayData.length ? displayData[displayData.length - 1].v : 0),
    [displayData]
  );

  // Load dan preprocess sekali
  useEffect(() => {
    const CSV_PATH = "/data/ecg_data_0.csv";
    loadECGWaveCsv(CSV_PATH)
      .then((raw) => {
        const values = raw.map(d => d.v);
        const p = preprocessECG(values, { clampLowerPct: 0.5, clampUpperPct: 99.5, smoothKernel: 3, targetRangeMv: 1.5 });
        const prepped: ECGSample[] = p.map((v, i) => ({ t: i, v }));
        setSourceData(prepped);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Start/stop streaming seperti monitor klinis
  useEffect(() => {
    if (!isMonitoring) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    setDisplayData([]);
    idxRef.current = 0;

    // ~60 fps → 1000ms/60 ≈ 16ms. Tiap frame push CHUNK sampel
    const FRAME_MS = 1000 / 60;

    timerRef.current = setInterval(() => {
      if (idxRef.current >= sourceData.length) {
        // ulangi dari awal agar looping kontinu
        idxRef.current = 0;
      }

      setDisplayData((prev) => {
        const next: ECGSample[] = [];
        for (let k = 0; k < CHUNK; k++) {
          if (idxRef.current >= sourceData.length) break;
          next.push(sourceData[idxRef.current++]);
        }
        const combined = prev.concat(next);
        return combined.length > WINDOW ? combined.slice(combined.length - WINDOW) : combined;
      });
    }, FRAME_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [isMonitoring, sourceData]);

  return (
    <>
      <Card
        className="rounded-xl"
        header={
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              <span className="mr-2 text-primary">∿</span>
              Monitor Detak Jantung
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Waveform ECG real-time (tampilan klinis). Tekan tombol untuk mulai/berhenti.
            </p>
          </div>
        }
      >
        <div className="space-y-6 text-center">
          <div className="text-5xl font-bold leading-none">
            <span className="text-primary">{currentAmp.toFixed(2)}</span>{" "}
            <span className="align-top text-2xl text-muted-foreground">mV</span>
          </div>

          <div className="flex justify-center">
            {isMonitoring ? (
              <Button onClick={() => setIsMonitoring(false)} variant="outline" className="min-w-56">
                <Square className="h-4 w-4" />
                Hentikan Monitoring
              </Button>
            ) : (
              <Button
                onClick={() => setIsMonitoring(true)}
                className="min-w-56"
                disabled={isLoading || sourceData.length === 0}
                title={isLoading ? "Memuat data..." : undefined}
              >
                <Play className="h-4 w-4" />
                Mulai Monitoring
              </Button>
            )}
          </div>
        </div>
      </Card>

      <ECGWaveChart
        data={displayData}
        className="mt-6"
        yMaxMv={1.5}      
        sr={SR}          
        windowSize={WINDOW}
      />
    </>
  );
}
