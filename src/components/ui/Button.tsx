"use client"; // <- WAJIB, agar onClick bisa jalan

import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
};

export default function Button({
  className = "",
  variant = "primary",
  type = "button",           // default bukan submit
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium shadow-sm transition";
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "border border-border/60 bg-background text-foreground hover:bg-muted";

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      disabled={disabled}
      className={[base, styles, disabledStyles, className].join(" ")}
      {...props}
    />
  );
}
