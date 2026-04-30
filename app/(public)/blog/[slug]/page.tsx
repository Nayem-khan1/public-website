import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Facebook, Twitter, Link as LinkIcon, Share2 } from "lucide-react";
import type { Metadata } from "next";
import {
  DEFAULT_BLOG_IMAGE_URL,
  getLocalizedBlogBlocks,
  getLocalizedBlogText,
  getPublicBlogBySlug,
} from "@/lib/public-api";
import {
  getLocaleAndTranslations,
  getLocalizedMetadataLocale,
  getRequestLocale,
} from "@/lib/i18n/server";
import {
  buildMetadataAlternates,
  getLocalizedAbsoluteUrl,
} from "@/lib/i18n/seo";
import { AuthorInfo } from "@/components/blog/AuthorInfo";
import { BlogContentRenderer } from "@/components/blog/BlogContentRenderer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { slug } = await params;
  const post = await getPublicBlogBySlug(slug, locale);
  const { t } = await getLocaleAndTranslations(locale);

  if (!post) {
    return { title: t("blog.untitled") };
  }

  const localized = getLocalizedBlogText(post, locale);
  const title = localized.title || t("blog.untitled");
  const description = localized.excerpt || localized.content.slice(0, 160);

  return {
    title,
    description,
    alternates: buildMetadataAlternates(`/blog/${slug}`, locale),
    openGraph: {
      title,
      description,
      locale: getLocalizedMetadataLocale(locale),
      url: getLocalizedAbsoluteUrl(`/blog/${slug}`, locale),
      images: post.thumbnail || post.featured_image
        ? [{ url: post.thumbnail || post.featured_image || DEFAULT_BLOG_IMAGE_URL }]
        : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getRequestLocale();
  const { t } = await getLocaleAndTranslations(locale);
  const { slug } = await params;
  const post = await getPublicBlogBySlug(slug, locale);

  if (!post) notFound();

  const localized = getLocalizedBlogText(post, locale);
  const contentBlocks = getLocalizedBlogBlocks(post, locale);
  const postTitle = localized.title || t("blog.untitled");
  const postDate = post.published_at || post.updated_at || post.created_at || new Date().toISOString();
  const postImage = post.thumbnail || post.featured_image || DEFAULT_BLOG_IMAGE_URL;
  const postUrl = getLocalizedAbsoluteUrl(`/blog/${slug}`, locale);

  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(postTitle);
  const shareLinks = [
    { label: "Twitter", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "Copy Link", icon: LinkIcon, href: "#" },
  ];

  return (
    <div className="min-h-screen bg-white relative font-sans selection:bg-primary/20 pb-32">
      {/* Dark background block to support the global white-text Navbar */}
      <div className="w-full h-20 bg-slate-700 shadow-sm relative z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
      </div>

      <main className="pt-12 md:pt-16 px-4 md:px-6 relative z-10">
        <article className="max-w-[780px] mx-auto">
          {/* Header */}
          <header className="mb-14">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-10"
            >
              <ArrowLeft className="size-4" />
              {t("blog.backToBlog")}
            </Link>

            <div className="space-y-8">
              {post.category && (
                <div>
                  <span className="inline-flex items-center px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 rounded-full">
                    {post.category}
                  </span>
                </div>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                {postTitle}
              </h1>

              <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-light">
                {localized.excerpt}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 pb-8 border-y border-slate-100">
                <AuthorInfo
                  authorName={post.author}
                  authorAvatar={post.author_avatar}
                  publishedAt={postDate}
                  readTime={post.read_time}
                  locale={locale}
                  t={t}
                />

                <div className="flex items-center gap-2">
                  {shareLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target={social.href !== "#" ? "_blank" : undefined}
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
                      aria-label={social.label}
                    >
                      <social.icon className="size-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <div className="mb-20 -mx-4 sm:mx-0">
            <div className="relative aspect-[16/9] sm:aspect-[2/1] sm:rounded-[2.5rem] overflow-hidden bg-slate-50 shadow-md border border-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={postImage}
                alt={postTitle}
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Body Content */}
          <BlogContentRenderer blocks={contentBlocks} postTitle={postTitle} />

          {/* Footer Share */}
          <footer className="mt-24 pt-12 border-t border-slate-100 flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Share2 className="size-6" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Enjoyed this post?</h3>
              <p className="text-lg text-slate-500 max-w-sm mx-auto">Share it with your network and help us spread the knowledge.</p>
            </div>

            <div className="flex items-center gap-4 mt-4">
              {shareLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href !== "#" ? "_blank" : undefined}
                  rel="noreferrer"
                  className="px-6 py-3 rounded-full border border-slate-200 bg-white flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 shadow-sm transition-all hover:shadow"
                >
                  <social.icon className="size-4" />
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}
