export type CourseSyllabusItem = {
  title: string;
  lessons: number;
  duration: string;
  topics: string[];
};

export type CourseHighlightAnimation = "none" | "pulse" | "blink";

export interface Course {
  id: string | number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnailUrl: string;
  instructorId: string | number;
  price: number;
  isFree: boolean;
  originalPrice: number | null;
  category: string;
  grade: string;
  mode: string;
  level: string;
  language: string;
  totalLessons: number;
  duration: string;
  syllabus: CourseSyllabusItem[];
  isPopular: boolean;
  highlightAnimation: CourseHighlightAnimation;
}

export type TeamMember = {
  id: string | number;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  category: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
};

export type Event = {
  id: string | number;
  title: string;
  slug: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  type: string;
  registrationLink?: string;
};

export type Testimonial = {
  id: string | number;
  name: string;
  role: string;
  content: string;
  photoUrl?: string;
};

export type BlogPost = {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  publishedAt: string;
  imageUrl: string;
  category?: string;
  categorySlug?: string;
  readTime?: string;
};
