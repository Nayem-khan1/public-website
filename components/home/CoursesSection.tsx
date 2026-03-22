"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/CourseCard";
import type { Course } from "@/data/types";
import { useAppTranslation } from "@/contexts/LanguageContext";

interface CoursesSectionProps {
  featuredCourses: Course[];
}

export function CoursesSection({ featuredCourses }: CoursesSectionProps) {
  const { t } = useAppTranslation();

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 relative overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
              {t("home.courses.eyebrow")}
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              {t("home.courses.title")}
            </h2>
            <p className="text-lg text-slate-600">{t("home.courses.subtitle")}</p>
          </motion.div>
          <Button
            asChild
            size="lg"
            className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-lg shadow-primary/25"
          >
            <Link href="/courses">
              {t("home.courses.viewAllCourses")} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
