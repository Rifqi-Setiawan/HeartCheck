"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { loadECGFromFile, type ECGSample } from "@/lib/loadCsv";
import { Upload } from "lucide-react";

type Props = {
  onLoaded: (samples: ECGSample[], file: File) => void; // ← kirim File asli
};

export default function EcgUploader({ onLoaded }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const file = files[0];
    setFileName(file.name);
    try {
      const samples = await loadECGFromFile(file);
      if (samples.length === 0) {
        setError("Tidak berhasil membaca data ECG dari file ini. Pastikan formatnya benar.");
        return;
      }
      onLoaded(samples, file); // ← kirim file ke parent
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Gagal memuat file: ${msg}`);
    }
  }

  return (
    <Card className="rounded-xl">
      <div className="flex flex-col items-center gap-3 text-center">
        <Upload className="h-8 w-8 text-primary" />
        <div>
          <h3 className="text-base font-semibold text-foreground">Upload File ECG</h3>
          <p className="text-sm text-muted-foreground">
            Unggah berkas <b>.csv</b> / <b>.txt</b> berisi sinyal ECG. Format didukung: satu kolom
            <code> ECG </code>(baris per nilai) atau satu baris <code>ECG</code> berisi angka dipisah
            tanda hubung (<code>8-7-38-...</code>).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.txt"
            className="hidden"
            onChange={(e) => handleFiles(e.currentTarget.files)}
          />
          <Button onClick={() => inputRef.current?.click()} className="min-w-44">
            Pilih File
          </Button>
          {fileName ? <span className="text-sm text-muted-foreground">{fileName}</span> : null}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </Card>
  );
}
