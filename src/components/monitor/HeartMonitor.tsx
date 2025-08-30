"use client";

import { useState, useEffect } from "react";
import { Play, Square } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function HeartMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [bpm, setBpm] = useState(0);

  // Demo: simulasi data BPM saat monitoring
  useEffect(() => {
    if (!isMonitoring) return;
    const id = setInterval(() => {
      // angka acak 60–100 (normal) utk preview
      const next = Math.floor(60 + Math.random() * 40);
      setBpm(next);
    }, 900);
    return () => clearInterval(id);
  }, [isMonitoring]);

  return (
    <Card
      className="rounded-xl"
      header={
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">
            <span className="mr-2 text-primary">∿</span>
            Monitor Detak Jantung
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Klik tombol di bawah untuk memulai pemeriksaan detak jantung
          </p>
        </div>
      }
    >
      <div className="space-y-6 text-center">
        <div className="text-5xl font-bold leading-none">
          <span className="text-primary">{bpm}</span>{" "}
          <span className="text-muted-foreground text-2xl align-top">BPM</span>
        </div>

        <div className="flex justify-center">
          {isMonitoring ? (
            <Button
              onClick={() => setIsMonitoring(false)}
              variant="outline"
              className="min-w-44"
            >
              <Square className="h-4 w-4" />
              Berhenti
            </Button>
          ) : (
            <Button
              onClick={() => setIsMonitoring(true)}
              className="min-w-44"
            >
              <Play className="h-4 w-4" />
              Mulai Monitoring
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
