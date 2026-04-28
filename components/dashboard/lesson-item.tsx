"use client";

import type { ReactNode } from "react";
import {
  AccordionContent,
  AccordionItem as BaseAccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, FileText, HelpCircle, Lock, PlayCircle } from "lucide-react";
import { useAppTranslation } from "@/contexts/LanguageContext";
import type {
  StudentLessonContent,
  StudentQuizSubmissionResponse,
  StudentRoadmapLesson,
} from "@/lib/student-api";
import { cn } from "@/lib/utils";
import { StatePill } from "./state-pill";

type QuizSelections = Record<string, Record<string, string[]>>;

function SectionHeading({
  icon,
  title,
  meta,
}: {
  icon: ReactNode;
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {title}
          </p>
          {meta ? (
            <p className="mt-1 text-sm text-slate-500">{meta}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function LessonItem({
  lesson,
  isExpanded,
  activeContentId,
  isCourseLocked,
  actionLoading,
  quizSelections,
  quizResult,
  onSelectContent,
  onCompleteVideo,
  onCompleteNote,
  onAnswerChange,
  onSubmitQuiz,
  onResetQuiz,
}: {
  lesson: StudentRoadmapLesson;
  isExpanded: boolean;
  activeContentId: string;
  isCourseLocked: boolean;
  actionLoading: boolean;
  quizSelections: QuizSelections;
  quizResult: StudentQuizSubmissionResponse["quiz"] | null;
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
  const canOpenLesson =
    !isCourseLocked && (lesson.is_unlocked || lesson.status === "completed");
  const videoContent =
    lesson.contents.find((content) => content.type === "video" && content.video) ?? null;
  const noteContents = lesson.contents.filter(
    (content) => content.type === "pdf" && content.pdf,
  );
  const quizContents = lesson.contents.filter(
    (content) => content.type === "quiz" && content.quiz,
  );
  const hasVideo = Boolean(videoContent?.video);
  const stateVariant = canOpenLesson ? lesson.status : "locked";

  return (
    <BaseAccordionItem
      value={lesson.id}
      className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-50/80"
    >
      <AccordionTrigger
        disabled={!canOpenLesson}
        className={cn(
          "px-4 py-4 hover:no-underline",
          !canOpenLesson && "cursor-not-allowed opacity-70",
          isExpanded && "bg-white",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center justify-between gap-4 text-left">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                lesson.status === "completed"
                  ? "bg-emerald-500 text-white"
                  : canOpenLesson
                    ? "bg-primary text-primary-foreground"
                    : "bg-slate-100 text-slate-400"
              )}
            >
              {lesson.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : canOpenLesson ? (
                lesson.order_no
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0">
              <span className="block truncate text-sm font-bold text-slate-900">
                {lesson.title}
              </span>
            </div>
          </div>
          <StatePill variant={stateVariant} />
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-3 px-2">
        <div className="flex flex-col gap-1 mt-1">
          {lesson.contents.map((content) => {
            const isContentLocked = isCourseLocked || !content.is_unlocked;
            const isActive = activeContentId === content.id;
            let icon = <FileText className="h-4 w-4" />;
            let title = "Content";

            if (content.type === "video") {
              icon = <PlayCircle className="h-4 w-4" />;
              title = content.video?.duration ? `Video (${content.video.duration})` : "Video Lesson";
            } else if (content.type === "pdf") {
              icon = <FileText className="h-4 w-4" />;
              title = content.pdf?.title || "Smart Note";
            } else if (content.type === "quiz") {
              icon = <HelpCircle className="h-4 w-4" />;
              title = content.quiz?.title || "Quiz";
            }

            return (
              <button
                key={content.id}
                type="button"
                disabled={isContentLocked}
                onClick={() => onSelectContent(content.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-50",
                  isContentLocked && "cursor-not-allowed opacity-60"
                )}
              >
                <div className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                  isActive ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500",
                  isContentLocked && "bg-slate-100 text-slate-400"
                )}>
                  {isContentLocked ? <Lock className="h-3 w-3" /> : icon}
                </div>
                <span className={cn(
                  "flex-1 truncate font-medium",
                  isActive && "font-semibold"
                )}>
                  {title}
                </span>
                {content.is_completed && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </AccordionContent>
    </BaseAccordionItem>
  );
}
