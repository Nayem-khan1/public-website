"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  completeNextLesson,
  getStudentAccessToken,
  getStudentCourses,
  type StudentCourse,
} from "@/lib/student-api";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingCourseId, setActionLoadingCourseId] = useState<string | null>(null);

  async function loadCourses() {
    const token = getStudentAccessToken();
    if (!token) {
      setError("Please log in to view your courses.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getStudentCourses(token);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCourses();
  }, []);

  async function handleCompleteNextLesson(courseId: string) {
    const token = getStudentAccessToken();
    if (!token) {
      setError("Please log in to continue.");
      return;
    }

    setActionLoadingCourseId(courseId);
    setError(null);

    try {
      await completeNextLesson(courseId, token);
      await loadCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update course progress");
    } finally {
      setActionLoadingCourseId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-slate-900">My Courses</h2>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full">
          <Link href="/courses">Browse More Courses</Link>
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">
          Loading enrolled courses...
        </div>
      ) : null}

      {!loading && courses.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">
          You have no enrolled courses yet.
        </div>
      ) : null}

      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.enrollment_id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={course.thumbnail || "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800"}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-bold text-white text-lg line-clamp-1">{course.title}</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {course.total_lessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration || "Self-paced"}
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Progress</span>
                  <span className="text-sm font-bold text-primary">
                    {course.progress_percent}%
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${course.progress_percent}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  {course.remaining_lessons} lessons remaining
                </span>
                <Button
                  size="sm"
                  disabled={
                    actionLoadingCourseId === course.course_id ||
                    course.remaining_lessons === 0
                  }
                  onClick={() => void handleCompleteNextLesson(course.course_id)}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {actionLoadingCourseId === course.course_id
                    ? "Updating..."
                    : course.remaining_lessons === 0
                      ? "Completed"
                      : "Complete Next"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
