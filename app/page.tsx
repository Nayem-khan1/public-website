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

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <HeroSection />
        <WhySection />
        <CoursesSection />
        <LiveClassesSection />
        <ImpactSection />
        <InstructorsSection />
        <TestimonialsSection />
        <NewsletterSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
