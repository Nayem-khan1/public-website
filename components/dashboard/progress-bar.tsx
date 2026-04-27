import { cn } from "@/lib/utils";

function clampPercent(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

export function ProgressBar({
  value,
  label,
  valueLabel,
  className,
  trackClassName,
  indicatorClassName,
}: {
  value: number;
  label?: string;
  valueLabel?: string;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
}) {
  const safeValue = clampPercent(value);

  return (
    <div className={cn("space-y-2", className)}>
      {label || valueLabel ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          {label ? <span className="font-medium text-slate-600">{label}</span> : <span />}
          {valueLabel ? (
            <span className="font-semibold text-slate-950">{valueLabel}</span>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "h-2.5 overflow-hidden rounded-full bg-slate-100",
          trackClassName,
        )}
      >
        <div
          className={cn(
            "h-full rounded-full bg-[linear-gradient(90deg,#f1024c_0%,#514a89_100%)] transition-all duration-300",
            indicatorClassName,
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
