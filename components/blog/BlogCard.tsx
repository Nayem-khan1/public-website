import Link from "next/link";
import { Calendar, Clock3, ArrowRight, User } from "lucide-react";
import { formatDate } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/config";

export interface BlogPostItem {
  id: string | number;
  slug: string;
  title?: string;
  excerpt?: string;
  imageUrl?: string;
  category?: string;
  authorName?: string;
  publishedAt?: string | null;
  readTime?: string;
}

interface BlogCardProps {
  post: BlogPostItem;
  locale: Locale;
  t: (key: string) => string;
}

export function BlogCard({ post, locale, t }: BlogCardProps) {
  const publishedAt = post.publishedAt ?? new Date().toISOString();

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-200">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt={post.title || t("blog.untitled")}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {post.category && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary bg-white/95 backdrop-blur-md rounded-full shadow-sm">
                {post.category}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow p-6">
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {formatDate(publishedAt, locale, { month: "short", day: "2-digit", year: "numeric" })}
            </span>
            {post.authorName && (
              <span className="flex items-center gap-1.5">
                <User className="size-3.5" />
                {post.authorName}
              </span>
            )}
            {post.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-3.5" />
                {post.readTime}
              </span>
            )}
          </div>

          <h3 className="text-xl font-display font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors mb-3">
            {post.title || t("blog.untitled")}
          </h3>
          
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-6 flex-grow">
            {post.excerpt}
          </p>

          <div className="mt-auto flex items-center text-primary text-sm font-bold group-hover:gap-2 transition-all">
            {t("blog.readMore")}
            <ArrowRight className="size-4 ml-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}
