"use client";

import { useRef, useEffect } from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Telescope, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/CourseCard";
import type { Course } from "@/data/types";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";

interface CoursesSectionProps {
  featuredCourses: Course[];
}

export function CoursesSection({ featuredCourses }: CoursesSectionProps) {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();

  const emptyTitle = locale === "bn" ? "কোনো কোর্স পাওয়া যায়নি" : "No courses found";
  const emptyBody = locale === "bn"
    ? "বর্তমানে এই বিভাগে কোনো কোর্স উপলব্ধ নেই। পরে আবার চেক করুন।"
    : "There are currently no courses available in this section. Please check back later.";

  const title = locale === "bn" ? "জনপ্রিয় কোর্সসমূহ" : "Popular Courses";
  const eyebrow = locale === "bn" ? "শিক্ষার্থীদের প্রথম পছন্দ" : "Learners' Top Choice";
  const subtitle = locale === "bn"
    ? "আমাদের সর্বাধিক বিক্রিত ও জনপ্রিয় কোর্সগুলো থেকে আপনার পছন্দের স্কিল বেছে নিন।"
    : "Choose your desired skill from our best-selling and most popular programs.";

  // Extract unique categories from featured courses
  const categories = Array.from(new Set(featuredCourses.map(c => c.category))).filter(Boolean);

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const attachDrag = (slider: HTMLElement | null) => {
      if (!slider) return;
      let isDown = false;
      let startX: number;
      let scrollLeft: number;

      const onMouseDown = (e: MouseEvent) => {
        isDown = true;
        slider.style.cursor = "grabbing";
        slider.style.scrollSnapType = "none";
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      };

      const onMouseLeave = () => {
        if (!isDown) return;
        isDown = false;
        slider.style.cursor = "grab";
        slider.style.scrollSnapType = "x mandatory";
      };

      const onMouseUp = () => {
        if (!isDown) return;
        isDown = false;
        slider.style.cursor = "grab";
        slider.style.scrollSnapType = "x mandatory";
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
      };

      slider.style.cursor = "grab";
      slider.addEventListener("mousedown", onMouseDown);
      slider.addEventListener("mouseleave", onMouseLeave);
      slider.addEventListener("mouseup", onMouseUp);
      slider.addEventListener("mousemove", onMouseMove);

      return () => {
        slider.removeEventListener("mousedown", onMouseDown);
        slider.removeEventListener("mouseleave", onMouseLeave);
        slider.removeEventListener("mouseup", onMouseUp);
        slider.removeEventListener("mousemove", onMouseMove);
      };
    };

    const cleanup = attachDrag(sliderRef.current);
    return () => {
      cleanup?.();
    };
  }, []);

  const slideLeft = () => {
    if (sliderRef.current) {
      const cardWidth = window.innerWidth < 768 ? window.innerWidth * 0.85 : 350;
      sliderRef.current.scrollBy({ left: -(cardWidth + 24), behavior: "smooth" });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      const cardWidth = window.innerWidth < 768 ? window.innerWidth * 0.85 : 350;
      sliderRef.current.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 relative overflow-hidden z-10 w-full mt-8">
      <div className="container relative mx-auto px-4 md:px-6 mb-12">
        <div className="relative rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 border-t-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/5 p-6 md:p-10 lg:p-14 overflow-hidden group transition-all duration-500 hover:border-cyan-500/30">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-10 md:mb-16"
          >
            <span className="text-secondary font-semibold tracking-wider text-sm uppercase mb-3 block">
              {eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-lg text-white/70 mb-8">
              {subtitle}
            </p>
          </motion.div>

          <div className="relative w-full overflow-visible">
            {/* Arrow Navigation (Hidden on very small screens since they rely on touch) */}
            {featuredCourses.length > 0 && (
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-40 hidden sm:flex justify-between pointer-events-none -mx-4 md:-mx-8">
                <button
                  onClick={slideLeft}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-md hover:bg-primary/90 hover:scale-110 transition-all shadow-xl pointer-events-auto"
                >
                  <ChevronLeft className="w-7 h-7 -ml-1" />
                </button>
                <button
                  onClick={slideRight}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-md hover:bg-primary/90 hover:scale-110 transition-all shadow-xl pointer-events-auto"
                >
                  <ChevronRight className="w-7 h-7 -mr-1" />
                </button>
              </div>
            )}

            {/* Inner shadows specifically targeted inside the glass card edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[#0d101b]/90 to-transparent z-30 pointer-events-none rounded-l-3xl" />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-[#0d101b]/90 to-transparent z-30 pointer-events-none rounded-r-3xl" />

            {featuredCourses.length > 0 ? (
              <div
                ref={sliderRef}
                className="flex overflow-x-auto pb-8 pt-4 px-4 md:px-6 gap-4 md:gap-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-20"
              >
                {featuredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="w-[85vw] sm:w-[320px] md:w-[350px] lg:w-[380px] shrink-0 snap-center"
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center rounded-[2rem] border border-blue-500/30 bg-[#050505] shadow-[0_0_40px_rgba(59,130,246,0.15)] p-8 text-center mb-16 relative overflow-hidden mx-4">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                <div className="max-w-md space-y-3 relative z-10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <Telescope className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{emptyTitle}</h3>
                  <p className="text-sm leading-6 text-white/70">{emptyBody}</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-6 z-30 relative">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary px-8 text-white hover:bg-primary/90 transition-all duration-500 shadow-[0_0_40px_rgba(241,2,76,0.25)] hover:shadow-[0_0_60px_rgba(241,2,76,0.35)] hover:scale-[1.03]"
            >
              <Link href="/courses">
                {t("home.courses.viewAllCourses")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
