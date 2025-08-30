import Link from "next/link";
import { Heart } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" strokeWidth={2.5} />
          <span className="text-lg font-semibold text-foreground">HeartCheck</span>
        </Link>

        {/* Nav */}
        <nav className="text-sm font-medium text-muted-foreground">
          Deteksi Penyakit Jantung Real-time
        </nav>
      </div>
    </header>
  );
}
