"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { CourseAccordion } from "@/components/dashboard/course-accordion";
import {
  LessonTabs,
  type LessonTabValue,
} from "@/components/dashboard/lesson-tabs";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { StatePill } from "@/components/dashboard/state-pill";
import { VideoPlayer } from "@/components/dashboard/video-player";
import { Button } from "@/components/ui/button";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import {
  completeStudentLessonNote,
  getStudentAccessToken,
  getStudentCourseRoadmap,
  getStudentCourses,
  submitStudentLessonQuiz,
  type StudentCourse,
  type StudentCourseRoadmapData,
  type StudentLessonContent,
  type StudentQuizSubmissionResponse,
  type StudentRoadmapLesson,
  type StudentRoadmapModule,
  updateStudentLessonVideoProgress,
} from "@/lib/student-api";

type QuizSelections = Record<string, Record<string, string[]>>;
type QuizResults = Record<string, StudentQuizSubmissionResponse["quiz"]>;

type LessonLocation = {
  moduleId: string;
  lessonId: string;
};

function findLessonLocation(
  modules: StudentRoadmapModule[],
  lessonId: string,
): LessonLocation | null {
  for (const roadmapModule of modules) {
    const lesson = roadmapModule.lessons.find((item) => item.id === lessonId);
    if (lesson) {
      return {
        moduleId: roadmapModule.id,
        lessonId: lesson.id,
      };
    }
  }

  return null;
}

function getModuleById(
  modules: StudentRoadmapModule[],
  moduleId: string,
): StudentRoadmapModule | null {
  return modules.find((roadmapModule) => roadmapModule.id === moduleId) ?? null;
}

function getPreferredLessonLocation(
  roadmap: StudentCourseRoadmapData,
): LessonLocation | null {
  if (roadmap.summary.current_lesson_id) {
    const currentLessonLocation = findLessonLocation(
      roadmap.modules,
      roadmap.summary.current_lesson_id,
    );
    if (currentLessonLocation) {
      return currentLessonLocation;
    }
  }

  for (const roadmapModule of roadmap.modules) {
    for (const lesson of roadmapModule.lessons) {
      if (lesson.is_unlocked || lesson.status === "completed") {
        return {
          moduleId: roadmapModule.id,
          lessonId: lesson.id,
        };
      }
    }
  }

  const firstModule = roadmap.modules[0] ?? null;
  const firstLesson = firstModule?.lessons[0] ?? null;
  if (!firstModule || !firstLesson) {
    return null;
  }

  return {
    moduleId: firstModule.id,
    lessonId: firstLesson.id,
  };
}

function getPreferredWorkspaceTab(
  lesson: StudentRoadmapLesson | null,
): LessonTabValue {
  if (!lesson) {
    return "notes";
  }

  if (
    lesson.progress.current_step === "quiz" &&
    lesson.contents.some((content) => content.type === "quiz" && content.quiz)
  ) {
    return "quiz";
  }

  if (lesson.contents.some((content) => content.type === "pdf" && content.pdf)) {
    return "notes";
  }

  if (lesson.contents.some((content) => content.type === "quiz" && content.quiz)) {
    return "quiz";
  }

  return "notes";
}

