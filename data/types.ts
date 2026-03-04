export type CourseSyllabusItem = {
  title: string;
  lessons: number;
  duration: string;
  topics: string[];
};

export interface Course {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnailUrl: string;
  instructorId: number;
  price: number;
  isFree: boolean;
  originalPrice: number | null;
  category: string;
  grade: "Class 6-10" | "Class 8-12" | "Class 11-12" | "University" | "All";
  mode: "Live" | "Recorded";
  level: "Beginner" | "Intermediate" | "Advanced";
  language: "Bangla" | "English";
  totalLessons: number;
  duration: string;
  syllabus: CourseSyllabusItem[];
}

export type TeamMember = {
  id: number;
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
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  type: string;
  registrationLink?: string;
};

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  content: string;
  photoUrl?: string;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  publishedAt: string;
  imageUrl: string;
  category?: string;
};
