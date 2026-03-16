import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { WhySection } from "@/components/home/WhySection";
import { CoursesSection } from "@/components/home/CoursesSection";
import { LiveClassesSection } from "@/components/home/LiveClassesSection";
import { ImpactSection } from "@/components/home/ImpactSection";
import { InstructorsSection } from "@/components/home/InstructorsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { CTASection } from "@/components/home/CTASection";
import { getCourseCards, getTeamMembers, getTestimonials } from "@/lib/public-api";
import { getServerLocale } from "@/lib/i18n-server";

export default async function HomePage() {
  const locale = getServerLocale();
  const [featuredCourses, teamMembers, testimonials] = await Promise.all([
    getCourseCards(3, { lang: locale }),
    getTeamMembers(6, { lang: locale }),
    getTestimonials(6, { lang: locale }),
  ]);

  const instructors = teamMembers.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    credential: member.category,
  }));

  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <HeroSection />
        <WhySection />
        <CoursesSection featuredCourses={featuredCourses} />
        <LiveClassesSection />
        <ImpactSection />
        <InstructorsSection instructors={instructors} />
        <TestimonialsSection testimonials={testimonials} />
        <NewsletterSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
