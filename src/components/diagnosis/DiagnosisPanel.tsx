"use client";

import * as React from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import EcgUploader from "@/components/upload/EcgUploader";
import ModelSelect, { type ModelId } from "./ModelSelect";
import DiagnosisSummary from "./DiagnosisSummary";
import { postDiagnoseECG } from "@/lib/api";
import type { Label } from "@/lib/diagnosis";

export default function DiagnosisPanel() {
  const [file, setFile] = React.useState<File | null>(null);
  const [model, setModel] = React.useState<ModelId>("bert");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [result, setResult] = React.useState<{
    total_segments: number;
    counts: Record<Label, number>;
  } | null>(null);

  async function handleRun() {
    if (!file) {
      setError("Silakan pilih file CSV terlebih dahulu.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const form = new FormData();
      form.append("model_id", model);
      form.append("file", file, file.name);

      const data = await postDiagnoseECG(form);
      setResult(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Terjadi kesalahan.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ModelSelect value={model} onChange={setModel} disabled={isLoading} />
          <div className="flex items-center gap-3">
            <Button onClick={handleRun} disabled={!file || isLoading}>
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner /> Menganalisis…
                </span>
              ) : (
                "Diagnosis"
              )}
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <EcgUploader onFileSelected={setFile} disabled={isLoading} />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </Card>

      {result && (
        <DiagnosisSummary
          total={result.total_segments}
          counts={result.counts}
          fileName={file?.name}
          model={model.toUpperCase()} 
        />
      )}
    </div>
  );
}
