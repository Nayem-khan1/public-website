"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Telescope, TrendingUp } from "lucide-react";
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

  const popularBadge = locale === "bn" ? "জনপ্রিয় পিকস" : "Popular Picks";
  const spotlightTitle = locale === "bn" ? "হোমপেজে শুধু নির্বাচিত জনপ্রিয় কোর্স" : "Only the most popular programs reach the landing page spotlight";
  const spotlightBody = locale === "bn"
    ? "অ্যাডমিন প্যানেল থেকে জনপ্রিয় হিসেবে চিহ্নিত কোর্সগুলো এখানে দেখানো হয়। প্রতিটি কার্ডে দৃশ্যমান সিগন্যাল থাকে, যাতে দর্শক দ্রুত সেরা কোর্স খুঁজে পায়।"
    : "Courses marked as popular in the admin panel are curated here first, with visual spotlight treatments that help visitors identify flagship programs faster.";
  const curationLabel = locale === "bn" ? "কিউরেটেড কোর্স" : "Curated Courses";
  const curationValue = locale === "bn" ? "জনপ্রিয় ও আপডেটেড" : "Popular and current";
  const pulseLabel = locale === "bn" ? "অ্যানিমেশন কন্ট্রোল" : "Animation Control";
  const pulseValue = locale === "bn" ? "পালস বা ব্লিংক" : "Pulse or blink";
  const publishLabel = locale === "bn" ? "পাবলিশ রেডি" : "Publish Ready";
  const publishValue = locale === "bn" ? "শুধু লাইভ কোর্স" : "Published only";
  const emptyTitle = locale === "bn" ? "জনপ্রিয় কোর্স এখনো নির্বাচন করা হয়নি" : "No popular courses have been selected yet";
  const emptyBody = locale === "bn"
    ? "অ্যাডমিন প্যানেল থেকে কোর্সকে জনপ্রিয় হিসেবে মার্ক করলে সেটি এখানে দেখা যাবে।"
    : "Mark a published course as popular in the admin panel to feature it on this landing page section.";

  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(241,2,76,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(81,74,137,0.14),transparent_30%)]" />
      <div className="absolute inset-x-0 top-10 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.4)] backdrop-blur">
          <div className="grid gap-10 px-6 py-8 md:px-10 md:py-10 xl:grid-cols-[340px_minmax(0,1fr)] xl:items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                {popularBadge}
              </div>

              <div className="space-y-4">
                <span className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {t("home.courses.eyebrow")}
                </span>
                <h2 className="text-3xl font-display font-bold leading-tight text-slate-950 md:text-4xl">
                  {t("home.courses.title")}
                </h2>
                <p className="text-base leading-7 text-slate-600">
                  {t("home.courses.subtitle")}
                </p>
                <p className="text-sm leading-6 text-slate-500">{spotlightTitle}</p>
                <p className="text-sm leading-6 text-slate-500">{spotlightBody}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {[
                  { icon: TrendingUp, label: curationLabel, value: curationValue },
                  { icon: Sparkles, label: pulseLabel, value: pulseValue },
                  { icon: Telescope, label: publishLabel, value: publishValue },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4"
                  >
                    <item.icon className="mb-3 h-5 w-5 text-primary" />
                    <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                    <div className="text-sm text-slate-500">{item.value}</div>
                  </div>
                ))}
              </div>

              <Button
                asChild
                size="lg"
                className="gap-2 rounded-full bg-primary px-8 text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
              >
                <Link href="/courses">
                  {t("home.courses.viewAllCourses")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {featuredCourses.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
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
              <div className="flex min-h-[320px] items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center">
                <div className="max-w-md space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{emptyTitle}</h3>
                  <p className="text-sm leading-6 text-slate-500">{emptyBody}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
