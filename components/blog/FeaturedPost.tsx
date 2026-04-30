import Link from "next/link";
import { Calendar, Clock3, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/i18n/format";

import { BlogPostItem } from "./BlogCard";

interface FeaturedPostProps {
  post: BlogPostItem;
  locale: string;
  t: (key: string) => string;
}

export function FeaturedPost({ post, locale, t }: FeaturedPostProps) {
  if (!post) return null;

  return (
    <Link href={`/blog/${post.slug}`} className="group block mb-16">
      <article className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-slate-200">
        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {post.category && (
            <div className="absolute top-6 left-6 z-10">
              <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary backdrop-blur-md rounded-full shadow-md">
                {post.category}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col justify-center px-4 py-8 lg:pr-12 lg:py-12">
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {formatDate(post.publishedAt, locale, { month: "long", day: "2-digit", year: "numeric" })}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-4" />
                {post.readTime}
              </span>
            )}
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 leading-tight mb-5 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed line-clamp-3 mb-8">
            {post.excerpt}
          </p>

          <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-secondary text-white font-semibold text-sm transition-colors group-hover:bg-primary self-start">
            {t("blog.readMore")}
            <ArrowRight className="size-4" />
          </div>
        </div>
      </article>
    </Link>
  );
}
