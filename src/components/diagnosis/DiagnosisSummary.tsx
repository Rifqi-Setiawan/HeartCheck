// components/diagnosis/DiagnosisSummary.tsx
import React from "react";

interface DiagnosisSummaryProps {
  counts: { L: number; N: number; Q: number; R: number; V: number };
  total: number;
  fileName?: string;              // ← make optional
  model: string;                  // ← keep prop name "model"
}

export default function DiagnosisSummary({
  counts,
  total,
  fileName,
  model,
}: DiagnosisSummaryProps) {
  const percent = (v: number) => (total > 0 ? ((v / total) * 100).toFixed(1) : "0.0");
  const items = [
    { key: "L", value: counts.L },
    { key: "N", value: counts.N },
    { key: "Q", value: counts.Q },
    { key: "R", value: counts.R },
    { key: "V", value: counts.V },
  ];

  return (
    <div className="bg-blue-50 p-4 rounded-2xl shadow-sm">
      <div className="flex justify-between mb-2">
        <h2 className="font-semibold text-gray-800">Hasil Prediksi</h2>
        <span className="text-sm text-gray-600">
          File: {fileName ?? "—"} · Model: {model}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {items.map(({ key, value }) => (
          <div key={key} className="bg-white rounded-xl p-4 flex flex-col items-center shadow">
            <span className="text-sm text-gray-500">{key}</span>
            <span className="text-2xl font-bold text-blue-600">{value}</span>
            <span className="text-sm text-gray-700 font-medium">{percent(value)}%</span>
          </div>
        ))}
      </div>

      <div className="mt-3 text-sm text-gray-700">
        Total anotasi: <span className="font-semibold">{total}</span>
      </div>
    </div>
  );
}
