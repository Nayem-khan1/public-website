"use client";

import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { useAppTranslation } from "@/contexts/LanguageContext";
import type { StudentRoadmapLesson } from "@/lib/student-api";
import { cn } from "@/lib/utils";
import { StatePill } from "./state-pill";

export function LessonItem({
  lesson,
  isActive,
  onSelect,
}: {
  lesson: StudentRoadmapLesson;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { t } = useAppTranslation();
  const canSelectLesson = lesson.is_unlocked || lesson.status === "completed";

  return (
    <button
      type="button"
      onClick={() => {
        if (canSelectLesson) {
          onSelect();
        }
      }}
      disabled={!canSelectLesson}
      className={cn(
        "w-full rounded-[1.2rem] border px-3 py-3 text-left transition-colors disabled:cursor-not-allowed",
        isActive
          ? "border-primary/30 bg-primary/5"
          : canSelectLesson
            ? "border-slate-200 bg-white hover:border-primary/20 hover:bg-primary/5"
            : "border-dashed border-slate-200 bg-slate-100 text-slate-400",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-slate-950">{lesson.title}</p>
          <p className="mt-1 text-xs text-slate-500">
            {t("dashboard.lessonNumber", { number: lesson.order_no })}
          </p>
        </div>

        {lesson.status === "completed" ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
        ) : canSelectLesson ? (
          <PlayCircle className="mt-0.5 h-4 w-4 text-primary" />
        ) : (
          <Lock className="mt-0.5 h-4 w-4 text-slate-400" />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          {lesson.progress.lesson_completed
            ? t("dashboard.completed")
            : lesson.progress.current_step === "video"
              ? t("dashboard.lessonVideo")
              : lesson.progress.current_step === "note"
                ? t("dashboard.smartNotes")
                : lesson.progress.current_step === "quiz"
                  ? t("dashboard.lessonQuiz")
                  : t("dashboard.currentLesson")}
        </span>
        <StatePill variant={lesson.status} />
      </div>
    </button>
  );
}
