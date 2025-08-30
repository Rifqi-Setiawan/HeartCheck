import * as React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  header?: React.ReactNode;
  footer?: React.ReactNode;
};
export default function Card({ className = "", header, footer, children, ...rest }: CardProps) {
  return (
    <div className={["rounded-xl border border-border/60 bg-card shadow-sm", className].join(" ")} {...rest}>
      {header ? <div className="border-b border-border/60 p-5">{header}</div> : null}
      <div className="p-6">{children}</div>
      {footer ? <div className="border-t border-border/60 p-4">{footer}</div> : null}
    </div>
  );
}
