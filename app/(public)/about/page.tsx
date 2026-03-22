import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import {
  getLocaleAndTranslations,
  getLocalizedMetadataLocale,
} from "@/lib/i18n/server";
import {
  buildMetadataAlternates,
  getLocalizedAbsoluteUrl,
} from "@/lib/i18n/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getLocaleAndTranslations();

  return {
    title: t("about.metaTitle"),
    description: t("about.metaDescription"),
    alternates: buildMetadataAlternates("/about", locale),
    openGraph: {
      title: t("about.metaTitle"),
      description: t("about.metaDescription"),
      locale: getLocalizedMetadataLocale(locale),
      url: getLocalizedAbsoluteUrl("/about", locale),
    },
  };
}

export default async function AboutPage() {
  const { t } = await getLocaleAndTranslations();
  const highlights = [
    t("about.highlight1"),
    t("about.highlight2"),
    t("about.highlight3"),
    t("about.highlight4"),
  ];
  const stats = [
    { value: "5000+", label: t("about.studentsTaught") },
    { value: "120+", label: t("about.coursesConducted") },
    { value: "50+", label: t("about.olympiadWinners") },
    { value: "6+", label: t("about.yearsOfImpact") },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader
        title={t("about.headerTitle")}
        subtitle={t("about.headerSubtitle")}
        bgImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2000"
      />

      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <span className="text-primary font-bold uppercase tracking-wider text-sm">
              {t("about.storyEyebrow")}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mt-2 mb-6">
              {t("about.storyTitle")}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg">
              {t("about.storyParagraph1")}
            </p>
            <p className="text-slate-600 leading-relaxed mb-8 text-lg">
              {t("about.storyParagraph2")}
            </p>

            <div className="space-y-4">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3">
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
                alt={t("about.imageAlt")}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-slate-100 rounded-full -z-10" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full -z-10" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </h3>
              <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">
              {t("about.mission")}
            </h3>
            <p className="text-slate-600 leading-relaxed">{t("about.missionText")}</p>
          </div>
          <div className="bg-slate-900 p-10 rounded-3xl text-white">
            <h3 className="text-2xl font-display font-bold mb-4 text-white">
              {t("about.vision")}
            </h3>
            <p className="text-slate-300 leading-relaxed">{t("about.visionText")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
