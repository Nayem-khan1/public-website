import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { getPublicBlogBySlug } from "@/lib/public-api";
import { formatDate, pickLocalizedText } from "@/lib/i18n";
import { getServerLocale, getServerTranslator } from "@/lib/i18n-server";
import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const locale = getServerLocale();
    const post = await getPublicBlogBySlug(slug, locale);
    if (!post) return {};

    const title = pickLocalizedText({
        locale,
        primary: post.title,
        en: post.title_en,
        bn: post.title_bn,
        fallback: "Untitled Post",
    });
    const description = pickLocalizedText({
        locale,
        primary: post.content,
        en: post.content_en,
        bn: post.content_bn,
        fallback: "",
    });

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
    };
}

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const locale = getServerLocale();
    const t = getServerTranslator(locale);
    const post = await getPublicBlogBySlug(slug, locale);
    if (!post) notFound();

    const postTitle = pickLocalizedText({
        locale,
        primary: post.title,
        en: post.title_en,
        bn: post.title_bn,
        fallback: "Untitled Post",
    });
    const postContent = pickLocalizedText({
        locale,
        primary: post.content,
        en: post.content_en,
        bn: post.content_bn,
        fallback: "",
    }).trim();
    const postDate = post.updated_at ?? post.created_at ?? new Date().toISOString();

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-slate-900">
                <img
                    src={
                        post.featured_image ||
                        "https://images.unsplash.com/photo-1499750310159-5b5f09692c6a?auto=format&fit=crop&q=80&w=2000"
                    }
                    alt={postTitle}
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900" />
                <div className="container relative mx-auto px-4 md:px-6">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" /> {t("common.labels.back_to_blog")}
                    </Link>
                    <div className="max-w-3xl">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">{post.category || t("common.blog.category_fallback")}</span>
                        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">{postTitle}</h1>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                            <div className="flex items-center gap-2"><User className="w-4 h-4" />{post.author || t("common.blog.author_fallback")}</div>
                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{formatDate(new Date(postDate), locale, { year: "numeric", month: "long", day: "2-digit" })}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="max-w-3xl mx-auto prose prose-slate prose-lg">
                    {postContent.split("\n\n").filter(Boolean).map((p, i) => (
                        <p key={i} className="text-slate-600 leading-relaxed mb-6">{p}</p>
                    ))}
                    <div className="mt-12 pt-8 border-t border-slate-100 not-prose">
                        <p className="text-sm text-slate-500 font-medium">{t("common.blog.share")}</p>
                        <div className="flex gap-3 mt-3">
                            {["Twitter", "Facebook", "LinkedIn"].map((s) => (
                                <a key={s} href="#" className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium hover:bg-primary hover:text-white transition-colors">{s}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
