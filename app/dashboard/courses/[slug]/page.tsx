/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CheckSquare,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  Layers,
  Lock,
  PlayCircle,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatePill } from "@/components/dashboard/state-pill";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import { formatRelativeDate, formatShortDate } from "@/lib/student-dashboard";
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
  updateStudentLessonVideoProgress,
} from "@/lib/student-api";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1400";

type WorkspaceTab = "video" | "note" | "quiz";
type QuizSelections = Record<string, Record<string, string[]>>;
type QuizResults = Record<string, StudentQuizSubmissionResponse["quiz"]>;

function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.toLowerCase();

    if (host.includes("youtu.be")) {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (host.includes("youtube.com")) {
      const watchId = parsedUrl.searchParams.get("v");
      if (watchId) {
        return watchId;
      }

      const segments = parsedUrl.pathname.split("/").filter(Boolean);
      const embedIndex = segments.findIndex(
        (segment) => segment === "embed" || segment === "shorts",
      );

      if (embedIndex >= 0) {
        return segments[embedIndex + 1] ?? null;
      }
    }
  } catch {
    const fallbackMatch = url.match(
      /(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/i,
    );

    return fallbackMatch?.[1] ?? null;
  }

  return null;
}

function getVideoEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

function getPreferredLessonId(roadmap: StudentCourseRoadmapData): string | null {
  if (roadmap.summary.current_lesson_id) {
    return roadmap.summary.current_lesson_id;
  }

  for (const roadmapModule of roadmap.modules) {
    for (const lesson of roadmapModule.lessons) {
      if (lesson.status === "available" || lesson.status === "completed") {
        return lesson.id;
      }
    }
  }

  return roadmap.modules[0]?.lessons[0]?.id ?? null;
}

function getPreferredWorkspaceTab(lesson: StudentRoadmapLesson | null): WorkspaceTab {
  if (!lesson) {
    return "video";
  }

  if (
    lesson.progress.current_step === "quiz" &&
    lesson.contents.some((content) => content.type === "quiz" && content.quiz)
  ) {
    return "quiz";
  }

  if (
    lesson.progress.current_step === "note" &&
    lesson.contents.some((content) => content.type === "pdf" && content.pdf)
  ) {
    return "note";
  }

  if (lesson.contents.some((content) => content.type === "video" && content.video)) {
    return "video";
  }

  if (lesson.contents.some((content) => content.type === "quiz" && content.quiz)) {
    return "quiz";
  }

  if (lesson.contents.some((content) => content.type === "pdf" && content.pdf)) {
    return "note";
  }

  return "video";
}

function formatTimeLimitLabel(minutes: number, t: (key: string, params?: Record<string, unknown>) => string) {
  return `${minutes} ${t("dashboard.timeLimitShort")}`;
}

function getLessonPrimaryAction(
  lesson: StudentRoadmapLesson | null,
  t: (key: string, params?: Record<string, unknown>) => string,
): {
  label: string;
  tab: WorkspaceTab;
  icon: typeof PlayCircle | typeof CheckSquare | typeof FileText;
} | null {
  if (!lesson || lesson.status === "completed" || !lesson.is_unlocked) {
    return null;
  }

  if (
    lesson.progress.current_step === "quiz" &&
    lesson.contents.some((content) => content.type === "quiz" && content.quiz)
  ) {
    return {
      label: t("dashboard.takeQuizAction"),
      tab: "quiz",
      icon: CheckSquare,
    };
  }

  if (
    lesson.progress.current_step === "note" &&
    lesson.contents.some((content) => content.type === "pdf" && content.pdf)
  ) {
    return {
      label: t("dashboard.openNotesAction"),
      tab: "note",
      icon: FileText,
    };
  }

  if (lesson.contents.some((content) => content.type === "video" && content.video)) {
    return {
      label: t("dashboard.watchVideoAction"),
      tab: "video",
      icon: PlayCircle,
    };
  }

  if (lesson.contents.some((content) => content.type === "quiz" && content.quiz)) {
    return {
      label: t("dashboard.takeQuizAction"),
      tab: "quiz",
      icon: CheckSquare,
    };
  }

  if (lesson.contents.some((content) => content.type === "pdf" && content.pdf)) {
    return {
      label: t("dashboard.openNotesAction"),
      tab: "note",
      icon: FileText,
    };
  }

  return null;
}

