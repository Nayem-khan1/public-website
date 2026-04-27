"use client";

import { CheckSquare, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppTranslation } from "@/contexts/LanguageContext";
import type {
  StudentLessonContent,
  StudentQuizSubmissionResponse,
} from "@/lib/student-api";
import { NotesTab } from "./notes-tab";
import { QuizTab } from "./quiz-tab";

export type LessonTabValue = "notes" | "quiz";

type QuizSelections = Record<string, Record<string, string[]>>;
type QuizResults = Record<string, StudentQuizSubmissionResponse["quiz"]>;

export function LessonTabs({
  activeTab,
  onTabChange,
  noteContent,
  quizContent,
  notesLocked,
  quizLocked,
  quizScore,
  actionLoading,
  notesDisabled,
  quizSelections,
  quizResults,
  onCompleteNote,
  onAnswerChange,
  onSubmitQuiz,
  onResetQuiz,
}: {
  activeTab: LessonTabValue;
  onTabChange: (value: LessonTabValue) => void;
  noteContent: StudentLessonContent | null;
  quizContent: StudentLessonContent | null;
  notesLocked: boolean;
  quizLocked: boolean;
  quizScore: number;
  actionLoading: boolean;
  notesDisabled: boolean;
  quizSelections: QuizSelections;
  quizResults: QuizResults;
  onCompleteNote: () => void;
  onAnswerChange: (
    quizId: string,
    questionId: string,
    option: string,
    questionType: "MCQ" | "MULTIPLE_SELECT" | "TRUE_FALSE",
    checked: boolean,
  ) => void;
  onSubmitQuiz: (content: StudentLessonContent) => void;
  onResetQuiz: (contentId: string) => void;
}) {
  const { t } = useAppTranslation();
  const hasNote = Boolean(noteContent?.pdf);
  const hasQuiz = Boolean(quizContent?.quiz);

  if (!hasNote && !hasQuiz) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
          {t("dashboard.noSmartNotes")}
        </div>
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
          {t("dashboard.noQuizLesson")}
        </div>
      </div>
    );
  }

  const resolvedActiveTab =
    activeTab === "notes" && !hasNote && hasQuiz
      ? "quiz"
      : activeTab === "quiz" && !hasQuiz
        ? "notes"
        : activeTab;

  return (
    <Tabs
      value={resolvedActiveTab}
      onValueChange={(value) => onTabChange(value as LessonTabValue)}
      className="space-y-5"
    >
      <TabsList className="h-auto flex-wrap justify-start gap-2 rounded-[1.2rem] bg-slate-100 p-1.5">
        {hasNote ? (
          <TabsTrigger
            value="notes"
            className="rounded-xl px-4 py-2 data-[state=active]:bg-white"
          >
            <FileText className="mr-2 h-4 w-4" />
            {t("dashboard.smartNotes")}
          </TabsTrigger>
        ) : null}

        {hasQuiz ? (
          <TabsTrigger
            value="quiz"
            className="rounded-xl px-4 py-2 data-[state=active]:bg-white"
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            {t("dashboard.lessonQuiz")}
          </TabsTrigger>
        ) : null}
      </TabsList>

      {hasNote ? (
        <TabsContent value="notes">
          <NotesTab
            note={noteContent}
            isLocked={notesLocked}
            isUpdating={actionLoading}
            disabled={notesDisabled}
            onComplete={onCompleteNote}
          />
        </TabsContent>
      ) : null}

      {hasQuiz ? (
        <TabsContent value="quiz">
          <QuizTab
            quizContent={quizContent}
            isLocked={quizLocked}
            quizScore={quizScore}
            actionLoading={actionLoading}
            quizSelections={quizSelections}
            quizResults={quizResults}
            onAnswerChange={onAnswerChange}
            onSubmit={onSubmitQuiz}
            onReset={onResetQuiz}
          />
        </TabsContent>
      ) : null}
    </Tabs>
  );
}
