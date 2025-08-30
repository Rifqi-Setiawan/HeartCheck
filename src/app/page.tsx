import Container from "@/components/ui/Container";
import HeartMonitor from "@/components/monitor/HeartMonitor";
import DiagnosisPanel from "@/components/diagnosis/DiagnosisPanel";

export default function Page() {
  return (
    <Container className="py-8 space-y-6">
      <HeartMonitor />
      {/* 🔽 tombol Diagnosis → tampilkan hasil & rekomendasi setelah ditekan */}
      <DiagnosisPanel csvPath="/data/ecg_data_0.csv" sr={250} />
    </Container>
  );
}
