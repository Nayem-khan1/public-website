"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  HelpCircle,
  Info,
  RefreshCw,
  Trophy,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppTranslation } from "@/contexts/LanguageContext";
import type {
  StudentLessonContent,
  StudentQuizSubmissionResponse,
} from "@/lib/student-api";
import { cn } from "@/lib/utils";

type QuizSelections = Record<string, Record<string, string[]>>;

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

function calculateAggregatePassMark(quizContents: StudentLessonContent[]) {
  const weightedTotal = quizContents.reduce((sum, content) => {
    const questionCount = content.quiz?.questions.length ?? 0;
    const passMark = content.quiz?.pass_mark ?? 70;

    return sum + passMark * Math.max(questionCount, 1);
  }, 0);
  const weightedCount = quizContents.reduce(
    (sum, content) => sum + Math.max(content.quiz?.questions.length ?? 0, 1),
    0,
  );

  if (!weightedCount) {
    return 70;
  }

  return Math.round(weightedTotal / weightedCount);
}

export function QuizTab({
  quizContents,
  isLocked,
  quizScore,
  actionLoading,
  quizSelections,
  quizResult,
  onAnswerChange,
  onSubmit,
  onReset,
}: {
  quizContents: StudentLessonContent[];
  isLocked: boolean;
  quizScore: number;
  actionLoading: boolean;
  quizSelections: QuizSelections;
  quizResult: StudentQuizSubmissionResponse["quiz"] | null;
  onAnswerChange: (
    quizId: string,
    questionId: string,
    option: string,
    questionType: "MCQ" | "MULTIPLE_SELECT" | "TRUE_FALSE",
    checked: boolean,
  ) => void;
  onSubmit: () => void;
  onReset: () => void;
}) {
  const { t } = useAppTranslation();
  const [hasStarted, setHasStarted] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const totalTimeLimit = useMemo(
    () =>
      quizContents.reduce(
        (sum, content) => sum + (content.quiz?.time_limit ?? 0),
        0,
      ),
    [quizContents],
  );
  const [timeLeft, setTimeLeft] = useState(() => totalTimeLimit * 60);

  const allQuestions = useMemo(() => {
    return quizContents.flatMap((content) =>
      (content.quiz?.questions ?? []).map((q) => ({
        contentId: content.id,
        quizTitle: content.quiz?.title,
        question: q,
      }))
    );
  }, [quizContents]);

  const totalQuestions = allQuestions.length;
  const aggregatePassMark = calculateAggregatePassMark(quizContents);
  const hasTimedAttempt = totalTimeLimit > 0;
  const hasCompletedQuiz =
    quizContents.length > 0 &&
    quizContents.every((content) => content.is_completed);
  const visibleResult = useMemo(
    () =>
      quizResult
        ? quizResult
        : hasCompletedQuiz
          ? {
              correct_count: 0,
              total_questions: totalQuestions,
              percent: quizScore,
              pass_mark: aggregatePassMark,
              passed: quizScore >= aggregatePassMark,
              cards: [],
            }
          : null,
    [aggregatePassMark, hasCompletedQuiz, quizResult, quizScore, totalQuestions],
  );
  const currentQuestionData = allQuestions[activeQuestionIndex];
  const currentQuizContent = quizContents.find((c) => c.id === currentQuestionData?.contentId) ?? null;
  const currentQuiz = currentQuizContent?.quiz ?? null;

  useEffect(() => {
    if (!hasStarted || visibleResult || !hasTimedAttempt || actionLoading) {
      return;
    }

    if (timeLeft <= 0) {
      onSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => previousTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [actionLoading, hasStarted, hasTimedAttempt, onSubmit, timeLeft, visibleResult]);

  if (isLocked) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
        {t("dashboard.quizStepHint")}
      </div>
    );
  }

  if (!quizContents.length || !currentQuizContent || !currentQuiz) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
        {t("dashboard.noQuizLesson")}
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  const progressPercent = totalQuestions > 0
    ? ((activeQuestionIndex + 1) / totalQuestions) * 100
    : 0;

  // ─── START SCREEN ─────────────────────────────────────────────────
  if (!hasStarted && !visibleResult) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Brand top strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/60" />

        <div className="flex flex-col items-center px-6 py-12 text-center md:px-12 md:py-16">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HelpCircle className="h-8 w-8" />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-slate-900 md:text-3xl">
            {currentQuestionData?.quizTitle || "Quiz"}
          </h2>
          <p className="mb-8 text-sm text-slate-500">
            Test your knowledge and earn your score
          </p>

          {/* Stats row */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{quizContents.length}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Quiz Cards</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalQuestions}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Questions</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{aggregatePassMark}%</p>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Pass Mark</p>
            </div>
            {hasTimedAttempt && (
              <>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                    <Clock className="h-5 w-5" />
                    {totalTimeLimit}m
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Time Limit</p>
                </div>
              </>
            )}
          </div>

          <p className="mx-auto mb-10 max-w-sm text-sm leading-relaxed text-slate-400">
            Move through each question, answer carefully, then submit from the final question.
          </p>

          {hasTimedAttempt ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="h-12 rounded-full bg-primary px-10 text-base font-semibold text-white shadow-sm hover:bg-primary/90">
                  {t("dashboard.startQuiz", "Start Quiz")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-md">
                <div className="bg-primary px-6 py-8 text-center text-white">
                  <Clock className="mx-auto mb-3 h-10 w-10 opacity-80" />
                  <AlertDialogTitle className="text-xl font-bold text-white">
                    Timed Quiz
                  </AlertDialogTitle>
                </div>
                <div className="px-6 py-6">
                  <AlertDialogDescription className="mb-6 text-center text-sm text-slate-600">
                    This quiz has a time limit of{" "}
                    <strong className="text-primary">{totalTimeLimit} minutes</strong>.
                    Once you start, the timer cannot be paused.
                  </AlertDialogDescription>
                  <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
                    <AlertDialogAction
                      onClick={() => setHasStarted(true)}
                      className="w-full rounded-full bg-primary py-3 font-semibold text-white hover:bg-primary/90"
                    >
                      Start Now
                    </AlertDialogAction>
                    <AlertDialogCancel className="mt-0 w-full rounded-full py-3 font-semibold sm:mt-0">
                      Cancel
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              onClick={() => setHasStarted(true)}
              className="h-12 rounded-full bg-primary px-10 text-base font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              {t("dashboard.startQuiz", "Start Quiz")}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULT SCREEN ────────────────────────────────────────────────
  if (visibleResult) {
    const correctCount = quizResult ? quizResult.correct_count : 0;
    const totalQ = quizResult ? quizResult.total_questions : totalQuestions;

    return (
      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/60" />

          <div className="flex flex-col items-center px-6 py-12 text-center md:px-12 md:py-16">
            {/* Icon */}
            <div className={cn(
              "mb-6 flex h-20 w-20 items-center justify-center rounded-full",
              visibleResult.passed
                ? "bg-emerald-100 text-emerald-600"
                : "bg-primary/10 text-primary",
            )}>
              {visibleResult.passed ? (
                <Trophy className="h-10 w-10" />
              ) : (
                <XCircle className="h-10 w-10" />
              )}
            </div>

            {/* Score */}
            <p className={cn(
              "mb-1 text-5xl font-extrabold md:text-6xl",
              visibleResult.passed ? "text-emerald-600" : "text-primary",
            )}>
              {visibleResult.percent}%
            </p>
            <p className="mb-8 text-sm font-medium text-slate-500">
              {visibleResult.passed
                ? t("dashboard.quizPassed", "Congratulations! You passed the quiz.")
                : t("dashboard.quizReviewNeeded", "You didn't pass. Review and try again.")}
            </p>

            {/* Stats */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-slate-100 bg-slate-50 px-8 py-4">
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Correct</p>
                <p className="text-xl font-bold text-emerald-600">{correctCount}</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total</p>
                <p className="text-xl font-bold text-slate-700">{totalQ}</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Pass Mark</p>
                <p className="text-xl font-bold text-slate-700">{aggregatePassMark}%</p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => {
                onReset();
                setHasStarted(false);
                setActiveQuestionIndex(0);
                setTimeLeft(totalTimeLimit * 60);
              }}
              className="h-12 rounded-full bg-primary px-10 text-base font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("dashboard.retakeQuiz", "Retake Quiz")}
            </Button>
          </div>

          {/* Breakdown */}
          {visibleResult.cards && visibleResult.cards.length > 1 && (
            <div className="border-t border-slate-100 px-6 py-6">
              <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t("dashboard.quizBreakdown")}
              </p>
              <div className="mx-auto max-w-lg space-y-2">
                {visibleResult.cards.map((card, index) => (
                  <div
                    key={card.content_id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-slate-700">
                      {card.title ||
                        t("dashboard.quizCardLabel", {
                          current: index + 1,
                          total: visibleResult.cards?.length || 1,
                        })}
                    </span>
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-bold",
                      card.passed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-primary/10 text-primary",
                    )}>
                      {card.correct_count}/{card.total_questions} · {card.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Review questions */}
        <div className="space-y-4">
          {allQuestions.map((data, index) => {
            const { question, contentId } = data;
            const selectedAnswers = (quizSelections[contentId] ?? {})[question.id] ?? [];

            return (
              <div
                key={`${contentId}-${question.id}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Question {index + 1} · {question.question_type === "MULTIPLE_SELECT" ? "Multiple" : "Single"} Choice
                  </span>
                </div>
                <div className="px-5 py-4">
                  <p className="mb-4 text-base font-semibold text-slate-900">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => {
                      const isChecked = selectedAnswers.includes(option);
                      return (
                        <div
                          key={option}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm",
                            isChecked
                              ? "border-primary/30 bg-primary/5 text-slate-900"
                              : "border-slate-100 bg-slate-50 text-slate-500",
                          )}
                        >
                          <span className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                            isChecked
                              ? "bg-primary text-white"
                              : "bg-white text-slate-400 border border-slate-200",
                          )}>
                            {OPTION_LETTERS[optIdx] || optIdx + 1}
                          </span>
                          <span className="font-medium">{option}</span>
                        </div>
                      );
                    })}
                  </div>
                  {question.explanation && (
                    <div className="mt-4 flex gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-blue-800">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                      <span>{question.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── QUESTION SCREEN ──────────────────────────────────────────────
  const questionData = allQuestions[activeQuestionIndex];
  if (!questionData) return null;

  const { question, contentId } = questionData;
  const selectedAnswers = (quizSelections[contentId] ?? {})[question.id] ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Brand top strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/60" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
              Quiz {activeQuestionIndex + 1} / {totalQuestions}
            </p>
            <h4 className="text-sm font-bold text-slate-900">
              {questionData.quizTitle || "Quiz"}
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-primary/15 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
            {totalQuestions} Questions
          </span>
          <span className="hidden rounded-full border border-primary/15 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
            Pass: {aggregatePassMark}%
          </span>
          {hasTimedAttempt && (() => {
            const totalSeconds = totalTimeLimit * 60;
            const fraction = totalSeconds > 0 ? timeLeft / totalSeconds : 0;
            const radius = 22;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference * (1 - fraction);
            const isUrgent = timeLeft < 60;

            return (
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                {/* Background ring */}
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 56 56">
                  <circle
                    cx="28" cy="28" r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-slate-100"
                  />
                  <circle
                    cx="28" cy="28" r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={cn(
                      "transition-all duration-1000 ease-linear",
                      isUrgent ? "text-primary" : "text-primary",
                    )}
                  />
                </svg>
                {/* Glow effect when urgent */}
                {isUrgent && (
                  <div className="absolute inset-0 animate-pulse rounded-full shadow-[0_0_16px_rgba(241,2,76,0.3)]" />
                )}
                {/* Time text */}
                <div className="relative z-10 flex flex-col items-center leading-none">
                  <span className={cn(
                    "text-sm font-extrabold tabular-nums",
                    isUrgent ? "text-primary" : "text-slate-800",
                  )}>
                    {minutes}:{seconds.toString().padStart(2, "0")}
                  </span>
                  <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                    min
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-1 w-full bg-slate-100">
        <div
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question card */}
      <div className="p-5 md:p-6">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 md:p-8">
          {/* Question badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
            <span>Question {activeQuestionIndex + 1}</span>
            <span className="h-1 w-1 rounded-full bg-primary/30" />
            <span>{question.question_type === "MULTIPLE_SELECT" ? "Multiple Choice" : "Single Choice"}</span>
          </div>

          <h3 className="mb-6 text-lg font-bold leading-relaxed text-slate-900 md:text-xl">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, optIdx) => {
              const isChecked = selectedAnswers.includes(option);
              const inputType = question.question_type === "MULTIPLE_SELECT" ? "checkbox" : "radio";

              return (
                <label
                  key={option}
                  className={cn(
                    "group flex cursor-pointer items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-sm transition-all duration-150",
                    isChecked
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-white shadow-sm hover:border-primary/20 hover:shadow-md",
                  )}
                >
                  <span className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                    isChecked
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary",
                  )}>
                    {OPTION_LETTERS[optIdx] || optIdx + 1}
                  </span>
                  <input
                    type={inputType}
                    name={`${contentId}-${question.id}`}
                    className="sr-only"
                    checked={isChecked}
                    onChange={(event) =>
                      onAnswerChange(
                        contentId,
                        question.id,
                        option,
                        question.question_type,
                        event.target.checked,
                      )
                    }
                  />
                  <span className={cn(
                    "font-medium transition-colors",
                    isChecked ? "text-primary" : "text-slate-700 group-hover:text-slate-900",
                  )}>
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
          {allQuestions.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveQuestionIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === activeQuestionIndex
                  ? "w-6 bg-primary"
                  : i < activeQuestionIndex
                    ? "w-2 bg-primary/30"
                    : "w-2 bg-slate-200",
              )}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-5 flex items-center justify-between">
          <div>
            {activeQuestionIndex > 0 && (
              <button
                type="button"
                onClick={() =>
                  setActiveQuestionIndex((c) => Math.max(0, c - 1))
                }
                className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-primary"
              >
                <ChevronLeft className="h-4 w-4" />
                Last Question
              </button>
            )}
          </div>

          {activeQuestionIndex < allQuestions.length - 1 ? (
            <Button
              type="button"
              onClick={() =>
                setActiveQuestionIndex((c) =>
                  Math.min(allQuestions.length - 1, c + 1),
                )
              }
              className="h-11 rounded-full bg-primary px-8 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              {t("dashboard.nextQuiz", "Next")}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={actionLoading}
              className="h-11 rounded-full bg-primary px-8 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              {actionLoading
                ? t("dashboard.updating")
                : t("dashboard.submitQuiz", "Submit Quiz")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