export default function StudentCourseRoadmapPage() {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug ?? "";
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null);
  const [roadmap, setRoadmap] = useState<StudentCourseRoadmapData | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("video");
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

    const lessonIds = roadmap.modules.flatMap((module) =>
      module.lessons.map((lesson) => lesson.id),
    );

    if (selectedLessonId && lessonIds.includes(selectedLessonId)) {
      return;
    }

    const defaultLessonId = getPreferredLessonId(roadmap);
    if (defaultLessonId) {
      setSelectedLessonId(defaultLessonId);
    }
  }, [roadmap, selectedLessonId]);

  const lessonEntries =
    roadmap?.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        module,
        lesson,
      })),
    ) ?? [];

  const selectedLessonEntry =
    lessonEntries.find((entry) => entry.lesson.id === selectedLessonId) ??
    lessonEntries[0] ??
    null;
  const selectedLesson = selectedLessonEntry?.lesson ?? null;
  const selectedModule = selectedLessonEntry?.module ?? null;

  useEffect(() => {
    setActiveTab(getPreferredWorkspaceTab(selectedLesson));
  }, [selectedLesson]);

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
    if (!roadmap || !selectedLesson) {
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
        selectedLesson.id,
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
    if (!roadmap || !selectedLesson) {
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
        selectedLesson.id,
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
    if (!content.quiz || !roadmap || !selectedLesson) {
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
        selectedLesson.id,
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

  const selectedLessonContents = selectedLesson?.contents ?? [];
  const lessonVideos = selectedLessonContents.filter(
    (content) => content.type === "video" && content.video,
  );
  const lessonNotes = selectedLessonContents.filter(
    (content) => content.type === "pdf" && content.pdf,
  );
  const lessonQuizzes = selectedLessonContents.filter(
    (content) => content.type === "quiz" && content.quiz,
  );
  const leadVideoContent = lessonVideos[0] ?? null;
  const leadNoteContent = lessonNotes[0] ?? null;
  const leadQuizContent = lessonQuizzes[0] ?? null;
  const leadVideo = lessonVideos[0]?.video ?? null;
  const leadVideoEmbedUrl = leadVideo ? getVideoEmbedUrl(leadVideo.url) : null;
  const isCompletedLesson = selectedLesson?.status === "completed";
  const isLockedCourse = roadmap?.course.access_status === "locked";
  const nextLesson = roadmap?.summary.next_lesson ?? null;
  const primaryAction = getLessonPrimaryAction(selectedLesson, t);
  const canAccessSelectedLesson = Boolean(selectedLesson?.is_unlocked) && !isLockedCourse;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)]">
        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(241,2,76,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(81,74,137,0.18),transparent_35%),linear-gradient(135deg,#020617_0%,#0f172a_60%,#1e293b_100%)] px-6 py-8 text-white md:px-8 md:py-10">
          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <Button
                asChild
                variant="ghost"
                className="mb-4 rounded-full px-0 text-white/70 hover:bg-transparent hover:text-white"
              >
                <Link href="/dashboard/courses">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("dashboard.backToMyCourses")}
                </Link>
              </Button>

              <div className="mb-4 flex flex-wrap gap-2">
                <StatePill
                  variant={
                    roadmap?.course.status === "completed"
                      ? "completed"
                      : roadmap?.course.status === "paused"
                        ? "paused"
                        : "active"
                  }
                  className="border-white/15 bg-white/10 text-white"
                />
                {roadmap?.course.access_status === "locked" ? (
                  <StatePill
                    variant="locked"
                    className="border-white/15 bg-white/10 text-white"
                  />
                ) : null}
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/55">
                {t("dashboard.learningWorkspace")}
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-5xl">
                {loading
                  ? t("dashboard.loadingDashboard")
                  : roadmap?.course.title ||
                    selectedCourse?.title ||
                    t("dashboard.courseNotFound")}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
                {roadmap?.course.subtitle || t("dashboard.workspaceSubtitle")}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={() => primaryAction && setActiveTab(primaryAction.tab)}
                  disabled={
                    actionLoading ||
                    !canAccessSelectedLesson ||
                    isCompletedLesson ||
                    !primaryAction
                  }
                  className="rounded-full bg-white text-slate-950 hover:bg-white/90"
                >
                  {isCompletedLesson ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {t("dashboard.completed")}
                    </>
                  ) : actionLoading ? (
                    <>
                      <Clock3 className="mr-2 h-4 w-4" />
                      {t("dashboard.updating")}
                    </>
                  ) : (
                    <>
                      {primaryAction ? <primaryAction.icon className="mr-2 h-4 w-4" /> : null}
                      {primaryAction ? primaryAction.label : t("dashboard.currentLessonOnly")}
                    </>
                  )}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href={`/courses/${slug}`}>{t("dashboard.openCourse")}</Link>
                </Button>
              </div>
            </div>

            <div className="w-full max-w-md overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 backdrop-blur-xl">
              <img
                src={roadmap?.course.thumbnail || selectedCourse?.thumbnail || FALLBACK_IMAGE}
                alt={roadmap?.course.title || selectedCourse?.title || t("dashboard.courseNotFound")}
                className="h-44 w-full object-cover"
              />
              <div className="space-y-4 p-5 text-sm text-white/72">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/8 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      {t("dashboard.progress")}
                    </p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      {roadmap?.course.progress_percent ?? selectedCourse?.progress_percent ?? 0}%
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/8 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      {t("dashboard.lastUpdated")}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {roadmap
                        ? formatShortDate(roadmap.course.last_activity_at, locale)
                        : t("common.loading")}
                    </p>
                  </div>
                </div>
                <p>
                  {roadmap
                    ? formatRelativeDate(roadmap.course.last_activity_at, locale)
                    : t("common.loading")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: t("dashboard.progress"),
            value: `${roadmap?.course.progress_percent ?? selectedCourse?.progress_percent ?? 0}%`,
            icon: Sparkles,
            accent: "from-rose-500/20 to-rose-100",
          },
          {
            title: t("dashboard.totalModules"),
            value: roadmap?.summary.total_modules ?? 0,
            icon: Layers,
            accent: "from-violet-500/20 to-violet-100",
          },
          {
            title: t("dashboard.lessonsCompleted"),
            value: roadmap?.summary.completed_lessons ?? 0,
            icon: CheckCircle2,
            accent: "from-emerald-500/20 to-emerald-100",
          },
          {
            title: t("dashboard.remainingLessons"),
            value: roadmap?.course.remaining_lessons ?? selectedCourse?.remaining_lessons ?? 0,
            icon: Rocket,
            accent: "from-cyan-500/20 to-cyan-100",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]"
          >
            <div
              className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${item.accent} p-3 text-slate-900`}
            >
              <item.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">{item.title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {t("dashboard.lessonMaterials")}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">
                  {selectedLesson?.title || t("dashboard.currentLesson")}
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  {selectedModule ? (
                    <span>
                      {t("dashboard.moduleLabel", { number: selectedModule.order_no })} ·{" "}
                      {selectedModule.title}
                    </span>
                  ) : null}
                  {selectedLesson ? (
                    <span>{t("dashboard.lessonNumber", { number: selectedLesson.order_no })}</span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {selectedLesson ? <StatePill variant={selectedLesson.status} /> : null}
                {lessonVideos.length ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    <PlayCircle className="h-3.5 w-3.5" />
                    {lessonVideos.length}
                  </span>
                ) : null}
                {lessonNotes.length ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    <FileText className="h-3.5 w-3.5" />
                    {lessonNotes.length}
                  </span>
                ) : null}
                {lessonQuizzes.length ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    <CheckSquare className="h-3.5 w-3.5" />
                    {lessonQuizzes.length}
                  </span>
                ) : null}
              </div>
            </div>

            {isLockedCourse ? (
              <div className="mt-6 rounded-[1.6rem] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                <div className="flex items-center gap-3 font-semibold text-rose-800">
                  <Lock className="h-5 w-5" />
                  {t("dashboard.lockedCourseMessage")}
                </div>
                <p className="mt-3">{t("dashboard.lessonLockedMessage")}</p>
              </div>
            ) : (
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as WorkspaceTab)}
                className="mt-6"
              >
                <TabsList className="h-auto flex-wrap justify-start gap-2 rounded-[1.2rem] bg-slate-100 p-1.5">
                  {lessonVideos.length ? (
                    <TabsTrigger
                      value="video"
                      disabled={leadVideoContent?.status === "locked"}
                      className="rounded-xl px-4 py-2 data-[state=active]:bg-white"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {t("dashboard.lessonVideo")}
                    </TabsTrigger>
                  ) : null}
                  {lessonNotes.length ? (
                    <TabsTrigger
                      value="note"
                      disabled={leadNoteContent?.status === "locked"}
                      className="rounded-xl px-4 py-2 data-[state=active]:bg-white"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      {t("dashboard.smartNotes")}
                    </TabsTrigger>
                  ) : null}
                  {lessonQuizzes.length ? (
                    <TabsTrigger
                      value="quiz"
                      disabled={leadQuizContent?.status === "locked"}
                      className="rounded-xl px-4 py-2 data-[state=active]:bg-white"
                    >
                      <CheckSquare className="mr-2 h-4 w-4" />
                      {t("dashboard.lessonQuiz")}
                    </TabsTrigger>
                  ) : null}
                </TabsList>

                <TabsContent value="video" className="mt-5">
                  {leadVideoContent?.status === "locked" ? (
                    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
                      {t("dashboard.videoWatchHint")}
                    </div>
                  ) : leadVideo ? (
                    <div className="space-y-5">
                      <div className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-slate-950">
                        {leadVideoEmbedUrl ? (
                          <div className="aspect-video">
                            <iframe
                              src={leadVideoEmbedUrl}
                              title={selectedLesson?.title || t("dashboard.currentLesson")}
                              className="h-full w-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-video items-center justify-center p-8 text-center text-sm text-white/75">
                            {t("dashboard.noVideoLesson")}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                        {leadVideo.duration ? (
                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                              {t("dashboard.duration")}
                            </p>
                            <p className="mt-1 font-semibold text-slate-950">
                              {leadVideo.duration}
                            </p>
                          </div>
                        ) : null}
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-full border-slate-200"
                        >
                          <a
                            href={leadVideo.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t("dashboard.openVideo")}
                          </a>
                        </Button>
                      </div>

                      <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-600">
                            {t("dashboard.progress")}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {selectedLesson?.progress.video_watch_percent ?? 0}%
                          </span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,#f1024c_0%,#514a89_100%)] transition-all duration-500"
                            style={{
                              width: `${selectedLesson?.progress.video_watch_percent ?? 0}%`,
                            }}
                          />
                        </div>
                        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <p className="text-sm text-slate-500">
                            {t("dashboard.videoWatchHint")}
                          </p>
                          <Button
                            type="button"
                            onClick={() => void handleMarkVideoComplete()}
                            disabled={
                              actionLoading ||
                              !selectedLesson ||
                              !leadVideoContent?.is_unlocked ||
                              selectedLesson.progress.video_completed
                            }
                            className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
                          >
                            {selectedLesson?.progress.video_completed
                              ? t("dashboard.videoCompleted")
                              : actionLoading
                                ? t("dashboard.updating")
                                : t("dashboard.markVideoComplete")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
                      {t("dashboard.noVideoLesson")}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="note" className="mt-5">
                  {leadNoteContent?.status === "locked" ? (
                    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
                      {t("dashboard.notesStepHint")}
                    </div>
                  ) : lessonNotes.length ? (
                    <div className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        {lessonNotes.map((content) => (
                          <article
                            key={content.id}
                            className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                  {t("dashboard.smartNotes")}
                                </p>
                                <h4 className="mt-2 text-lg font-semibold text-slate-950">
                                  {content.pdf?.title}
                                </h4>
                              </div>
                              <FileText className="h-5 w-5 text-primary" />
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                              <Button
                                asChild
                                className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
                              >
                                <a
                                  href={content.pdf?.file_url || "#"}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  {t("dashboard.openNote")}
                                </a>
                              </Button>
                              {content.pdf?.downloadable ? (
                                <Button
                                  asChild
                                  variant="outline"
                                  className="rounded-full border-slate-200"
                                >
                                  <a
                                    href={content.pdf.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <Download className="mr-2 h-4 w-4" />
                                    {t("dashboard.previewNote")}
                                  </a>
                                </Button>
                              ) : null}
                            </div>
                          </article>
                        ))}
                      </div>

                      {lessonNotes[0]?.pdf?.file_url ? (
                        <div className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white">
                          <iframe
                            src={lessonNotes[0].pdf.file_url}
                            title={lessonNotes[0].pdf.title}
                            className="h-[560px] w-full"
                          />
                        </div>
                      ) : null}

                      <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <p className="text-sm text-slate-500">
                            {t("dashboard.notesStepHint")}
                          </p>
                          <Button
                            type="button"
                            onClick={() => void handleCompleteNote()}
                            disabled={
                              actionLoading ||
                              !selectedLesson ||
                              !leadNoteContent?.is_unlocked ||
                              selectedLesson.progress.note_completed ||
                              selectedLesson.progress.lesson_completed
                            }
                            className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
                          >
                            {selectedLesson?.progress.note_completed ||
                            selectedLesson?.progress.lesson_completed
                              ? t("dashboard.notesCompleted")
                              : actionLoading
                                ? t("dashboard.updating")
                                : t("dashboard.markNotesComplete")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
                      {t("dashboard.noSmartNotes")}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="quiz" className="mt-5">
                  {leadQuizContent?.status === "locked" ? (
                    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
                      {t("dashboard.quizStepHint")}
                    </div>
                  ) : lessonQuizzes.length ? (
                    <div className="space-y-5">
                      {lessonQuizzes.map((content) => {
                        const quiz = content.quiz;
                        if (!quiz) {
                          return null;
                        }

                        const result = quizResults[content.id];
                        const hasPassedQuiz =
                          selectedLesson?.progress.quiz_completed && !result;
                        const visibleResult = result
                          ? result
                          : hasPassedQuiz
                            ? {
                                correct_count: 0,
                                total_questions: quiz.questions.length,
                                percent: selectedLesson?.progress.quiz_score ?? 0,
                                pass_mark: quiz.pass_mark,
                                passed: true,
                              }
                            : null;
                        const currentSelections = quizSelections[content.id] ?? {};

                        return (
                          <article
                            key={content.id}
                            className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5"
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                  {t("dashboard.lessonMaterials")}
                                </p>
                                <h4 className="mt-2 text-xl font-semibold text-slate-950">
                                  {quiz.title}
                                </h4>
                              </div>

                              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                                <span className="rounded-full bg-white px-3 py-1">
                                  {quiz.questions.length} {t("dashboard.questionsLabel")}
                                </span>
                                <span className="rounded-full bg-white px-3 py-1">
                                  {t("dashboard.passMarkShort")}: {quiz.pass_mark}%
                                </span>
                                <span className="rounded-full bg-white px-3 py-1">
                                  {t("dashboard.timeLimit")}:{" "}
                                  {formatTimeLimitLabel(quiz.time_limit, t)}
                                </span>
                              </div>
                            </div>

                            <div className="mt-6 space-y-4">
                              {quiz.questions.map((question, questionIndex) => {
                                const selectedAnswers =
                                  currentSelections[question.id] ?? [];
                                const isSubmitted = Boolean(visibleResult);

                                return (
                                  <div
                                    key={question.id}
                                    className="rounded-[1.3rem] border border-white bg-white p-4"
                                  >
                                    <div className="mb-4">
                                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        {t("dashboard.lessonNumber", {
                                          number: questionIndex + 1,
                                        })}
                                      </p>
                                      <p className="mt-2 text-base font-semibold text-slate-950">
                                        {question.question}
                                      </p>
                                    </div>

                                    <div className="space-y-3">
                                      {question.options.map((option) => {
                                        const inputType =
                                          question.question_type ===
                                          "MULTIPLE_SELECT"
                                            ? "checkbox"
                                            : "radio";
                                        const isChecked =
                                          selectedAnswers.includes(option);

                                        return (
                                          <label
                                            key={option}
                                            className={cn(
                                              "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors",
                                              isSubmitted
                                                ? isChecked
                                                  ? "border-primary/30 bg-primary/5 text-slate-900"
                                                  : "border-slate-200 bg-white text-slate-700"
                                                : isChecked
                                                  ? "border-primary/30 bg-primary/5 text-slate-900"
                                                  : "border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:bg-primary/5",
                                            )}
                                          >
                                            <input
                                              type={inputType}
                                              name={`${content.id}-${question.id}`}
                                              className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
                                              checked={isChecked}
                                              disabled={isSubmitted}
                                              onChange={(event) =>
                                                updateQuizSelection(
                                                  content.id,
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
                                      {result
                                        ? `${result.correct_count}/${result.total_questions} · `
                                        : ""}
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
                                      onClick={() => resetQuiz(content.id)}
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
                                  onClick={() => void submitQuiz(content)}
                                  disabled={actionLoading}
                                  className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
                                >
                                  {actionLoading
                                    ? t("dashboard.updating")
                                    : t("dashboard.submitQuiz")}
                                </Button>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
                      {t("dashboard.noQuizLesson")}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {t("dashboard.nextMission")}
                </p>
                <h3 className="text-xl font-bold text-slate-950">
                  {t("dashboard.resumeCurrentLesson")}
                </h3>
              </div>
            </div>

            {nextLesson ? (
              <button
                type="button"
                onClick={() => setSelectedLessonId(nextLesson.id)}
                className="w-full rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {nextLesson.module_title}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {nextLesson.title}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {t("dashboard.lessonNumber", { number: nextLesson.order_no })}
                </p>
              </button>
            ) : (
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                {t("dashboard.noUpcomingLessons")}
              </div>
            )}
          </article>

          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {t("dashboard.roadmapOverview")}
                </p>
                <h3 className="text-xl font-bold text-slate-950">
                  {t("dashboard.moduleGuide")}
                </h3>
              </div>
            </div>

            {loading ? (
              <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
                {t("dashboard.loadingDashboard")}
              </p>
            ) : roadmap?.modules.length ? (
              <div className="space-y-4">
                {roadmap.modules.map((module) => (
                  <div
                    key={module.id}
                    className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          {t("dashboard.moduleLabel", { number: module.order_no })}
                        </p>
                        <p className="mt-1 font-semibold text-slate-950">
                          {module.title}
                        </p>
                      </div>
                      <StatePill variant={module.status === "completed" ? "completed" : module.status === "locked" ? "locked" : module.status === "current" ? "current" : "upcoming"} />
                    </div>

                    <div className="mb-4 h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#f1024c_0%,#514a89_100%)]"
                        style={{ width: `${module.progress_percent}%` }}
                      />
                    </div>

                    <div className="space-y-2">
                      {module.lessons.map((lesson) => {
                        const stepCount = lesson.contents.length;
                        const canSelectLesson = lesson.is_unlocked || lesson.status === "completed";

                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => {
                              if (canSelectLesson) {
                                setSelectedLessonId(lesson.id);
                              }
                            }}
                            disabled={!canSelectLesson}
                            className={cn(
                              "w-full rounded-2xl border px-3 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                              selectedLessonId === lesson.id
                                ? "border-primary/35 bg-white shadow-sm"
                                : canSelectLesson
                                  ? "border-white bg-white hover:border-primary/25 hover:bg-primary/5"
                                  : "border-dashed border-slate-200 bg-slate-100",
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-medium text-slate-900">
                                  {lesson.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {t("dashboard.lessonNumber", {
                                    number: lesson.order_no,
                                  })}{" "}
                                  · {stepCount} steps
                                </p>
                              </div>
                              <StatePill variant={lesson.status} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
                {t("dashboard.noModules")}
              </p>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
