"use client";

import { Accordion } from "@/components/ui/accordion";
import { useAppTranslation } from "@/contexts/LanguageContext";
import type { StudentRoadmapModule } from "@/lib/student-api";
import { cn } from "@/lib/utils";
import { AccordionItem } from "./accordion-item";

export function CourseAccordion({
  modules,
  activeModuleId,
  activeLessonId,
  onToggleModule,
  onSelectLesson,
  className,
}: {
  modules: StudentRoadmapModule[];
  activeModuleId: string;
  activeLessonId: string;
  onToggleModule: (moduleId: string) => void;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  className?: string;
}) {
  const { t } = useAppTranslation();

  return (
    <aside
      className={cn(
        "rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]",
        className,
      )}
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          {t("dashboard.roadmapOverview")}
        </p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">{t("dashboard.modulesTitle")}</h3>
      </div>

      {!modules.length ? (
        <div className="rounded-[1.4rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          {t("dashboard.noModules")}
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={activeModuleId}
          onValueChange={onToggleModule}
          className="space-y-4"
        >
          {modules.map((module) => (
            <AccordionItem
              key={module.id}
              module={module}
              activeLessonId={activeLessonId}
              onSelectLesson={onSelectLesson}
            />
          ))}
        </Accordion>
      )}
    </aside>
  );
}
