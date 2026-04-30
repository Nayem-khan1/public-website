import { getBlogCards, listPublicBlogCategories } from "@/lib/public-api";
import type { Metadata } from "next";
import {
  getLocaleAndTranslations,
  getLocalizedMetadataLocale,
  getRequestLocale,
} from "@/lib/i18n/server";
import {
  buildMetadataAlternates,
  getLocalizedAbsoluteUrl,
} from "@/lib/i18n/seo";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogCard } from "@/components/blog/BlogCard";
import { PageHeader } from "@/components/PageHeader";

function getSingleQueryValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

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

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getRequestLocale();
  const { t } = await getLocaleAndTranslations(locale);
  const resolvedSearchParams = await searchParams;
  const selectedCategory = getSingleQueryValue(resolvedSearchParams.category)?.trim() || "";

  const [blogPosts, categories] = await Promise.all([
    getBlogCards({
      lang: locale,
      category: selectedCategory || undefined,
    }),
    listPublicBlogCategories(),
  ]);

  const featuredPost = blogPosts[0];
  const sidebarFeaturedPost = blogPosts[1]; // Using second post for sidebar if available
  const remainingPosts = featuredPost ? blogPosts.slice(1) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/20 pb-24">
      <PageHeader
        title={t("blog.title")}
        subtitle={t("blog.subtitle")}
        bgImage="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2000"
      />

      <div className="container mx-auto px-4 md:px-6 pt-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Sidebar */}
          <BlogSidebar 
            categories={categories} 
            selectedCategory={selectedCategory} 
            t={t} 
            locale={locale}
            featuredPost={sidebarFeaturedPost}
          />

          {/* Main Content Area */}
          <main className="flex-1 w-full min-w-0 space-y-12">
            {!featuredPost ? (
              <div className="py-24 text-center border border-dashed border-slate-300 rounded-[2rem] bg-white shadow-sm">
                <p className="text-xl font-display font-semibold text-slate-900 mb-2">
                  {selectedCategory ? t("blog.noPostsFiltered") : t("blog.noPosts")}
                </p>
                <p className="text-slate-500">{t("blog.subtitle")}</p>
              </div>
            ) : (
              <>
                <FeaturedPost post={featuredPost} locale={locale} t={t} />

                {remainingPosts.length > 0 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-secondary rounded-full block"></span>
                      Latest Articles
                    </h2>
                    
                    <div className="grid gap-8 md:grid-cols-2">
                      {remainingPosts.map((post) => (
                        <BlogCard key={post.id} post={post} locale={locale} t={t} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
