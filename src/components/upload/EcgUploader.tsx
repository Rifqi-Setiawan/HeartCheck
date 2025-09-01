"use client";

import * as React from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Upload } from "lucide-react";

type Props = {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
};

export default function EcgUploader({ onFileSelected, disabled }: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = React.useState<string>("");

  return (
    <Card className="rounded-xl">
      <div className="flex flex-col items-center gap-3 text-center">
        <Upload className="h-8 w-8 text-primary" />
        <div>
          <h3 className="text-base font-semibold text-foreground">Upload File ECG</h3>
          <p className="text-sm text-muted-foreground">
            Format: <b>.csv</b> satu kolom angka (nilai sinyal). File lain akan ditolak.
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.txt"
          className="hidden"
          onChange={(e) => {
            const f = e.currentTarget.files?.[0];
            if (f) {
              setFileName(f.name);
              onFileSelected(f);
            }
          }}
        />
        <div className="flex items-center gap-3">
          <Button onClick={() => inputRef.current?.click()} disabled={disabled} className="min-w-44">
            Pilih File
          </Button>
          {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
        </div>
      </div>
    </Card>
  );
}
