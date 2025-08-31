"use client";
export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={["inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent", className].join(" ")} />
  );
}
