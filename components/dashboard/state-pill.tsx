"use client";

import { Badge } from "@/components/ui/badge";
import { useAppTranslation } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

type StatePillVariant =
  | "active"
  | "paused"
  | "completed"
  | "locked"
  | "current"
  | "upcoming"
  | "available";

const VARIANT_STYLES: Record<StatePillVariant, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paused: "border-amber-200 bg-amber-50 text-amber-700",
  completed: "border-sky-200 bg-sky-50 text-sky-700",
  locked: "border-rose-200 bg-rose-50 text-rose-700",
  current: "border-violet-200 bg-violet-50 text-violet-700",
  upcoming: "border-slate-200 bg-slate-100 text-slate-600",
  available: "border-cyan-200 bg-cyan-50 text-cyan-700",
};

const LABEL_KEYS: Record<StatePillVariant, string> = {
  active: "dashboard.statusActive",
  paused: "dashboard.statusPaused",
  completed: "dashboard.statusCompleted",
  locked: "dashboard.statusLocked",
  current: "dashboard.statusCurrent",
  upcoming: "dashboard.statusUpcoming",
  available: "dashboard.statusAvailable",
};

export function StatePill({
  variant,
  className,
}: {
  variant: StatePillVariant;
  className?: string;
}) {
  const { t } = useAppTranslation();

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {t(LABEL_KEYS[variant])}
    </Badge>
  );
}
