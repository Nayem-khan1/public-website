"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/contexts/LanguageContext";

interface HomeInstructor {
  id: string | number;
  name: string;
  role: string;
  credential: string;
  photoUrl?: string;
}

interface InstructorsSectionProps {
  instructors: HomeInstructor[];
}

export function InstructorsSection({ instructors }: InstructorsSectionProps) {
  const { t } = useAppTranslation();
  const visibleInstructors = instructors.slice(0, 3);

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
            {t("home.instructors.eyebrow")}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            {t("home.instructors.title")}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("home.instructors.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {visibleInstructors.map((instructor, i) => {
            const initials = instructor.name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

            return (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group text-center p-8 rounded-3xl bg-white border border-slate-100 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative w-32 h-32 mx-auto mb-6">
                  {instructor.photoUrl ? (
                    <img 
                      src={instructor.photoUrl} 
                      alt={instructor.name} 
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-105"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center text-3xl font-black text-white group-hover:scale-105 transition-transform duration-500">
                      {initials}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full border-4 border-white shadow-[0_0_20px_rgba(0,0,0,0.05)]"></div>
                </div>

                <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                  {instructor.name}
                </h4>
                <p className="text-primary font-medium text-sm mb-3">
                  {instructor.role || t("common.instructor")}
                </p>
                <p className="text-slate-500 text-sm leading-relaxed px-2">
                  {instructor.credential || t("common.instructor")}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-2"
          >
            <Link href="/team">{t("home.instructors.viewFullTeam")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
