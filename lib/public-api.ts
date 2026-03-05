import type { BlogPost, Course, Event } from "@/data/types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface PublicCourseRecord {
  id: string;
  slug: string;
  title?: string;
  title_en?: string;
  subtitle?: string;
  subtitle_en?: string;
  description?: string;
  description_en?: string;
  thumbnail?: string;
  category_id?: string;
  grade?: string;
  level?: string;
  language?: string;
  total_lessons?: number;
  duration?: string;
  is_free?: boolean;
  price?: number;
  discount_price?: number;
  requirements?: string[];
  requirements_en?: string[];
  learning_objectives?: string[];
  learning_objectives_en?: string[];
  targeted_audience?: string[];
  targeted_audience_en?: string[];
  faqs?: Array<{
    question_en: string;
    answer_en: string;
    question_bn?: string;
    answer_bn?: string;
  }>;
}

export interface PublicBlogRecord {
  id: string;
  slug: string;
  title?: string;
  title_en?: string;
  content?: string;
  content_en?: string;
  category?: string;
  author?: string;
  featured_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PublicEventRecord {
  id: string;
  slug: string;
  title?: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  banner?: string;
  event_date?: string;
  registration_fee?: number;
  max_participants?: number;
  registered_count?: number;
}

const DEFAULT_API_BASE_URL = "http://localhost:5000/api/v1";

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

function buildUrl(pathname: string, query?: Record<string, string | number | undefined>): string {
  const url = new URL(pathname.replace(/^\/+/, ""), `${getApiBaseUrl()}/`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (typeof value === "undefined") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function fetchPublicApi<T>(
  path: string,
  query?: Record<string, string | number | undefined>,
): Promise<T | null> {
  try {
    const response = await fetch(buildUrl(path, query), {
      method: "GET",
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiEnvelope<T>;
    return payload.data;
  } catch {
    return null;
  }
}

function toHeadline(value: string | undefined, fallback: string): string {
  if (!value || !value.trim()) return fallback;
  return value;
}

function plainText(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function excerpt(value: string | undefined, maxLength = 160): string {
  const text = plainText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function normalizeLanguage(value: string | undefined): string {
  if (value === "bn") return "Bangla";
  if (value === "en") return "English";
  return value || "Bangla";
}

function normalizeLevel(value: string | undefined): string {
  if (!value) return "Beginner";
  if (value === "all_levels") return "All Levels";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export async function listPublicCourses(options?: {
  page?: number;
  pageSize?: number;
  lang?: "en" | "bn";
}): Promise<PublicCourseRecord[]> {
  const data = await fetchPublicApi<PaginatedResponse<PublicCourseRecord>>("/courses", {
    page: options?.page ?? 1,
    page_size: options?.pageSize ?? 100,
    lang: options?.lang ?? "en",
  });
  return data?.items ?? [];
}

export async function getPublicCourseBySlug(
  slug: string,
  lang: "en" | "bn" = "en",
): Promise<PublicCourseRecord | null> {
  return fetchPublicApi<PublicCourseRecord>(`/courses/${slug}`, { lang });
}

export async function getCourseCards(limit?: number): Promise<Course[]> {
  const courses = await listPublicCourses({ pageSize: limit ?? 100, lang: "en" });
  return courses.map((course) => ({
    id: course.id,
    title: toHeadline(course.title ?? course.title_en, "Untitled Course"),
    slug: course.slug,
    shortDescription: toHeadline(course.subtitle ?? course.subtitle_en, ""),
    description: toHeadline(course.description ?? course.description_en, ""),
    thumbnailUrl:
      course.thumbnail ||
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800",
    instructorId: "0",
    price: typeof course.price === "number" ? course.price : 0,
    isFree: Boolean(course.is_free),
    originalPrice:
      typeof course.discount_price === "number" &&
      typeof course.price === "number" &&
      course.discount_price < course.price
        ? course.price
        : null,
    category: course.category_id || "Astronomy",
    grade: course.grade || "All",
    mode: "Recorded",
    level: normalizeLevel(course.level),
    language: normalizeLanguage(course.language),
    totalLessons: typeof course.total_lessons === "number" ? course.total_lessons : 0,
    duration: course.duration || "Self-paced",
    syllabus: [],
  }));
}

export async function listPublicBlogs(options?: {
  page?: number;
  pageSize?: number;
  lang?: "en" | "bn";
}): Promise<PublicBlogRecord[]> {
  const data = await fetchPublicApi<PaginatedResponse<PublicBlogRecord>>("/blogs", {
    page: options?.page ?? 1,
    page_size: options?.pageSize ?? 100,
    lang: options?.lang ?? "en",
  });
  return data?.items ?? [];
}

export async function getPublicBlogBySlug(
  slug: string,
  lang: "en" | "bn" = "en",
): Promise<PublicBlogRecord | null> {
  return fetchPublicApi<PublicBlogRecord>(`/blogs/${slug}`, { lang });
}

export async function getBlogCards(): Promise<BlogPost[]> {
  const posts = await listPublicBlogs({ lang: "en" });
  return posts.map((post) => ({
    id: post.id,
    title: toHeadline(post.title ?? post.title_en, "Untitled Post"),
    slug: post.slug,
    excerpt: excerpt(post.content ?? post.content_en),
    content: plainText(post.content ?? post.content_en),
    authorName: post.author || "Editorial Team",
    publishedAt: post.updated_at || post.created_at || new Date().toISOString(),
    imageUrl:
      post.featured_image ||
      "https://images.unsplash.com/photo-1499750310159-5b5f09692c6a?auto=format&fit=crop&q=80&w=1200",
    category: post.category || "Insights",
  }));
}

export async function listPublicEvents(options?: {
  page?: number;
  pageSize?: number;
  lang?: "en" | "bn";
}): Promise<PublicEventRecord[]> {
  const data = await fetchPublicApi<PaginatedResponse<PublicEventRecord>>("/events", {
    page: options?.page ?? 1,
    page_size: options?.pageSize ?? 100,
    lang: options?.lang ?? "en",
  });
  return data?.items ?? [];
}

export async function getPublicEventBySlug(
  slug: string,
  lang: "en" | "bn" = "en",
): Promise<PublicEventRecord | null> {
  return fetchPublicApi<PublicEventRecord>(`/events/${slug}`, { lang });
}

export async function getEventCards(): Promise<Event[]> {
  const events = await listPublicEvents({ lang: "en" });
  return events.map((event) => ({
    id: event.id,
    slug: event.slug,
    title: toHeadline(event.title ?? event.title_en, "Untitled Event"),
    date: event.event_date || new Date().toISOString(),
    location: "Online / TBA",
    description: toHeadline(event.description ?? event.description_en, ""),
    imageUrl:
      event.banner ||
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
    type: "Event",
    registrationLink: `/events/${event.slug}`,
  }));
}
