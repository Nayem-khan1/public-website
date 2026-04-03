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
    <section className="relative overflow-hidden py-24 bg-white">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="container relative mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-secondary font-semibold tracking-wider text-sm uppercase mb-3 block">
            {eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600 mb-8">
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
          <div className="flex min-h-[300px] items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center mb-16">
            <div className="max-w-md space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Telescope className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{emptyTitle}</h3>
              <p className="text-sm leading-6 text-slate-500">{emptyBody}</p>
            </div>
          </div>
        )}

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-slate-900 px-8 text-white hover:bg-primary transition-colors duration-300 shadow-lg"
          >
            <Link href="/courses">
              {t("home.courses.viewAllCourses")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
