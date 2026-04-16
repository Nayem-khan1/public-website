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
    <section className="py-12 relative z-10">
      <div className="container relative z-10 mx-auto px-4 md:px-6 mb-12">
        <div className="relative rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 border-t-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/5 p-8 md:p-14 overflow-hidden group hover:border-orange-500/30 transition-all duration-500">
          
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
            {t("home.instructors.eyebrow")}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {t("home.instructors.title")}
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t("home.instructors.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
          {visibleInstructors.map((instructor, i) => {
            const initials = instructor.name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

            return (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group text-center p-8 rounded-[2rem] bg-[#050505] border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 relative overflow-hidden hover:border-purple-400/50"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-32 h-32 mx-auto mb-6 z-10">
                  {instructor.photoUrl ? (
                    <img 
                      src={instructor.photoUrl} 
                      alt={instructor.name} 
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-110 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center text-3xl font-black text-white group-hover:scale-105 transition-transform duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                      {initials}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full border-4 border-[#050505] group-hover:border-purple-400/50 transition-colors duration-500 shadow-[0_0_30px_rgba(168,85,247,0.2)]"></div>
                </div>

                <h4 className="text-xl font-bold text-white mb-1 transition-all duration-300 relative z-10 group-hover:text-purple-300 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                  {instructor.name}
                </h4>
                <p className="text-primary font-medium text-sm mb-3 relative z-10">
                  {instructor.role || t("common.instructor")}
                </p>
                <p className="text-white/70 text-sm leading-relaxed px-2 relative z-10">
                  {instructor.credential || t("common.instructor")}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12 relative z-10">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-300"
          >
            <Link href="/team">{t("home.instructors.viewFullTeam")}</Link>
          </Button>
        </div>
        </div>
      </div>
    </section>
  );
}
