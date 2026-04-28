"use client";

import { useAppTranslation } from "@/contexts/LanguageContext";
import type {
  StudentLessonContent,
  StudentQuizSubmissionResponse,
  StudentRoadmapLesson,
} from "@/lib/student-api";
import { NotesTab } from "./notes-tab";
import { QuizTab } from "./quiz-tab";
import { VideoPlayer } from "./video-player";

type QuizSelections = Record<string, Record<string, string[]>>;

export function CourseContentViewer({
  lesson,
  activeContentId,
  isCourseLocked,
  actionLoading,
  quizSelections,
  quizResult,
  onCompleteVideo,
  onCompleteNote,
  onAnswerChange,
  onSubmitQuiz,
  onResetQuiz,
}: {
  lesson: StudentRoadmapLesson | null;
  activeContentId: string;
  isCourseLocked: boolean;
  actionLoading: boolean;
  quizSelections: QuizSelections;
  quizResult: StudentQuizSubmissionResponse["quiz"] | null;
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

  if (!lesson || !activeContentId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-[1.6rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        {t("dashboard.selectContentHint", "Please select a lesson content from the right sidebar to view.")}
      </div>
    );
  }

  const activeContent = lesson.contents.find((c) => c.id === activeContentId);

  if (!activeContent) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-[1.6rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        Content not found.
      </div>
    );
  }

  const isContentLocked = isCourseLocked || !activeContent.is_unlocked;

  if (isContentLocked) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-[1.6rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        {t("dashboard.lessonLockedMessage")}
      </div>
    );
  }

  return (
    <div className="w-full">
      {activeContent.type === "video" && activeContent.video && (
        <VideoPlayer
          title={lesson.title || t("dashboard.currentLesson")}
          video={activeContent.video}
          progressPercent={lesson.progress.video_watch_percent ?? 0}
          isCompleted={Boolean(activeContent.is_completed)}
          isUpdating={actionLoading}
          disabled={actionLoading}
          onComplete={() => onCompleteVideo(lesson.id)}
        />
      )}

      {activeContent.type === "pdf" && activeContent.pdf && (
        <NotesTab
          notes={[activeContent]}
          isLocked={false}
          isUpdating={actionLoading}
          disabled={actionLoading}
          onComplete={() => onCompleteNote(lesson.id)}
        />
      )}

      {activeContent.type === "quiz" && activeContent.quiz && (
        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
          <QuizTab
            quizContents={[activeContent]}
            isLocked={false}
            quizScore={lesson.progress.quiz_score}
            actionLoading={actionLoading}
            quizSelections={quizSelections}
            quizResult={quizResult}
            onAnswerChange={onAnswerChange}
            onSubmit={() => onSubmitQuiz(lesson.id, [activeContent])}
            onReset={() => onResetQuiz(lesson.id, [activeContent.id])}
          />
        </div>
      )}
    </div>
  );
}
