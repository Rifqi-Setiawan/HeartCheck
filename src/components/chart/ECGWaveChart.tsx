"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import type { ECGSample } from "@/lib/loadCsv";

type Props = {
  data: ECGSample[];
  className?: string;
  title?: string;
  yMaxMv?: number;  // set domain Y tetap, ex: 1.5 → [-1.5, 1.5]
  sr?: number;      // sampling rate (Hz) untuk label X (detik)
  windowSize?: number; // jumlah sampel yang ditampilkan di layar (ex: 1000)
};

export default function ECGWaveChart({
  data, className = "", title,
  yMaxMv = 1.5, sr = 250, windowSize = 1000,
}: Props) {
  // tampilkan hanya window terakhir agar 'scrolling'
  const view = data.length > windowSize ? data.slice(data.length - windowSize) : data;

  return (
    <div className={["rounded-xl border border-border/60 bg-card p-5 shadow-sm", className].join(" ")}>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-foreground">
          {title ?? "Sinyal Detak Jantung Real-time (Waveform ECG)"}
        </h3>
        <p className="text-sm text-muted-foreground">
          Gelombang ECG, sumbu-X dalam detik (sampling {sr} Hz), sumbu-Y dalam mV (distorsi/normalisasi ringan untuk keterbacaan)
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={view} margin={{ top: 8, right: 16, bottom: 8, left: 6 }}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis
              dataKey="t"
              tick={{ fontSize: 12 }}
              tickMargin={6}
              // ubah tick jadi detik (t/sr)
              tickFormatter={(t) => (Number(t) / sr).toFixed(1)}
              label={{ value: "Time (s)", position: "insideBottomRight", offset: -4 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickMargin={6}
              domain={[-yMaxMv, yMaxMv]}      // domain tetap → stabil tidak ikut spike
              label={{ value: "Amplitude (mV)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              formatter={(v: number | string) => [`${v} mV`, "Amplitude"]}
              labelFormatter={(l: number | string) => `t=${(Number(l)/sr).toFixed(3)} s`}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
