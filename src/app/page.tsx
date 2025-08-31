"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import EcgUploader from "@/components/upload/EcgUploader";
import DiagnosisPanel from "@/components/diagnosis/DiagnosisPanel";
import type { ECGSample } from "@/lib/loadCsv";

export default function Page() {
  const [samples, setSamples] = useState<ECGSample[]>();
  const [file, setFile] = useState<File | undefined>(undefined);

  return (
    <Container className="py-8 space-y-6">
      <EcgUploader onLoaded={(data, f) => { setSamples(data); setFile(f); }} />
      <DiagnosisPanel samples={samples} originalFile={file} />
    </Container>
  );
}
