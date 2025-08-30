import { AlertTriangle } from "lucide-react";

type Props = {
  title?: string;
  children?: React.ReactNode;
  variant?: "warning" | "info" | "error";
  className?: string;
};

export default function Alert({
  title = "Notice",
  children,
  variant = "warning",
  className = "",
}: Props) {
  const map = {
    warning:
      "border-yellow-300 bg-yellow-50 text-yellow-800",
    info:
      "border-blue-300 bg-blue-50 text-blue-800",
    error:
      "border-red-300 bg-red-50 text-red-800",
  } as const;

  return (
    <div
      className={[
        "rounded-md border px-4 py-3 text-sm",
        map[variant],
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <strong className="font-semibold">{title}</strong>
          {children ? <p className="mt-1">{children}</p> : null}
        </div>
      </div>
    </div>
  );
}
