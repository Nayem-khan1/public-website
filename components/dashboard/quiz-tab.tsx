"use client";

import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/contexts/LanguageContext";
import type {
  StudentLessonContent,
  StudentQuizSubmissionResponse,
} from "@/lib/student-api";
import { cn } from "@/lib/utils";

type QuizSelections = Record<string, Record<string, string[]>>;
type QuizResults = Record<string, StudentQuizSubmissionResponse["quiz"]>;

export function QuizTab({
  quizContent,
  isLocked,
  quizScore,
  actionLoading,
  quizSelections,
  quizResults,
  onAnswerChange,
  onSubmit,
  onReset,
}: {
  quizContent: StudentLessonContent | null;
  isLocked: boolean;
  quizScore: number;
  actionLoading: boolean;
  quizSelections: QuizSelections;
  quizResults: QuizResults;
  onAnswerChange: (
    quizId: string,
    questionId: string,
    option: string,
    questionType: "MCQ" | "MULTIPLE_SELECT" | "TRUE_FALSE",
    checked: boolean,
  ) => void;
  onSubmit: (content: StudentLessonContent) => void;
  onReset: (contentId: string) => void;
}) {
  const { t } = useAppTranslation();

  if (isLocked) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
        {t("dashboard.quizStepHint")}
      </div>
    );
  }

  if (!quizContent?.quiz) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
        {t("dashboard.noQuizLesson")}
      </div>
    );
  }

  const quiz = quizContent.quiz;
  const result = quizResults[quizContent.id];
  const hasCompletedQuiz = quizContent.is_completed && !result;
  const visibleResult = result
    ? result
    : hasCompletedQuiz
      ? {
          correct_count: 0,
          total_questions: quiz.questions.length,
          percent: quizScore,
          pass_mark: quiz.pass_mark,
          passed: quizScore >= quiz.pass_mark,
        }
      : null;
  const currentSelections = quizSelections[quizContent.id] ?? {};

  return (
    <div className="space-y-5">
      <article className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {t("dashboard.lessonQuiz")}
            </p>
            <h4 className="mt-2 text-xl font-semibold text-slate-950">{quiz.title}</h4>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
            <span className="rounded-full bg-white px-3 py-1">
              {quiz.questions.length} {t("dashboard.questionsLabel")}
            </span>
            <span className="rounded-full bg-white px-3 py-1">
              {t("dashboard.passMarkShort")}: {quiz.pass_mark}%
            </span>
            <span className="rounded-full bg-white px-3 py-1">
              {t("dashboard.timeLimit")}: {quiz.time_limit} {t("dashboard.timeLimitShort")}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {quiz.questions.map((question, questionIndex) => {
            const selectedAnswers = currentSelections[question.id] ?? [];
            const isSubmitted = Boolean(visibleResult);

            return (
              <div
                key={question.id}
                className="rounded-[1.3rem] border border-white bg-white p-4"
              >
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {t("dashboard.lessonNumber", { number: questionIndex + 1 })}
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    {question.question}
                  </p>
                </div>

                <div className="space-y-3">
                  {question.options.map((option) => {
                    const inputType =
                      question.question_type === "MULTIPLE_SELECT" ? "checkbox" : "radio";
                    const isChecked = selectedAnswers.includes(option);

                    return (
                      <label
                        key={option}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors",
                          isChecked
                            ? "border-primary/30 bg-primary/5 text-slate-900"
                            : "border-slate-200 bg-white text-slate-700",
                          !isSubmitted && "hover:border-primary/30 hover:bg-primary/5",
                        )}
                      >
                        <input
                          type={inputType}
                          name={`${quizContent.id}-${question.id}`}
                          className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
                          checked={isChecked}
                          disabled={isSubmitted}
                          onChange={(event) =>
                            onAnswerChange(
                              quizContent.id,
                              question.id,
                              option,
                              question.question_type,
                              event.target.checked,
                            )
                          }
                        />
                        <span className="flex-1">{option}</span>
                      </label>
                    );
                  })}
                </div>

                {isSubmitted && question.explanation ? (
                  <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    {question.explanation}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {visibleResult ? (
          <div
            className={cn(
              "mt-6 rounded-[1.4rem] border px-5 py-4",
              visibleResult.passed
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800",
            )}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {t("dashboard.quizScore")}
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {result ? `${result.correct_count}/${result.total_questions} · ` : ""}
                  {visibleResult.percent}%
                </p>
                <p className="mt-1 text-sm">
                  {visibleResult.passed
                    ? t("dashboard.quizPassed")
                    : t("dashboard.quizReviewNeeded")}
                </p>
              </div>

              {result ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onReset(quizContent.id)}
                  className="rounded-full border-current bg-transparent"
                >
                  {t("dashboard.retakeQuiz")}
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <Button
              type="button"
              onClick={() => onSubmit(quizContent)}
              disabled={actionLoading}
              className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
            >
              {actionLoading ? t("dashboard.updating") : t("dashboard.submitQuiz")}
            </Button>
          </div>
        )}
      </article>
    </div>
  );
}
