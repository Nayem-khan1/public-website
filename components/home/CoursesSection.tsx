"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Telescope } from "lucide-react";
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

  return (
    <section className="py-12 relative overflow-hidden z-10">
      <div className="container relative mx-auto px-4 md:px-6 mb-12">
        <div className="relative rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 border-t-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/5 p-8 md:p-14 overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
          
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
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

        {featuredCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-16">
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center rounded-[2rem] border border-blue-500/30 bg-[#050505] shadow-[0_0_40px_rgba(59,130,246,0.15)] p-8 text-center mb-16 relative overflow-hidden">
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

        <div className="text-center">
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
