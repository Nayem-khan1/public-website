"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAppTranslation } from "@/contexts/LanguageContext";

export function NewsletterSection() {
  const { t } = useAppTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,2,76,0.1)_0%,_transparent_50%)]"></div>
      
      <div className="container relative mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative p-10 md:p-14 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 overflow-hidden shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -m-16 w-64 h-64 bg-primary/30 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 -m-16 w-64 h-64 bg-secondary/30 rounded-full blur-[80px]"></div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-medium text-sm mb-6 backdrop-blur-md">
                <Send className="w-4 h-4 text-primary" />
                {t("home.newsletter.title")}
              </span>
              
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                Stay Updated with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400">Cosmos</span>
              </h2>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                {t("home.newsletter.subtitle")}
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto bg-white/5 p-2 rounded-full backdrop-blur-md border border-white/10 shadow-inner"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t("home.newsletter.placeholder")}
                  required
                  className="flex-1 h-14 px-6 rounded-full bg-transparent text-white placeholder-slate-400 border-none focus:outline-none focus:ring-0 text-base"
                />
                <Button
                  type="submit"
                  className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {t("home.newsletter.subscribe")}
                </Button>
              </form>

              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-400 font-medium mt-6 bg-emerald-500/10 inline-block px-4 py-2 rounded-full border border-emerald-500/20"
                >
                  {t("home.newsletter.submitted")}
                </motion.p>
              )}

              <p className="text-sm text-slate-400 mt-6 font-medium">
                {t("home.newsletter.disclaimer")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
