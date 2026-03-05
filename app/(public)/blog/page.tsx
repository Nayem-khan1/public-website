import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { getBlogCards } from "@/lib/public-api";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog & Articles",
    description:
        "Explore the latest insights on astrophysics, space missions, and astronomy education from Astronomy Pathshala.",
};

export default async function BlogPage() {
    const blogPosts = await getBlogCards();

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <PageHeader
                title="Astronomy Insights"
                subtitle="Explore the latest in astrophysics, space missions, and educational guides."
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
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                    <span className="font-semibold text-primary uppercase tracking-wide">
                                        {post.category || "Insights"}
                                    </span>
                                    <span className="text-slate-400">-</span>
                                    <span>
                                        {format(new Date(post.publishedAt), "MMM dd, yyyy")}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight hover:text-primary transition-colors">
                                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                </h3>
                                <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                    {post.excerpt}
                                </p>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                                >
                                    Read More <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
