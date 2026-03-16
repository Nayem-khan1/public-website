import type {
  BlogPost,
  Course,
  Event,
  TeamMember,
  Testimonial,
} from "@/data/types";
import { type AppLocale, pickLocalizedText } from "@/lib/i18n";

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
  title_bn?: string;
  subtitle?: string;
  subtitle_en?: string;
  subtitle_bn?: string;
  description?: string;
  description_en?: string;
  description_bn?: string;
  thumbnail?: string;
  category_id?: string;
  category_title?: string;
  category_title_en?: string;
  category_title_bn?: string;
  category_slug?: string;
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
  requirements_bn?: string[];
  learning_objectives?: string[];
  learning_objectives_en?: string[];
  learning_objectives_bn?: string[];
  targeted_audience?: string[];
  targeted_audience_en?: string[];
  targeted_audience_bn?: string[];
  faqs?: Array<{
    question_en: string;
    answer_en: string;
    question_bn?: string;
    answer_bn?: string;
  }>;
}

export interface PublicCourseCategoryRecord {
  id: string;
  slug?: string;
  title?: string;
  title_en?: string;
  title_bn?: string;
  description?: string;
  description_en?: string;
  description_bn?: string;
}

export interface PublicBlogRecord {
  id: string;
  slug: string;
  title?: string;
  title_en?: string;
  title_bn?: string;
  content?: string;
  content_en?: string;
  content_bn?: string;
  category?: string;
  category_en?: string;
  category_bn?: string;
  author?: string;
  author_en?: string;
  author_bn?: string;
  featured_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PublicEventRecord {
  id: string;
  slug: string;
  title?: string;
  title_en?: string;
  title_bn?: string;
  description?: string;
  description_en?: string;
  description_bn?: string;
  banner?: string;
  event_date?: string;
  registration_fee?: number;
  max_participants?: number;
  registered_count?: number;
}

export interface PublicInstructorRecord {
  id: string;
  name: string;
  name_bn?: string;
  email?: string;
  bio?: string;
  bio_en?: string;
  bio_bn?: string;
  avatar?: string;
  specialization?: string;
  specialization_en?: string;
  specialization_bn?: string;
}

export interface PublicTestimonialRecord {
  id: string;
  student_name?: string;
  student_name_bn?: string;
  role?: string;
  role_bn?: string;
  content?: string;
  content_bn?: string;
  issued_at?: string;
  certificate_no?: string;
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
  if (!value) return "bn";
  return value;
}

function normalizeLevel(value: string | undefined): string {
  if (!value) return "beginner";
  if (value === "all_levels") return "all_levels";
  return value.toLowerCase();
}

export async function listPublicCourses(options?: {
  page?: number;
  pageSize?: number;
  lang?: AppLocale;
  categoryId?: string;
  priceType?: "free" | "paid";
}): Promise<PublicCourseRecord[]> {
  const data = await fetchPublicApi<PaginatedResponse<PublicCourseRecord>>("/courses", {
    page: options?.page ?? 1,
    page_size: options?.pageSize ?? 100,
    lang: options?.lang ?? "en",
    category_id: options?.categoryId,
    price_type: options?.priceType,
  });
  return data?.items ?? [];
}

export async function listPublicCourseCategories(
  lang: AppLocale = "en",
): Promise<PublicCourseCategoryRecord[]> {
  const data = await fetchPublicApi<PublicCourseCategoryRecord[]>(
    "/course-categories",
    { lang },
  );
  return data ?? [];
}

export async function getPublicCourseBySlug(
  slug: string,
  lang: AppLocale = "en",
): Promise<PublicCourseRecord | null> {
  return fetchPublicApi<PublicCourseRecord>(`/courses/${slug}`, { lang });
}

export async function getCourseCards(
  limit?: number,
  options?: {
    categoryId?: string;
    priceType?: "free" | "paid";
    lang?: AppLocale;
  },
): Promise<Course[]> {
  const locale = options?.lang ?? "en";
  const courses = await listPublicCourses({
    pageSize: limit ?? 100,
    lang: locale,
    categoryId: options?.categoryId,
    priceType: options?.priceType,
  });
  return courses.map((course) => ({
    id: course.id,
    title: toHeadline(
      pickLocalizedText({
        locale,
        primary: course.title,
        en: course.title_en,
        bn: course.title_bn,
        fallback: "Untitled Course",
      }),
      "Untitled Course",
    ),
    slug: course.slug,
    shortDescription: toHeadline(
      pickLocalizedText({
        locale,
        primary: course.subtitle,
        en: course.subtitle_en,
        bn: course.subtitle_bn,
        fallback: "",
      }),
      "",
    ),
    description: toHeadline(
      pickLocalizedText({
        locale,
        primary: course.description,
        en: course.description_en,
        bn: course.description_bn,
        fallback: "",
      }),
      "",
    ),
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
    category:
      pickLocalizedText({
        locale,
        primary: course.category_title,
        en: course.category_title_en,
        bn: course.category_title_bn,
      }) ||
      course.category_id ||
      (locale === "bn" ? "জ্যোতির্বিজ্ঞান" : "Astronomy"),
    grade: course.grade || (locale === "bn" ? "সব" : "All"),
    mode: "Recorded",
    level: normalizeLevel(course.level),
    language: normalizeLanguage(course.language),
    totalLessons: typeof course.total_lessons === "number" ? course.total_lessons : 0,
    duration: course.duration || (locale === "bn" ? "নিজ গতিতে" : "Self-paced"),
    syllabus: [],
  }));
}

export async function listPublicBlogs(options?: {
  page?: number;
  pageSize?: number;
  lang?: AppLocale;
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
  lang: AppLocale = "en",
): Promise<PublicBlogRecord | null> {
  return fetchPublicApi<PublicBlogRecord>(`/blogs/${slug}`, { lang });
}

export async function getBlogCards(locale: AppLocale = "en"): Promise<BlogPost[]> {
  const posts = await listPublicBlogs({ lang: locale });
  return posts.map((post) => ({
    id: post.id,
    title: toHeadline(
      pickLocalizedText({
        locale,
        primary: post.title,
        en: post.title_en,
        bn: post.title_bn,
        fallback: "Untitled Post",
      }),
      "Untitled Post",
    ),
    slug: post.slug,
    excerpt: excerpt(
      pickLocalizedText({
        locale,
        primary: post.content,
        en: post.content_en,
        bn: post.content_bn,
        fallback: "",
      }),
    ),
    content: plainText(
      pickLocalizedText({
        locale,
        primary: post.content,
        en: post.content_en,
        bn: post.content_bn,
        fallback: "",
      }),
    ),
    authorName:
      pickLocalizedText({
        locale,
        primary: post.author,
        en: post.author_en,
        bn: post.author_bn,
      }) || "Editorial Team",
    publishedAt: post.updated_at || post.created_at || new Date().toISOString(),
    imageUrl:
      post.featured_image ||
      "https://images.unsplash.com/photo-1499750310159-5b5f09692c6a?auto=format&fit=crop&q=80&w=1200",
    category:
      pickLocalizedText({
        locale,
        primary: post.category,
        en: post.category_en,
        bn: post.category_bn,
      }) || "Insights",
  }));
}

export async function listPublicEvents(options?: {
  page?: number;
  pageSize?: number;
  lang?: AppLocale;
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
  lang: AppLocale = "en",
): Promise<PublicEventRecord | null> {
  return fetchPublicApi<PublicEventRecord>(`/events/${slug}`, { lang });
}

export async function getEventCards(locale: AppLocale = "en"): Promise<Event[]> {
  const events = await listPublicEvents({ lang: locale });
  return events.map((event) => ({
    id: event.id,
    slug: event.slug,
    title: toHeadline(
      pickLocalizedText({
        locale,
        primary: event.title,
        en: event.title_en,
        bn: event.title_bn,
        fallback: "Untitled Event",
      }),
      "Untitled Event",
    ),
    date: event.event_date || new Date().toISOString(),
    location: locale === "bn" ? "অনলাইন / পরে জানানো হবে" : "Online / TBA",
    description: toHeadline(
      pickLocalizedText({
        locale,
        primary: event.description,
        en: event.description_en,
        bn: event.description_bn,
        fallback: "",
      }),
      "",
    ),
    imageUrl:
      event.banner ||
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
    type: "Event",
    registrationLink: `/events/${event.slug}`,
  }));
}

export async function listPublicInstructors(options?: {
  page?: number;
  pageSize?: number;
}): Promise<PublicInstructorRecord[]> {
  const data = await fetchPublicApi<PaginatedResponse<PublicInstructorRecord>>(
    "/instructors",
    {
      page: options?.page ?? 1,
      page_size: options?.pageSize ?? 100,
    },
  );
  return data?.items ?? [];
}

export async function listPublicTestimonials(options?: {
  page?: number;
  pageSize?: number;
}): Promise<PublicTestimonialRecord[]> {
  const data = await fetchPublicApi<PaginatedResponse<PublicTestimonialRecord>>(
    "/testimonials",
    {
      page: options?.page ?? 1,
      page_size: options?.pageSize ?? 100,
    },
  );
  return data?.items ?? [];
}

export async function getTeamMembers(
  limit?: number,
  options?: { lang?: AppLocale },
): Promise<TeamMember[]> {
  const locale = options?.lang ?? "en";
  const instructors = await listPublicInstructors({
    pageSize: limit ?? 100,
  });

  return instructors.map((item, index) => ({
    id: item.id,
    name:
      pickLocalizedText({
        locale,
        primary: item.name,
        bn: item.name_bn,
      }) || item.name,
    role:
      pickLocalizedText({
        locale,
        primary: item.specialization,
        en: item.specialization_en,
        bn: item.specialization_bn,
      }) || (locale === "bn" ? "প্রশিক্ষক" : "Instructor"),
    bio:
      pickLocalizedText({
        locale,
        primary: item.bio,
        en: item.bio_en,
        bn: item.bio_bn,
      }) ||
      (locale === "bn"
        ? "শিক্ষার্থীদের বাস্তব বোঝাপড়া তৈরিতে নিবেদিত এক জ্যোতির্বিজ্ঞান প্রশিক্ষক।"
        : "Astronomy instructor dedicated to helping students build real understanding."),
    photoUrl:
      item.avatar ||
      `https://i.pravatar.cc/400?img=${(index % 60) + 1}`,
    category: locale === "bn" ? "প্রশিক্ষক" : "Instructor",
    socialLinks: {},
  }));
}

export async function getTestimonials(
  limit?: number,
  options?: { lang?: AppLocale },
): Promise<Testimonial[]> {
  const locale = options?.lang ?? "en";
  const testimonials = await listPublicTestimonials({
    pageSize: limit ?? 100,
  });

  return testimonials.map((item, index) => ({
    id: item.id,
    name:
      pickLocalizedText({
        locale,
        primary: item.student_name,
        bn: item.student_name_bn,
      }) || (locale === "bn" ? "শিক্ষার্থী" : "Student"),
    role:
      pickLocalizedText({
        locale,
        primary: item.role,
        bn: item.role_bn,
      }) || (locale === "bn" ? "শিক্ষার্থী" : "Learner"),
    content:
      pickLocalizedText({
        locale,
        primary: item.content,
        bn: item.content_bn,
      }) ||
      (locale === "bn"
        ? "অ্যাস্ট্রোনমি পাঠশালা আমাকে নিয়মিত থাকতে এবং কোর্স শেষ করতে সাহায্য করেছে।"
        : "Astronomy Pathshala helped me stay consistent and complete my course."),
    photoUrl: `https://i.pravatar.cc/200?img=${(index % 60) + 1}`,
  }));
}
