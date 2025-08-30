type Props = React.PropsWithChildren<{ className?: string }>;

export default function Container({ className = "", children }: Props) {
  return (
    <div className={["mx-auto w-full max-w-7xl px-4", className].join(" ")}>
      {children}
    </div>
  );
}
