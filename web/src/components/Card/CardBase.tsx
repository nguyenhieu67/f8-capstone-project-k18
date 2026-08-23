export function CardBase({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
