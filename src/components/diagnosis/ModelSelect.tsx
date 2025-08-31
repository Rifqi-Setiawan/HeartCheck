"use client";

import * as React from "react";
import { Cpu} from "lucide-react";

export type ModelId = "bert" | "conformer" | "transformer";

type Props = {
  value: ModelId;
  onChange: (m: ModelId) => void;
  className?: string;
  disabled?: boolean;
};

// Tipe aman untuk ikon lucide (React SVG component)
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const MODELS: { id: ModelId; label: string; subtitle: string; Icon: IconType }[] = [
  { id: "bert",        label: "BERT",        subtitle: "ECG", Icon: Cpu },
  { id: "conformer",   label: "Conformer",   subtitle: "ECG",  Icon: Cpu },
  { id: "transformer", label: "MAE", subtitle: "ECG",  Icon: Cpu },
];

export default function ModelSelect({ value, onChange, className = "", disabled }: Props) {
  return (
    <div className={["w-full", className].join(" ")}>
      <label className="mb-2 block text-sm font-medium text-foreground/90">Model</label>

      {/* Segmented control (desktop/tablet) */}
      <div role="tablist" aria-label="Pilih model diagnosis" className="hidden md:grid grid-cols-3 gap-2">
        {MODELS.map(({ id, label, subtitle, Icon }) => {
          const active = id === value;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={active}
              onClick={() => !disabled && onChange(id)}
              disabled={disabled}
              className={[
                "group flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 transition",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                active
                  ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                  : "border-border/60 bg-background hover:bg-muted",
                disabled && "opacity-60 cursor-not-allowed",
              ].join(" ")}
            >
              <Icon className={["h-4 w-4", active ? "opacity-90" : "text-primary"].join(" ")} />
              <span className="text-sm font-semibold">{label}</span>
              <span
                className={[
                  "rounded-md px-1.5 py-0.5 text-[11px]",
                  active ? "bg-primary-foreground/15" : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile fallback */}
      <div className="md:hidden">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as ModelId)}
          disabled={disabled}
          className={[
            "w-full rounded-xl border border-border/60 bg-background px-3 py-2.5 text-sm",
            "shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
            disabled && "opacity-60 cursor-not-allowed",
          ].join(" ")}
        >
          {MODELS.map(({ id, label, subtitle }) => (
            <option key={id} value={id}>
              {label} ({subtitle})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
