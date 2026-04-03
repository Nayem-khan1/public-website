import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { WhySection } from "@/components/home/WhySection";
import { CoursesSection } from "@/components/home/CoursesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { LiveClassesSection } from "@/components/home/LiveClassesSection";
import { ImpactSection } from "@/components/home/ImpactSection";
import { InstructorsSection } from "@/components/home/InstructorsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsSection } from "@/components/home/NewsSection";
import { GallerySection } from "@/components/home/GallerySection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { CTASection } from "@/components/home/CTASection";
import {
  getCourseCards,
  getTeamMembers,
  getTestimonials,
} from "@/lib/public-api";
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

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getLocaleAndTranslations();

  return {
    title: t("meta.siteTitle"),
    description: t("meta.siteDescription"),
    alternates: buildMetadataAlternates("/", locale),
    openGraph: {
      title: t("meta.siteTitle"),
      description: t("meta.siteDescription"),
      locale: getLocalizedMetadataLocale(locale),
      url: getLocalizedAbsoluteUrl("/", locale),
    },
  };
}

export default async function HomePage() {
  const locale = await getRequestLocale();
  const [popularCourses, teamMembers, testimonials] = await Promise.all([
    getCourseCards(4, { lang: locale, popularOnly: true }),
    getTeamMembers(6, locale),
    getTestimonials(6, locale),
  ]);

  const instructors = teamMembers.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    photoUrl: member.photoUrl,
    credential: member.category,
  }));

  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <HeroSection />
        <CoursesSection featuredCourses={popularCourses} />
        <HowItWorksSection />
        <WhySection />
        <LiveClassesSection />
        <ImpactSection />
        <InstructorsSection instructors={instructors} />
        <TestimonialsSection testimonials={testimonials} />
        <GallerySection />
        <NewsletterSection />
        <CTASection />
        <NewsSection />
      </main>
      <Footer />
    </>
  );
}
