import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { getServerLocale, getServerTranslator } from "@/lib/i18n-server";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about Astronomy Pathshala — Bangladesh's pioneering astronomy education platform. Our mission, vision, and story.",
};

export default function AboutPage() {
    const locale = getServerLocale();
    const t = getServerTranslator(locale);

    return (
        <div className="min-h-screen bg-white pb-20">
            <PageHeader
                title={t("common.about.page_title")}
                subtitle={t("common.about.page_subtitle")}
                bgImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2000"
            />

            <div className="container mx-auto px-4 md:px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <span className="text-primary font-bold uppercase tracking-wider text-sm">
                            {t("common.about.story_label")}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mt-2 mb-6">
                            {t("common.about.story_title")}
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                            {t("common.about.story_p1")}
                        </p>
                        <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                            {t("common.about.story_p2")}
                        </p>

                        <div className="space-y-4">
                            {[
                                t("common.about.highlights.h1"),
                                t("common.about.highlights.h2"),
                                t("common.about.highlights.h3"),
                                t("common.about.highlights.h4"),
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    <span className="text-slate-800 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&q=80&w=1000"
                                alt="Astronomy Workshop"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-slate-100 rounded-full -z-10" />
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full -z-10" />
                    </div>
                </div>

                {/* Impact Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
                    {[
                        { value: t("common.about.impact.s1_value"), label: t("common.about.impact.s1_label") },
                        { value: t("common.about.impact.s2_value"), label: t("common.about.impact.s2_label") },
                        { value: t("common.about.impact.s3_value"), label: t("common.about.impact.s3_label") },
                        { value: t("common.about.impact.s4_value"), label: t("common.about.impact.s4_label") },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100"
                        >
                            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
                        <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">
                            {t("common.about.mission_title")}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            {t("common.about.mission_text")}
                        </p>
                    </div>
                    <div className="bg-slate-900 p-10 rounded-3xl text-white">
                        <h3 className="text-2xl font-display font-bold mb-4 text-white">
                            {t("common.about.vision_title")}
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                            {t("common.about.vision_text")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
