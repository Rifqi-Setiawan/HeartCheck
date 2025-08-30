// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import Header from "@/components/header/Header";

export const metadata: Metadata = {
  title: "HeartCheck",
  description: "Deteksi Penyakit Jantung Real-time",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f18" },
  ],
};

// Bind font ke CSS variables yg kamu pakai di globals.css
const geistSans = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "font-sans antialiased bg-background text-foreground",
          // layout dasar
          "min-h-dvh flex flex-col",
        ].join(" ")}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          Loncat ke konten utama
        </a>

        {/* Top App Bar */}
        <Header />

        {/* Konten utama */}
        <main id="main" className="flex-1">
          {children}
        </main>

        {/* Footer opsional */}
        {/* <footer className="border-t border-border/80 bg-card">
          <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground">
            © {new Date().getFullYear()} HeartCheck
          </div>
        </footer> */}
      </body>
    </html>
  );
}
