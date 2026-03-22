import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ArrowRight } from "lucide-react";
import { getBlogCards } from "@/lib/public-api";
import type { Metadata } from "next";
import {
  getLocaleAndTranslations,
  getLocalizedMetadataLocale,
  getRequestLocale,
} from "@/lib/i18n/server";
import { formatDate } from "@/lib/i18n/format";
import {
  buildMetadataAlternates,
  getLocalizedAbsoluteUrl,
} from "@/lib/i18n/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getLocaleAndTranslations();

  return {
    title: t("blog.title"),
    description: t("blog.subtitle"),
    alternates: buildMetadataAlternates("/blog", locale),
    openGraph: {
      title: t("blog.title"),
      description: t("blog.subtitle"),
      locale: getLocalizedMetadataLocale(locale),
      url: getLocalizedAbsoluteUrl("/blog", locale),
    },
  };
}

export default async function BlogPage() {
  const locale = await getRequestLocale();
  const { t } = await getLocaleAndTranslations(locale);
  const blogPosts = await getBlogCards(locale);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PageHeader
        title={t("blog.title")}
        subtitle={t("blog.subtitle")}
        bgImage="https://images.unsplash.com/photo-1499750310159-5b5f09692c6a?auto=format&fit=crop&q=80&w=2000"
      />

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full border border-slate-100 hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title || t("blog.untitled")}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-primary uppercase tracking-wide">
                    {post.category || t("common.insights")}
                  </span>
                  <span className="text-slate-400">-</span>
                  <span>
                    {formatDate(post.publishedAt, locale, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title || t("blog.untitled")}
                  </Link>
                </h3>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                >
                  {t("blog.readMore")} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
