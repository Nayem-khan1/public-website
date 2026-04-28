"use client";

import { Accordion } from "@/components/ui/accordion";
import { useAppTranslation } from "@/contexts/LanguageContext";
import type {
  StudentLessonContent,
  StudentQuizSubmissionResponse,
  StudentRoadmapModule,
} from "@/lib/student-api";
import { cn } from "@/lib/utils";
import { AccordionItem } from "./accordion-item";

type QuizSelections = Record<string, Record<string, string[]>>;
type QuizResults = Record<string, StudentQuizSubmissionResponse["quiz"]>;

export function CourseAccordion({
  modules,
  activeModuleId,
  activeLessonId,
  activeContentId,
  isCourseLocked,
  actionLoading,
  quizSelections,
  quizResults,
  onToggleModule,
  onSelectLesson,
  onSelectContent,
  onCompleteVideo,
  onCompleteNote,
  onAnswerChange,
  onSubmitQuiz,
  onResetQuiz,
  className,
}: {
  modules: StudentRoadmapModule[];
  activeModuleId: string;
  activeLessonId: string;
  activeContentId: string;
  isCourseLocked: boolean;
  actionLoading: boolean;
  quizSelections: QuizSelections;
  quizResults: QuizResults;
  onToggleModule: (moduleId: string) => void;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  onSelectContent: (contentId: string) => void;
  onCompleteVideo: (lessonId: string) => void;
  onCompleteNote: (lessonId: string) => void;
  onAnswerChange: (
    quizId: string,
    questionId: string,
    option: string,
    questionType: "MCQ" | "MULTIPLE_SELECT" | "TRUE_FALSE",
    checked: boolean,
  ) => void;
  onSubmitQuiz: (lessonId: string, contents: StudentLessonContent[]) => void;
  onResetQuiz: (lessonId: string, quizContentIds: string[]) => void;
  className?: string;
}) {
  const { t } = useAppTranslation();

  return (
    <section
      className={cn(
        "flex flex-col gap-3",
        className,
      )}
    >
      <div className="sr-only">
        {/* Screen reader only as the UI doesn't have a specific 'roadmap overview' title above modules anymore */}
        <h3 className="text-xl font-bold text-slate-950">{t("dashboard.modulesTitle")}</h3>
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
              activeContentId={activeContentId}
              isCourseLocked={isCourseLocked}
              actionLoading={actionLoading}
              quizSelections={quizSelections}
              quizResults={quizResults}
              onSelectLesson={onSelectLesson}
              onSelectContent={onSelectContent}
              onCompleteVideo={onCompleteVideo}
              onCompleteNote={onCompleteNote}
              onAnswerChange={onAnswerChange}
              onSubmitQuiz={onSubmitQuiz}
              onResetQuiz={onResetQuiz}
            />
          ))}
        </Accordion>
      )}
    </section>
  );
}
