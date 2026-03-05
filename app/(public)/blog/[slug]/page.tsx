import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { getPublicBlogBySlug } from "@/lib/public-api";

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getPublicBlogBySlug(slug, "en");
    if (!post) notFound();

    const postTitle = post.title ?? post.title_en ?? "Untitled Post";
    const postContent = (post.content ?? post.content_en ?? "").trim();
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
                        <ArrowLeft className="w-4 h-4" /> Back to Blog
                    </Link>
                    <div className="max-w-3xl">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">{post.category || "Insights"}</span>
                        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">{postTitle}</h1>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                            <div className="flex items-center gap-2"><User className="w-4 h-4" />{post.author || "Editorial Team"}</div>
                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{format(new Date(postDate), "MMMM dd, yyyy")}</div>
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
                        <p className="text-sm text-slate-500 font-medium">Share this article</p>
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
