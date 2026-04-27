"use client";

import {
  AccordionContent,
  AccordionItem as BaseAccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppTranslation } from "@/contexts/LanguageContext";
import type { StudentRoadmapModule } from "@/lib/student-api";
import { LessonItem } from "./lesson-item";
import { ProgressBar } from "./progress-bar";
import { StatePill } from "./state-pill";

export function AccordionItem({
  module,
  activeLessonId,
  onSelectLesson,
}: {
  module: StudentRoadmapModule;
  activeLessonId: string;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
}) {
  const { t } = useAppTranslation();

  return (
    <BaseAccordionItem
      value={module.id}
      className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-50"
    >
      <AccordionTrigger className="px-4 py-4 hover:no-underline">
        <div className="flex min-w-0 flex-1 items-start justify-between gap-4 text-left">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {t("dashboard.moduleLabel", { number: module.order_no })}
            </p>
            <p className="mt-1 truncate text-base font-semibold text-slate-950">
              {module.title}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {module.completed_lessons_count}/{module.total_lessons} {t("common.lessons")}
            </p>
          </div>
          <StatePill variant={module.status} />
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4">
        <ProgressBar
          value={module.progress_percent}
          className="mb-4"
          valueLabel={`${module.progress_percent}%`}
        />

        <div className="space-y-2">
          {module.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              isActive={activeLessonId === lesson.id}
              onSelect={() => onSelectLesson(module.id, lesson.id)}
            />
          ))}
        </div>
      </AccordionContent>
    </BaseAccordionItem>
  );
}
