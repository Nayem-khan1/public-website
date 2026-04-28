"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem as BaseAccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppTranslation } from "@/contexts/LanguageContext";
import type {
  StudentLessonContent,
  StudentQuizSubmissionResponse,
  StudentRoadmapModule,
} from "@/lib/student-api";
import { LessonItem } from "./lesson-item";

type QuizSelections = Record<string, Record<string, string[]>>;
type QuizResults = Record<string, StudentQuizSubmissionResponse["quiz"]>;

export function AccordionItem({
  module,
  activeLessonId,
  activeContentId,
  isCourseLocked,
  actionLoading,
  quizSelections,
  quizResults,
  onSelectLesson,
  onSelectContent,
  onCompleteVideo,
  onCompleteNote,
  onAnswerChange,
  onSubmitQuiz,
  onResetQuiz,
}: {
  module: StudentRoadmapModule;
  activeLessonId: string;
  activeContentId: string;
  isCourseLocked: boolean;
  actionLoading: boolean;
  quizSelections: QuizSelections;
  quizResults: QuizResults;
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
}) {
  const { t } = useAppTranslation();
  const activeModuleLessonId = module.lessons.some(
    (lesson) => lesson.id === activeLessonId,
  )
    ? activeLessonId
    : "";

  return (
    <BaseAccordionItem
      value={module.id}
      className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm"
    >
      <AccordionTrigger className="px-4 py-4 hover:no-underline">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-4 text-left">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {module.order_no}
            </div>
            <div className="min-w-0">
              <span className="block truncate text-sm font-bold text-slate-900">
                {module.title}
              </span>
              <span className="block text-xs text-slate-500">
                {module.completed_lessons_count}/{module.total_lessons} {t("common.lessons")}
              </span>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {module.progress_percent}%
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4">
        <Accordion
          type="single"
          collapsible
          value={activeModuleLessonId}
          onValueChange={(lessonId) => onSelectLesson(module.id, lessonId)}
          className="space-y-3"
        >
          {module.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              isExpanded={activeLessonId === lesson.id}
              activeContentId={activeContentId}
              isCourseLocked={isCourseLocked}
              actionLoading={actionLoading}
              quizSelections={quizSelections}
              quizResult={quizResults[lesson.id] ?? null}
              onSelectContent={onSelectContent}
              onCompleteVideo={onCompleteVideo}
              onCompleteNote={onCompleteNote}
              onAnswerChange={onAnswerChange}
              onSubmitQuiz={onSubmitQuiz}
              onResetQuiz={onResetQuiz}
            />
          ))}
        </Accordion>
      </AccordionContent>
    </BaseAccordionItem>
  );
}
