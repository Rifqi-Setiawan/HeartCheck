"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

export type ModelId = "bert" | "mae" | "conformer";

const OPTIONS: Array<{ value: ModelId; label: string; hint: string }> = [
  { value: "bert", label: "Bert", hint: "" },
  { value: "conformer", label: "Conformer", hint: "" },
  { value: "mae", label: "MAE", hint: "" },
];

type Props = {
  value: ModelId;
  onChange: (m: ModelId) => void;
  disabled?: boolean;
  className?: string;
};

export default function ModelSelect({ value, onChange, disabled, className = "" }: Props) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // close kalau klik di luar
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = OPTIONS.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <label className="block mb-1 text-sm text-muted-foreground">Model:</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-64 items-center justify-between rounded-md border bg-white 
                    px-3 py-2 text-sm font-medium shadow-sm transition
                    ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary"}`}
      >
        <span>{current?.label}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <ul
          className="absolute z-10 mt-1 w-64 overflow-hidden rounded-md border border-border/50 bg-white 
                     shadow-lg animate-in fade-in slide-in-from-top-1"
        >
          {OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm transition 
                           ${o.value === value ? "bg-primary/10 font-semibold text-primary" : "hover:bg-slate-50"}`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {current?.hint && (
        <p className="mt-1 text-xs text-muted-foreground">{current.hint}</p>
      )}
    </div>
  );
}
