import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
};

export default function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition shadow-sm";
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "border border-border/60 bg-background text-foreground hover:bg-muted";

  return <button className={[base, styles, className].join(" ")} {...props} />;
}
