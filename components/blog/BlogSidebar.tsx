import Link from "next/link";
import { BlogSearch } from "./BlogSearch";
import { BlogCard } from "./BlogCard";

import { BlogPostItem } from "./BlogCard";

export interface CategoryItem {
  slug: string;
  title: string;
}

interface BlogSidebarProps {
  categories: CategoryItem[];
  selectedCategory: string;
  t: (key: string) => string;
  locale: string;
  featuredPost?: BlogPostItem;
}

export function BlogSidebar({ categories, selectedCategory, t, locale, featuredPost }: BlogSidebarProps) {
  return (
    <aside className="space-y-10 lg:sticky lg:top-28 lg:self-start w-full lg:w-[320px] xl:w-[360px] flex-shrink-0">
      {/* Search Input */}
      <div>
        <BlogSearch placeholder={t("common.search") || "Search articles..."} />
      </div>

      {/* Categories Widget */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
        <h3 className="text-lg font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full block"></span>
          {t("blog.categories")}
        </h3>
        <div className="flex flex-col gap-2">
          <Link
            href="/blog"
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              !selectedCategory
                ? "bg-secondary text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
            }`}
          >
            <span>{t("blog.allCategories")}</span>
          </Link>

          {categories.map((category) => {
            const isActive = selectedCategory === category.slug;
            return (
              <Link
                key={category.slug}
                href={`/blog?category=${category.slug}`}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-secondary text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                }`}
              >
                <span>{category.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Popular Tags Widget (Optional/Static for now) */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
        <h3 className="text-lg font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-orange-400 rounded-full block"></span>
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Education", "Technology", "Learning", "Science", "Updates", "Career"].map((tag) => (
            <Link
              key={tag}
              href={`/blog`}
              className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Editor's Pick / Featured Sidebar Post */}
      {featuredPost && (
        <div className="hidden lg:block space-y-4">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full block"></span>
            Editor&apos;s Pick
          </h3>
          <BlogCard post={featuredPost} locale={locale} t={t} />
        </div>
      )}
    </aside>
  );
}
