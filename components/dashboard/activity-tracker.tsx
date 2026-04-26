"use client";

import { CalendarRange, CheckCircle2, Sparkles } from "lucide-react";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import {
  formatActivityDayLabel,
  getActivityTotals,
} from "@/lib/student-dashboard";
import type { StudentActivityDay } from "@/lib/student-api";
import { cn } from "@/lib/utils";

export function ActivityTracker({
  days,
  className,
}: {
  days: StudentActivityDay[];
  className?: string;
}) {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const totals = getActivityTotals(days);
  const maxCount = Math.max(...days.map((day) => day.total_count), 1);
  const hasActivity = totals.activeDays > 0;

  return (
    <article
      className={cn(
        "rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]",
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
          <CalendarRange className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            {t("dashboard.last7Days")}
          </p>
          <h3 className="text-xl font-bold text-slate-950">
            {t("dashboard.activityTracker")}
          </h3>
        </div>
      </div>

      {hasActivity ? (
        <>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const height = Math.max(14, Math.round((day.total_count / maxCount) * 100));

              return (
                <div key={day.date} className="text-center">
                  <div className="flex h-28 items-end justify-center rounded-[1.25rem] bg-slate-50 px-2 py-3">
                    <div
                      className={cn(
                        "w-full rounded-full transition-all duration-300",
                        day.is_active
                          ? "bg-[linear-gradient(180deg,#16a34a_0%,#059669_100%)]"
                          : "bg-slate-200",
                      )}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {formatActivityDayLabel(day.date, locale)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{day.total_count}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="text-sm text-slate-500">{t("dashboard.activeDays")}</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">{totals.activeDays}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="text-sm text-slate-500">{t("dashboard.logins")}</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">{totals.logins}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="text-sm text-slate-500">
                {t("dashboard.lessonCompletions")}
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-950">
                {totals.lessonCompletions}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-[1.4rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="mt-4 text-base font-semibold text-slate-900">
            {t("dashboard.noActivityTitle")}
          </p>
          <p className="mt-2 text-sm text-slate-500">{t("dashboard.noActivityBody")}</p>
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        {t("dashboard.activityTrackerSubtitle")}
      </div>
    </article>
  );
}
