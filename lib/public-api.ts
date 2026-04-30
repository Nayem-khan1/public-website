import type {
  BlogPost,
  Course,
  CourseHighlightAnimation,
  Event,
  TeamMember,
  Testimonial,
} from "@/data/types";
import type { Locale } from "@/lib/i18n/config";

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
  intro_video_url?: string;
  grade?: string;
  level?: string;
  language?: string;
  total_lessons?: number;
  duration?: string;
  is_popular?: boolean;
  highlight_animation?: string;
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
  instructors?: Array<{
    id: string;
    name: string;
    bio?: string;
    avatar?: string;
    specialization?: string;
  }>;
  curriculum?: Array<{
    id: string;
    title?: string;
    title_en?: string;
    title_bn?: string;
    order_no?: number;
    total_lessons?: number;
    lessons?: Array<{
      id: string;
      title?: string;
      title_en?: string;
      title_bn?: string;
      order_no?: number;
      is_preview?: boolean;
    }>;
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

export interface PublicBlogContentBlock {
  type: "text" | "heading" | "image";
  value?: string;
  url?: string;
  caption?: string;
  level?: number;
  rich_text?: Record<string, unknown>;
}

export interface PublicBlogCategoryRecord {
  id: string;
  title: string;
  slug: string;
  total_posts: number;
}

export interface PublicBlogRecord {
  id: string;
  slug: string;
  title?: string;
  title_en?: string;
  title_bn?: string;
  excerpt?: string;
  excerpt_en?: string;
  excerpt_bn?: string;
  content?: string;
  content_en?: string;
  content_bn?: string;
  content_blocks?: PublicBlogContentBlock[];
  category?: string;
  category_slug?: string;
  author?: string;
  thumbnail?: string;
  featured_image?: string;
  published_at?: string | null;
  read_time?: string;
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
  name_en?: string;
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
  role?: string;
  role_en?: string;
  role_bn?: string;
  content?: string;
  content_en?: string;
  content_bn?: string;
  issued_at?: string;
  certificate_no?: string;
}

export const DEFAULT_BLOG_IMAGE_URL =
  "https://placehold.co/1600x900/0f172a/e2e8f0/png?text=Astronomy+Pathshala+Blog";

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

function toHeadline(value: string | undefined, fallback = ""): string {
  if (!value || !value.trim()) return fallback;
  return value;
}

export function resolveLocalizedText(
  value: string | undefined,
  valueEn: string | undefined,
  valueBn: string | undefined,
  locale: Locale,
  fallback = "",
): string {
  const primary = toHeadline(value, "");
  if (primary) return primary;

  const preferred = locale === "bn" ? valueBn : valueEn;
  if (preferred && preferred.trim()) return preferred;

  const secondary = locale === "bn" ? valueEn : valueBn;
  if (secondary && secondary.trim()) return secondary;

  return fallback;
}

export function resolveLocalizedList(
  value: string[] | undefined,
  valueEn: string[] | undefined,
  valueBn: string[] | undefined,
  locale: Locale,
): string[] {
  if (Array.isArray(value) && value.length > 0) {
    return value;
  }

  const preferred = locale === "bn" ? valueBn : valueEn;
  if (Array.isArray(preferred) && preferred.length > 0) {
    return preferred;
  }

  const secondary = locale === "bn" ? valueEn : valueBn;
  if (Array.isArray(secondary) && secondary.length > 0) {
    return secondary;
  }

  return [];
}

export function plainText(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function excerpt(value: string | undefined, maxLength = 160): string {
  const text = plainText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function normalizeLanguage(value: string | undefined): string {
  if (value === "bn" || value === "en") return value;
  return value || "";
}

function normalizeLevel(value: string | undefined): string {
  if (!value) return "";
  return value;
}

function normalizeHighlightAnimation(
  value: string | undefined,
): CourseHighlightAnimation {
  if (value === "pulse" || value === "blink") {
    return value;
  }
  return "none";
}

export function getLocalizedCourseCategoryText(
  category: PublicCourseCategoryRecord,
  locale: Locale,
) {
  return {
    title: resolveLocalizedText(
      category.title,
      category.title_en,
      category.title_bn,
      locale,
      category.slug || category.id,
    ),
    description: resolveLocalizedText(
      category.description,
      category.description_en,
      category.description_bn,
      locale,
    ),
  };
}

export function getLocalizedBlogText(post: PublicBlogRecord, locale: Locale) {
  return {
    title: resolveLocalizedText(post.title, post.title_en, post.title_bn, locale),
    content: resolveLocalizedText(post.content, post.content_en, post.content_bn, locale),
    excerpt: resolveLocalizedText(
      post.excerpt,
      post.excerpt_en,
      post.excerpt_bn,
      locale,
    ),
  };
}

export function getLocalizedBlogBlocks(
  post: PublicBlogRecord,
  locale: Locale,
): PublicBlogContentBlock[] {
  if (Array.isArray(post.content_blocks) && post.content_blocks.length > 0) {
    const localizedBlocks: PublicBlogContentBlock[] = [];

    post.content_blocks.forEach((block) => {
        if (block.type === "image") {
          if (!block.url) {
            return;
          }

        localizedBlocks.push({
          type: "image",
          url: block.url,
          caption: block.caption || "",
        });
        return;
      }

      if (!block.value) {
        return;
      }

      localizedBlocks.push({
        type: block.type,
        value: block.value,
        level: block.level,
        rich_text: block.rich_text,
      });
    });

    return localizedBlocks;
  }

  const localized = getLocalizedBlogText(post, locale);
  return localized.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => ({
      type: "text" as const,
      value: paragraph,
    }));
}

export function getLocalizedEventText(event: PublicEventRecord, locale: Locale) {
  return {
    title: resolveLocalizedText(event.title, event.title_en, event.title_bn, locale),
    description: resolveLocalizedText(
      event.description,
      event.description_en,
      event.description_bn,
      locale,
    ),
  };
}

export function getLocalizedInstructorText(
  instructor: PublicInstructorRecord,
  locale: Locale,
) {
  return {
    name: resolveLocalizedText(
      instructor.name,
      instructor.name_en,
      instructor.name_bn,
      locale,
      instructor.name,
    ),
    bio: resolveLocalizedText(
      instructor.bio,
      instructor.bio_en,
      instructor.bio_bn,
      locale,
    ),
    specialization: resolveLocalizedText(
      instructor.specialization,
      instructor.specialization_en,
      instructor.specialization_bn,
      locale,
    ),
  };
}

export function getLocalizedTestimonialText(
  testimonial: PublicTestimonialRecord,
  locale: Locale,
) {
  return {
    role: resolveLocalizedText(
      testimonial.role,
      testimonial.role_en,
      testimonial.role_bn,
      locale,
    ),
    content: resolveLocalizedText(
      testimonial.content,
      testimonial.content_en,
      testimonial.content_bn,
      locale,
    ),
  };
}

export async function listPublicCourses(options?: {
  page?: number;
  pageSize?: number;
  lang?: Locale;
  categoryId?: string;
  priceType?: "free" | "paid";
  popularOnly?: boolean;
}): Promise<PublicCourseRecord[]> {
  const data = await fetchPublicApi<PaginatedResponse<PublicCourseRecord>>("/courses", {
    page: options?.page ?? 1,
    page_size: options?.pageSize ?? 100,
    lang: options?.lang ?? "en",
    category_id: options?.categoryId,
    price_type: options?.priceType,
    popular_only: options?.popularOnly ? "true" : undefined,
  });
  return data?.items ?? [];
}

export async function listPublicCourseCategories(
  lang: Locale = "en",
): Promise<PublicCourseCategoryRecord[]> {
  const data = await fetchPublicApi<PublicCourseCategoryRecord[]>(
    "/course-categories",
    { lang },
  );
  return data ?? [];
}

export async function getPublicCourseBySlug(
  slug: string,
  lang: Locale = "en",
): Promise<PublicCourseRecord | null> {
  return fetchPublicApi<PublicCourseRecord>(`/courses/${slug}`, { lang });
}

export async function getCourseCards(
  limit?: number,
  options?: {
    categoryId?: string;
    priceType?: "free" | "paid";
    lang?: Locale;
    popularOnly?: boolean;
  },
): Promise<Course[]> {
  const locale = options?.lang ?? "en";
  const courses = await listPublicCourses({
    pageSize: limit ?? 100,
    lang: locale,
    categoryId: options?.categoryId,
    priceType: options?.priceType,
    popularOnly: options?.popularOnly,
  });

  return courses.map((course) => ({
    id: course.id,
    title: resolveLocalizedText(
      course.title,
      course.title_en,
      course.title_bn,
      locale,
    ),
    slug: course.slug,
    shortDescription: resolveLocalizedText(
      course.subtitle,
      course.subtitle_en,
      course.subtitle_bn,
      locale,
    ),
    description: resolveLocalizedText(
      course.description,
      course.description_en,
      course.description_bn,
      locale,
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
    category: resolveLocalizedText(
      course.category_title,
      course.category_title_en,
      course.category_title_bn,
      locale,
      course.category_id || "",
    ),
    grade: course.grade || "",
    mode: "recorded",
    level: normalizeLevel(course.level),
    language: normalizeLanguage(course.language),
    totalLessons: typeof course.total_lessons === "number" ? course.total_lessons : 0,
    duration: course.duration || "",
    syllabus: [],
    isPopular: Boolean(course.is_popular),
    highlightAnimation: normalizeHighlightAnimation(course.highlight_animation),
  }));
}

export async function listPublicBlogs(options?: {
  page?: number;
  pageSize?: number;
  lang?: Locale;
  category?: string;
}): Promise<PublicBlogRecord[]> {
  const data = await fetchPublicApi<PaginatedResponse<PublicBlogRecord>>("/blogs", {
    page: options?.page ?? 1,
    page_size: options?.pageSize ?? 100,
    lang: options?.lang ?? "en",
    category: options?.category,
  });
  return data?.items ?? [];
}

export async function listPublicBlogCategories(): Promise<PublicBlogCategoryRecord[]> {
  const data = await fetchPublicApi<PublicBlogCategoryRecord[]>("/blogs/categories");
  return data ?? [];
}

export async function getPublicBlogBySlug(
  slug: string,
  lang: Locale = "en",
): Promise<PublicBlogRecord | null> {
  return fetchPublicApi<PublicBlogRecord>(`/blogs/${slug}`, { lang });
}

export async function getBlogCards(options?: {
  lang?: Locale;
  category?: string;
}): Promise<BlogPost[]> {
  const locale = options?.lang ?? "en";
  const posts = await listPublicBlogs({
    lang: locale,
    category: options?.category,
  });

  return posts.map((post) => {
    const localized = getLocalizedBlogText(post, locale);

    return {
      id: post.id,
      title: localized.title,
      slug: post.slug,
      excerpt: localized.excerpt || excerpt(localized.content),
      content: plainText(localized.content),
      authorName: post.author || "",
      publishedAt:
        post.published_at || post.updated_at || post.created_at || new Date().toISOString(),
      imageUrl:
        post.thumbnail ||
        post.featured_image ||
        DEFAULT_BLOG_IMAGE_URL,
      category: post.category || "",
      categorySlug: post.category_slug || "",
      readTime: post.read_time || "",
    };
  });
}

export async function listPublicEvents(options?: {
  page?: number;
  pageSize?: number;
  lang?: Locale;
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
  lang: Locale = "en",
): Promise<PublicEventRecord | null> {
  return fetchPublicApi<PublicEventRecord>(`/events/${slug}`, { lang });
}

export async function getEventCards(lang: Locale = "en"): Promise<Event[]> {
  const events = await listPublicEvents({ lang });
  return events.map((event) => {
    const localized = getLocalizedEventText(event, lang);

    return {
      id: event.id,
      slug: event.slug,
      title: localized.title,
      date: event.event_date || new Date().toISOString(),
      location: "",
      description: localized.description,
      imageUrl:
        event.banner ||
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
      type: "event",
      registrationLink: `/events/${event.slug}`,
    };
  });
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
  lang?: Locale;
}): Promise<PublicTestimonialRecord[]> {
  const data = await fetchPublicApi<PaginatedResponse<PublicTestimonialRecord>>(
    "/testimonials",
    {
      page: options?.page ?? 1,
      page_size: options?.pageSize ?? 100,
      lang: options?.lang ?? "en",
    },
  );

  return data?.items ?? [];
}

export async function getTeamMembers(
  limit?: number,
  locale: Locale = "en",
): Promise<TeamMember[]> {
  const instructors = await listPublicInstructors({
    pageSize: limit ?? 100,
  });

  return instructors.map((item, index) => {
    const localized = getLocalizedInstructorText(item, locale);

    return {
      id: item.id,
      name: localized.name,
      role: localized.specialization,
      bio: localized.bio,
      photoUrl: item.avatar || `https://i.pravatar.cc/400?img=${(index % 60) + 1}`,
      category: "",
      socialLinks: {},
    };
  });
}

export async function getTestimonials(
  limit?: number,
  locale: Locale = "en",
): Promise<Testimonial[]> {
  const testimonials = await listPublicTestimonials({
    pageSize: limit ?? 100,
    lang: locale,
  });

  return testimonials.map((item, index) => {
    const localized = getLocalizedTestimonialText(item, locale);

    return {
      id: item.id,
      name: item.student_name || "",
      role: localized.role,
      content: localized.content,
      photoUrl: `https://i.pravatar.cc/200?img=${(index % 60) + 1}`,
    };
  });
}

export function getLocalizedCourseText(
  course: PublicCourseRecord,
  locale: Locale,
) {
  return {
    title: resolveLocalizedText(course.title, course.title_en, course.title_bn, locale),
    subtitle: resolveLocalizedText(
      course.subtitle,
      course.subtitle_en,
      course.subtitle_bn,
      locale,
    ),
    description: resolveLocalizedText(
      course.description,
      course.description_en,
      course.description_bn,
      locale,
    ),
    categoryTitle: resolveLocalizedText(
      course.category_title,
      course.category_title_en,
      course.category_title_bn,
      locale,
    ),
    requirements: resolveLocalizedList(
      course.requirements,
      course.requirements_en,
      course.requirements_bn,
      locale,
    ),
    learningObjectives: resolveLocalizedList(
      course.learning_objectives,
      course.learning_objectives_en,
      course.learning_objectives_bn,
      locale,
    ),
    targetedAudience: resolveLocalizedList(
      course.targeted_audience,
      course.targeted_audience_en,
      course.targeted_audience_bn,
      locale,
    ),
    faqs:
      course.faqs?.map((faq) => ({
        question:
          locale === "bn"
            ? faq.question_bn || faq.question_en
            : faq.question_en || faq.question_bn || "",
        answer:
          locale === "bn"
            ? faq.answer_bn || faq.answer_en
            : faq.answer_en || faq.answer_bn || "",
      })) ?? [],
  };
}





