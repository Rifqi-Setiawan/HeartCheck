"use client";

import * as React from "react";
import type { Summary, ClassLabel } from "@/lib/diagnosiSegments";

type Props = {
  title?: string;                // default: "Annotator: atr"
  summary: Summary;
  className?: string;
};

/** Urutan tampilan kelas: L N Q R V */
const ORDER: ClassLabel[] = ["L", "N", "Q", "R", "V"];

export default function DiagnosisSummary({ title = "Annotator: atr", summary, className = "" }: Props) {
  return (
    <div className={["rounded-xl border border-border/60 bg-card p-5 shadow-sm", className].join(" ")}>
      <div className="mb-3 flex items-baseline justify-between">
        <h4 className="text-base font-semibold text-foreground">{title}</h4>
        <span className="text-sm text-muted-foreground">
          ({summary.totalSegments} annotations)
        </span>
      </div>

      <ul className="divide-y divide-border/60">
        {ORDER.map((k) => (
          <li key={k} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-semibold">
                {k}
              </span>
              <span className="text-sm text-foreground">{labelName(k)}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="tabular-nums text-sm font-semibold text-foreground">
                {summary.counts[k]}
              </span>
              <span className="text-xs text-muted-foreground">{summary.percentages[k]}%</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function labelName(k: ClassLabel): string {
  switch (k) {
    case "L": return "Left bundle branch";
    case "N": return "Normal";
    case "Q": return "Escaped/QRS variant";
    case "R": return "Right bundle branch";
    case "V": return "Ventricular ectopic";
  }
}
