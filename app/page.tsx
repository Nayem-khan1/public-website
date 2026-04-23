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
import { VideoPlaylistSection } from "@/components/home/VideoPlaylistSection";
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
      <main className="relative overflow-hidden bg-[#000000]">
        {/* Global Top Red Glow Curve */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-gradient-to-b from-red-600/40 via-red-800/10 to-transparent blur-[120px] rounded-[100%] pointer-events-none mix-blend-screen" />
        {/* Ambient Subtle Stars/Glows */}
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] blur-[150px] bg-red-900/20 rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] blur-[150px] bg-green-900/10 rounded-full pointer-events-none mix-blend-screen" />
        <HeroSection />
        <CoursesSection featuredCourses={popularCourses} />
        <HowItWorksSection />
        <WhySection />
        {/* <LiveClassesSection /> */}
        <ImpactSection />
        <InstructorsSection instructors={instructors} />
        <TestimonialsSection testimonials={testimonials} />
        <GallerySection />
        <VideoPlaylistSection />
        <NewsletterSection />
        <CTASection />
        <NewsSection />
      </main>
      <Footer />
    </>
  );
}
