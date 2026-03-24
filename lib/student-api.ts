import type { Locale } from "@/lib/i18n/config";

const DEFAULT_API_BASE_URL = "http://localhost:5000/api/v1";
const TOKEN_STORAGE_KEY = "ap_student_token";
const TOKEN_COOKIE_KEY = "ap_student_token";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface StudentSessionUser {
  id: string;
  name: string;
  email: string;
  role: "student";
}

export interface StudentLoginResponse {
  access_token: string;
  refresh_token: string;
  token: string;
  user: StudentSessionUser;
}

export type StudentRegisterResponse = StudentLoginResponse;

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolled_courses_count: number;
  role: "student";
  status: "active" | "inactive";
}

export interface StudentCourse {
  enrollment_id: string;
  course_id: string;
  slug: string;
  title: string;
  thumbnail: string;
  duration: string;
  total_lessons: number;
  completed_lessons_count: number;
  remaining_lessons: number;
  progress_percent: number;
  status: "active" | "paused" | "completed";
  access_status: "active" | "locked";
  last_activity_at: string;
}

export interface StudentRoadmapLesson {
  id: string;
  title: string;
  order_no: number;
  module_id: string;
  status: "completed" | "current" | "upcoming" | "available" | "locked";
}

export interface StudentRoadmapModule {
  id: string;
  title: string;
  order_no: number;
  total_lessons: number;
  completed_lessons_count: number;
  progress_percent: number;
  status: "completed" | "current" | "upcoming" | "locked";
  lessons: StudentRoadmapLesson[];
}

export interface StudentCourseRoadmapData {
  course: StudentCourse & {
    subtitle: string;
  };
  summary: {
    total_modules: number;
    completed_modules: number;
    total_lessons: number;
    completed_lessons: number;
    next_lesson: {
      id: string;
      title: string;
      order_no: number;
      module_id: string;
      module_title: string;
    } | null;
  };
  modules: StudentRoadmapModule[];
}

export interface StudentDashboardData {
  student: {
    id: string;
    name: string;
    email: string;
  };
  stats: {
    enrolled_courses: number;
    total_lessons_completed: number;
    total_lessons: number;
    completion_rate: number;
    issued_certificates: number;
  };
  enrolled_courses: StudentCourse[];
  upcoming_lessons: Array<{
    course_id: string;
    course_title: string;
    lesson_id: string;
    lesson_title: string;
    order_no: number;
  }>;
}

export interface StudentEnrollResponse {
  payment_required: boolean;
  already_enrolled: boolean;
  enrollment?: Record<string, unknown>;
  payment?: {
    payment_id: string;
    enrollment_id: string;
    payment_ref: string;
    bkash_url: string;
    invoice: string;
  };
}

export interface CompleteLessonResponse {
  completed_lesson_id: string | null;
  completed_lesson_title: string | null;
  progress_percent: number;
  is_course_completed: boolean;
  enrollment: Record<string, unknown>;
}

function normalizeApiBaseUrl(raw: string): string {
  const base = raw.trim().replace(/\/+$/, "");
  if (base.endsWith("/api/v1")) return base;
  if (base.endsWith("/api")) return `${base}/v1`;
  return `${base}/api/v1`;
}

function getApiBaseUrl(): string {
  const envBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.API_BASE_URL ??
    DEFAULT_API_BASE_URL;

  const normalized = normalizeApiBaseUrl(envBaseUrl);

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  if (normalized.startsWith("/")) {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${normalized}`;
    }
    return `http://localhost:5000${normalized}`;
  }

  return normalizeApiBaseUrl(DEFAULT_API_BASE_URL);
}

function buildUrl(pathname: string, query?: Record<string, string | undefined>): string {
  const url = new URL(pathname.replace(/^\/+/, ""), `${getApiBaseUrl()}/`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (!value) continue;
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

export function getStudentAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  return token && token.trim() ? token : null;
}

export function setStudentSession(token: string): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  document.cookie = `${TOKEN_COOKIE_KEY}=${encodeURIComponent(token)}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearStudentSession(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  document.cookie = `${TOKEN_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}

async function requestApi<T>(
  path: string,
  init: RequestInit = {},
  options: {
    auth?: boolean;
    token?: string;
    query?: Record<string, string | undefined>;
  } = {},
): Promise<T> {
  const requireAuth = options.auth ?? false;
  const token = options.token ?? getStudentAccessToken();

  if (requireAuth && !token) {
    throw new Error("Please log in to continue");
  }

  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (requireAuth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, options.query), {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  let payload: ApiEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  if (!payload) {
    throw new Error("Invalid API response");
  }

  return payload.data;
}

export async function loginStudent(input: {
  email: string;
  password: string;
}): Promise<StudentLoginResponse> {
  return requestApi<StudentLoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function registerStudent(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<StudentRegisterResponse> {
  return requestApi<StudentRegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function forgotStudentPassword(email: string): Promise<void> {
  await requestApi<null>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyStudentOtp(input: {
  email: string;
  otp: string;
}): Promise<{
  reset_token: string;
  expires_in_minutes: number;
}> {
  return requestApi("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function resetStudentPassword(input: {
  email: string;
  newPassword: string;
  resetToken: string;
}): Promise<void> {
  await requestApi<null>(
    "/auth/reset-password",
    {
      method: "POST",
      headers: {
        "x-reset-token": input.resetToken,
      },
      body: JSON.stringify({
        email: input.email,
        newPassword: input.newPassword,
        reset_token: input.resetToken,
      }),
    },
    { auth: false },
  );
}

export async function getStudentProfile(token?: string): Promise<StudentProfile> {
  return requestApi<StudentProfile>("/student/profile", {}, { auth: true, token });
}

export async function updateStudentProfile(
  input: {
    name?: string;
    phone?: string;
  },
  token?: string,
): Promise<StudentProfile> {
  return requestApi<StudentProfile>(
    "/student/profile",
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
    { auth: true, token },
  );
}

export async function getStudentDashboard(
  token?: string,
  lang: Locale = "en",
): Promise<StudentDashboardData> {
  return requestApi<StudentDashboardData>("/student/dashboard", {}, {
    auth: true,
    token,
    query: { lang },
  });
}

export async function getStudentCourses(
  token?: string,
  lang: Locale = "en",
): Promise<StudentCourse[]> {
  return requestApi<StudentCourse[]>("/student/courses", {}, {
    auth: true,
    token,
    query: { lang },
  });
}

export async function getStudentCourseRoadmap(
  courseId: string,
  token?: string,
  lang: Locale = "en",
): Promise<StudentCourseRoadmapData> {
  return requestApi<StudentCourseRoadmapData>(`/student/courses/${courseId}/roadmap`, {}, {
    auth: true,
    token,
    query: { lang },
  });
}

export async function enrollInCourse(
  courseId: string,
  token?: string,
): Promise<StudentEnrollResponse> {
  return requestApi<StudentEnrollResponse>(
    `/student/courses/${courseId}/enroll`,
    {
      method: "POST",
    },
    { auth: true, token },
  );
}

export async function completeNextLesson(
  courseId: string,
  token?: string,
): Promise<CompleteLessonResponse> {
  return requestApi<CompleteLessonResponse>(
    `/student/courses/${courseId}/complete-next-lesson`,
    {
      method: "POST",
    },
    { auth: true, token },
  );
}
