"use client";

import { CalendarRange, CheckCircle2, Sparkles, CalendarDays, LogIn, CheckSquare } from "lucide-react";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import {
  formatActivityDayLabel,
  getActivityTotals,
} from "@/lib/student-dashboard";
import type { StudentActivityDay } from "@/lib/student-api";
import { formatNumber } from "@/lib/i18n/format";
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
                <div key={day.date} className="group/day text-center">
                  <div className="flex h-32 items-end justify-center rounded-2xl bg-slate-50/80 px-2 py-4 transition-all hover:bg-slate-100/80">
                    <div
                      className={cn(
                        "w-full rounded-full transition-all duration-500 ease-out",
                        day.is_active
                          ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm"
                          : "bg-slate-200 group-hover/day:bg-slate-300",
                      )}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover/day:text-slate-600 transition-colors">
                    {formatActivityDayLabel(day.date, locale)}
                  </p>
                  <p className="mt-1 text-xs font-black text-slate-900 opacity-0 group-hover/day:opacity-100 transition-opacity">
                    {formatNumber(day.total_count, locale)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5_0%,#d1fae5_100%)] px-4 py-4 shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-900">{t("dashboard.activeDays")}</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-950">{formatNumber(totals.activeDays, locale)}</p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-[linear-gradient(135deg,#f0f9ff_0%,#e0f2fe_100%)] px-4 py-4 shadow-sm">
              <div className="flex items-center gap-2">
                <LogIn className="h-4 w-4 text-sky-600" />
                <p className="text-sm font-semibold text-sky-900">{t("dashboard.logins")}</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-sky-950">{formatNumber(totals.logins, locale)}</p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-[linear-gradient(135deg,#fffbeb_0%,#fef3c7_100%)] px-4 py-4 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-amber-600" />
                <p className="text-sm font-semibold text-amber-900">
                  {t("dashboard.lessonCompletions")}
                </p>
              </div>
              <p className="mt-2 text-2xl font-bold text-amber-950">
                {formatNumber(totals.lessonCompletions, locale)}
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
