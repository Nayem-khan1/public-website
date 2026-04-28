"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lock } from "lucide-react";
import { CourseAccordion } from "@/components/dashboard/course-accordion";
import { CourseContentViewer } from "@/components/dashboard/course-content-viewer";
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
  const [activeContentId, setActiveContentId] = useState("");
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
      
      const typeOrder: Record<string, number> = { video: 1, pdf: 2, quiz: 3 };
      nextRoadmap.modules.forEach(m => {
        m.lessons.forEach(l => {
          l.contents.sort((a, b) => {
            return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
          });
        });
      });

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
    const hasActiveModule = activeModuleId
      ? Boolean(getModuleById(roadmap.modules, activeModuleId))
      : false;

    if (!activeModuleId && !activeLessonId && !activeContentId) {
      const fallbackLessonLocation = getPreferredLessonLocation(roadmap);
      if (fallbackLessonLocation) {
        setActiveModuleId(fallbackLessonLocation.moduleId);
        setActiveLessonId(fallbackLessonLocation.lessonId);
        
        const mod = getModuleById(roadmap.modules, fallbackLessonLocation.moduleId);
        const les = mod?.lessons.find(l => l.id === fallbackLessonLocation.lessonId);
        if (les?.contents?.[0]) {
          setActiveContentId(les.contents[0].id);
        }
      }
      return;
    }

    if (activeLessonId && !currentLessonLocation) {
      const fallbackLessonLocation = getPreferredLessonLocation(roadmap);
      if (fallbackLessonLocation) {
        setActiveModuleId(fallbackLessonLocation.moduleId);
        setActiveLessonId(fallbackLessonLocation.lessonId);

        const mod = getModuleById(roadmap.modules, fallbackLessonLocation.moduleId);
        const les = mod?.lessons.find(l => l.id === fallbackLessonLocation.lessonId);
        if (les?.contents?.[0]) {
          setActiveContentId(les.contents[0].id);
        }
      }
      return;
    }

    if (activeModuleId && !hasActiveModule) {
      const fallbackLessonLocation =
        currentLessonLocation ?? getPreferredLessonLocation(roadmap);

      if (fallbackLessonLocation) {
        setActiveModuleId(fallbackLessonLocation.moduleId);
        if (!activeLessonId) {
          setActiveLessonId(fallbackLessonLocation.lessonId);
        }
      } else {
        setActiveModuleId("");
      }
    }
  }, [activeLessonId, activeModuleId, roadmap]);

  function handleSelectLesson(moduleId: string, lessonId: string) {
    setActiveModuleId(moduleId);
    setActiveLessonId(lessonId);
    
    // Automatically select the first content when a lesson is selected
    if (roadmap) {
      const mod = getModuleById(roadmap.modules, moduleId);
      const les = mod?.lessons.find(l => l.id === lessonId);
      if (les?.contents?.[0]) {
        setActiveContentId(les.contents[0].id);
      }
    }
  }

  function handleSelectContent(contentId: string) {
    setActiveContentId(contentId);
  }

  function handleToggleModule(moduleId: string) {
    setActiveModuleId(moduleId);
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

  async function handleMarkVideoComplete(lessonId: string) {
    if (!roadmap) {
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
        lessonId,
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

  async function handleCompleteNote(lessonId: string) {
    if (!roadmap) {
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
        lessonId,
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

  async function submitQuiz(
    lessonId: string,
    contents: StudentLessonContent[],
  ) {
    if (!contents.length || !roadmap) {
      return;
    }

    const hasIncompleteAnswers = contents.some((content) =>
      (content.quiz?.questions ?? []).some(
        (question) =>
          ((quizSelections[content.id] ?? {})[question.id] ?? []).length === 0,
      ),
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
      const answers = contents.reduce<Record<string, string[]>>((allAnswers, content) => {
        return {
          ...allAnswers,
          ...(quizSelections[content.id] ?? {}),
        };
      }, {});
      const response = await submitStudentLessonQuiz(
        roadmap.course.course_id,
        lessonId,
        answers,
        token,
      );

      setQuizResults((currentResults) => ({
        ...currentResults,
        [lessonId]: response.quiz,
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

  function resetQuiz(lessonId: string, quizContentIds: string[]) {
    setQuizResults((currentResults) => {
      const nextResults = { ...currentResults };
      delete nextResults[lessonId];
      return nextResults;
    });

    setQuizSelections((currentSelections) => {
      const nextSelections = { ...currentSelections };
      quizContentIds.forEach((contentId) => {
        delete nextSelections[contentId];
      });
      return nextSelections;
    });
  }

  const courseProgress = roadmap?.course.progress_percent ?? selectedCourse?.progress_percent ?? 0;
  const completedLessons =
    roadmap?.course.completed_lessons_count ?? selectedCourse?.completed_lessons_count ?? 0;
  const totalLessons = roadmap?.course.total_lessons ?? selectedCourse?.total_lessons ?? 0;
  const isLockedCourse = roadmap?.course.access_status === "locked";

  return (
    <div className="space-y-6">
      {/* Header section matching Mojaru design */}
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          {loading
            ? t("dashboard.loadingDashboard")
            : t("dashboard.classPrefix", "ক্লাস:") + " " + (roadmap?.course.title || selectedCourse?.title || t("dashboard.courseNotFound"))}
        </h1>
        
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            {/* Duration Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">{t("course.duration", "Duration")}</p>
                <p className="text-sm font-semibold text-slate-900">
                  {roadmap?.course.duration || selectedCourse?.duration || "N/A"}
                </p>
              </div>
            </div>

            {/* Total Lessons Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">{t("course.lessons", "Lessons")}</p>
                <p className="text-sm font-semibold text-slate-900">
                  {totalLessons} {t("common.lessons", "Lessons")}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="min-w-[140px]">
              <p className="mb-1.5 text-xs font-bold text-slate-900">
                {t("dashboard.courseProgress", "Course Progress")} {completedLessons}/{totalLessons}
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-500"  
                  style={{ width: `${courseProgress}%` }} 
                />
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {isLockedCourse ? (
        <div className="rounded-[1.6rem] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          <div className="flex items-center gap-3 font-semibold text-rose-800">
            <Lock className="h-5 w-5" />
            {t("dashboard.lockedCourseMessage")}
          </div>
          <p className="mt-3">{t("dashboard.lessonLockedMessage")}</p>
        </div>
      ) : null}

      {roadmap ? (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 xl:grid-cols-4">
          <div className="lg:col-span-2 xl:col-span-3">
            <CourseContentViewer
              lesson={roadmap.modules.flatMap(m => m.lessons).find(l => l.contents.some(c => c.id === activeContentId)) || null}
              activeContentId={activeContentId}
              isCourseLocked={isLockedCourse}
              actionLoading={actionLoading}
              quizSelections={quizSelections}
              quizResult={roadmap.modules.flatMap(m => m.lessons).find(l => l.contents.some(c => c.id === activeContentId)) ? quizResults[roadmap.modules.flatMap(m => m.lessons).find(l => l.contents.some(c => c.id === activeContentId))!.id] || null : null}
              onCompleteVideo={(lessonId) => void handleMarkVideoComplete(lessonId)}
              onCompleteNote={(lessonId) => void handleCompleteNote(lessonId)}
              onAnswerChange={updateQuizSelection}
              onSubmitQuiz={(lessonId, contents) => void submitQuiz(lessonId, contents)}
              onResetQuiz={resetQuiz}
            />
          </div>
          <div className="lg:col-span-1">
            <CourseAccordion
              modules={roadmap.modules}
              activeModuleId={activeModuleId}
              activeLessonId={activeLessonId}
              activeContentId={activeContentId}
              isCourseLocked={isLockedCourse}
              actionLoading={actionLoading}
              quizSelections={quizSelections}
              quizResults={quizResults}
              onToggleModule={handleToggleModule}
              onSelectLesson={handleSelectLesson}
              onSelectContent={handleSelectContent}
              onCompleteVideo={(lessonId) => void handleMarkVideoComplete(lessonId)}
              onCompleteNote={(lessonId) => void handleCompleteNote(lessonId)}
              onAnswerChange={updateQuizSelection}
              onSubmitQuiz={(lessonId, contents) => void submitQuiz(lessonId, contents)}
              onResetQuiz={resetQuiz}
            />
          </div>
        </div>
      ) : loading ? (
        <div className="rounded-[1.6rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
          {t("dashboard.loadingDashboard")}
        </div>
      ) : null}
    </div>
  );
}
