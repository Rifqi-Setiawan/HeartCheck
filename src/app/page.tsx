import Container from "@/components/ui/Container";
import HeartMonitor from "@/components/monitor/HeartMonitor";
import Alert from "@/components/ui/Alert";

export default function Page() {
  return (
    <>
      <Container className="py-8 space-y-6">
        <HeartMonitor />

        <Alert title="Disclaimer Medis" variant="warning">
          Aplikasi ini hanya untuk tujuan edukasi dan tidak menggantikan konsultasi medis profesional.
          Selalu konsultasikan kondisi kesehatan Anda dengan dokter yang berkualifikasi.
        </Alert>
      </Container>
    </>
  );
}