export default function StudentCourseRoadmapPage() {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug ?? "";
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null);
  const [roadmap, setRoadmap] = useState<StudentCourseRoadmapData | null>(null);
  const [activeModuleId, setActiveModuleId] = useState("");
  const [activeLessonId, setActiveLessonId] = useState("");
  const [activeTab, setActiveTab] = useState<LessonTabValue>("notes");
  const [quizSelections, setQuizSelections] = useState<QuizSelections>({});
  const [quizResults, setQuizResults] = useState<QuizResults>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadRoadmap = useCallback(async () => {
    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.dashboardAuthRequired"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const courses = await getStudentCourses(token, locale);
      const matchedCourse = courses.find((course) => course.slug === slug);

      if (!matchedCourse) {
        setSelectedCourse(null);
        setRoadmap(null);
        setError(t("dashboard.courseNotFound"));
        return;
      }

      setSelectedCourse(matchedCourse);
      const nextRoadmap = await getStudentCourseRoadmap(
        matchedCourse.course_id,
        token,
        locale,
      );
      setRoadmap(nextRoadmap);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : t("dashboard.loadCoursesFailed"),
      );
    } finally {
      setLoading(false);
    }
  }, [locale, slug, t]);

  useEffect(() => {
    void loadRoadmap();
  }, [loadRoadmap]);

  useEffect(() => {
    if (!roadmap) {
      return;
    }

    const currentLessonLocation = activeLessonId
      ? findLessonLocation(roadmap.modules, activeLessonId)
      : null;

    if (currentLessonLocation) {
      if (!getModuleById(roadmap.modules, activeModuleId)) {
        setActiveModuleId(currentLessonLocation.moduleId);
      }
      return;
    }

    const fallbackLessonLocation = getPreferredLessonLocation(roadmap);
    if (fallbackLessonLocation) {
      setActiveModuleId(fallbackLessonLocation.moduleId);
      setActiveLessonId(fallbackLessonLocation.lessonId);
    }
  }, [activeLessonId, activeModuleId, roadmap]);

  const activeLessonLocation =
    roadmap && activeLessonId ? findLessonLocation(roadmap.modules, activeLessonId) : null;
  const activeLessonModule =
    roadmap && activeLessonLocation
      ? getModuleById(roadmap.modules, activeLessonLocation.moduleId)
      : null;
  const activeLesson =
    activeLessonModule && activeLessonLocation
      ? activeLessonModule.lessons.find(
          (lesson) => lesson.id === activeLessonLocation.lessonId,
        ) ?? null
      : null;

  useEffect(() => {
    setActiveTab(getPreferredWorkspaceTab(activeLesson));
  }, [activeLesson]);

  function handleSelectLesson(moduleId: string, lessonId: string) {
    setActiveModuleId(moduleId);
    setActiveLessonId(lessonId);
  }

  function updateQuizSelection(
    quizId: string,
    questionId: string,
    option: string,
    questionType: "MCQ" | "MULTIPLE_SELECT" | "TRUE_FALSE",
    checked: boolean,
  ) {
    setQuizSelections((currentSelections) => {
      const quizSelection = currentSelections[quizId] ?? {};
      const currentAnswers = quizSelection[questionId] ?? [];
      const nextAnswers =
        questionType === "MULTIPLE_SELECT"
          ? checked
            ? Array.from(new Set([...currentAnswers, option]))
            : currentAnswers.filter((answer) => answer !== option)
          : checked
            ? [option]
            : [];

      return {
        ...currentSelections,
        [quizId]: {
          ...quizSelection,
          [questionId]: nextAnswers,
        },
      };
    });
  }

  async function handleMarkVideoComplete() {
    if (!roadmap || !activeLesson) {
      return;
    }

    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.authRequired"));
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      await updateStudentLessonVideoProgress(
        roadmap.course.course_id,
        activeLesson.id,
        100,
        token,
      );
      await loadRoadmap();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : t("dashboard.completeLessonFailed"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCompleteNote() {
    if (!roadmap || !activeLesson) {
      return;
    }

    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.authRequired"));
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      await completeStudentLessonNote(
        roadmap.course.course_id,
        activeLesson.id,
        token,
      );
      await loadRoadmap();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : t("dashboard.completeLessonFailed"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function submitQuiz(content: StudentLessonContent) {
    if (!content.quiz || !roadmap || !activeLesson) {
      return;
    }

    const answers = quizSelections[content.id] ?? {};
    const hasIncompleteAnswers = content.quiz.questions.some(
      (question) => (answers[question.id] ?? []).length === 0,
    );

    if (hasIncompleteAnswers) {
      setError(t("dashboard.answerAllQuestions"));
      return;
    }

    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.authRequired"));
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const response = await submitStudentLessonQuiz(
        roadmap.course.course_id,
        activeLesson.id,
        answers,
        token,
      );

      setQuizResults((currentResults) => ({
        ...currentResults,
        [content.id]: response.quiz,
      }));
      await loadRoadmap();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : t("dashboard.completeLessonFailed"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  function resetQuiz(contentId: string) {
    setQuizResults((currentResults) => {
      const nextResults = { ...currentResults };
      delete nextResults[contentId];
      return nextResults;
    });

    setQuizSelections((currentSelections) => {
      const nextSelections = { ...currentSelections };
      delete nextSelections[contentId];
      return nextSelections;
    });
  }

  const lessonContents = activeLesson?.contents ?? [];
  const videoContent =
    lessonContents.find((content) => content.type === "video" && content.video) ?? null;
  const noteContent =
    lessonContents.find((content) => content.type === "pdf" && content.pdf) ?? null;
  const quizContent =
    lessonContents.find((content) => content.type === "quiz" && content.quiz) ?? null;
  const lessonVideo = videoContent?.video ?? null;
  const courseProgress = roadmap?.course.progress_percent ?? selectedCourse?.progress_percent ?? 0;
  const completedLessons =
    roadmap?.course.completed_lessons_count ?? selectedCourse?.completed_lessons_count ?? 0;
  const totalLessons = roadmap?.course.total_lessons ?? selectedCourse?.total_lessons ?? 0;
  const remainingLessons =
    roadmap?.course.remaining_lessons ?? selectedCourse?.remaining_lessons ?? 0;
  const isLockedCourse = roadmap?.course.access_status === "locked";
  const notesLocked = isLockedCourse || Boolean(noteContent && !noteContent.is_unlocked);
  const quizLocked = isLockedCourse || Boolean(quizContent && !quizContent.is_unlocked);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)] md:px-8">
        <Button
          asChild
          variant="ghost"
          className="mb-5 rounded-full px-0 text-slate-500 hover:bg-transparent hover:text-slate-950"
        >
          <Link href="/dashboard/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("dashboard.backToMyCourses")}
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {t("dashboard.learningWorkspace")}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">
              {loading
                ? t("dashboard.loadingDashboard")
                : roadmap?.course.title ||
                  selectedCourse?.title ||
                  t("dashboard.courseNotFound")}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              {roadmap?.course.subtitle || t("dashboard.workspaceSubtitle")}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <StatePill
                variant={
                  roadmap?.course.status === "completed"
                    ? "completed"
                    : roadmap?.course.status === "paused"
                      ? "paused"
                      : "active"
                }
              />
              {isLockedCourse ? <StatePill variant="locked" /> : null}
              {activeLesson ? <StatePill variant={activeLesson.status} /> : null}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <ProgressBar
              value={courseProgress}
              label={t("dashboard.progress")}
              valueLabel={`${courseProgress}%`}
            />

            <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
              <span>
                {completedLessons}/{totalLessons} {t("common.lessons")}
              </span>
              <span>{t("dashboard.lessonsRemaining", { count: remainingLessons })}</span>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                {t("dashboard.lessonMaterials")}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                {activeLesson?.title || t("dashboard.currentLesson")}
              </h3>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                {activeLessonModule ? (
                  <span>
                    {t("dashboard.moduleLabel", { number: activeLessonModule.order_no })} .{" "}
                    {activeLessonModule.title}
                  </span>
                ) : null}

                {activeLesson ? (
                  <span>{t("dashboard.lessonNumber", { number: activeLesson.order_no })}</span>
                ) : null}
              </div>
            </div>

            {activeLesson ? <StatePill variant={activeLesson.status} /> : null}
          </div>

          {isLockedCourse ? (
            <div className="rounded-[1.6rem] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
              <div className="flex items-center gap-3 font-semibold text-rose-800">
                <Lock className="h-5 w-5" />
                {t("dashboard.lockedCourseMessage")}
              </div>
              <p className="mt-3">{t("dashboard.lessonLockedMessage")}</p>
            </div>
          ) : activeLesson ? (
            <div className="space-y-6">
              <VideoPlayer
                title={activeLesson.title || t("dashboard.currentLesson")}
                video={lessonVideo}
                progressPercent={activeLesson.progress.video_watch_percent ?? 0}
                isCompleted={Boolean(videoContent?.is_completed)}
                isUpdating={actionLoading}
                disabled={actionLoading || !videoContent?.is_unlocked}
                onComplete={() => void handleMarkVideoComplete()}
              />

              <LessonTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                noteContent={noteContent}
                quizContent={quizContent}
                notesLocked={notesLocked}
                quizLocked={quizLocked}
                quizScore={activeLesson.progress.quiz_score}
                actionLoading={actionLoading}
                notesDisabled={actionLoading || !noteContent?.is_unlocked}
                quizSelections={quizSelections}
                quizResults={quizResults}
                onCompleteNote={() => void handleCompleteNote()}
                onAnswerChange={updateQuizSelection}
                onSubmitQuiz={(content) => void submitQuiz(content)}
                onResetQuiz={resetQuiz}
              />
            </div>
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
              {loading ? t("dashboard.loadingDashboard") : t("dashboard.courseNotFound")}
            </div>
          )}
        </article>

        <CourseAccordion
          modules={roadmap?.modules ?? []}
          activeModuleId={activeModuleId}
          activeLessonId={activeLessonId}
          onToggleModule={setActiveModuleId}
          onSelectLesson={handleSelectLesson}
        />
      </section>
    </div>
  );
}
