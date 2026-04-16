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
    <section className="py-24 relative overflow-hidden z-10">
      
      <div className="container relative mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative p-10 md:p-14 rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 border-t-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/5 overflow-hidden hover:border-indigo-500/30 transition-all duration-500 group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -m-16 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 -m-16 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]"></div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm mb-6 backdrop-blur-md">
                <Send className="w-4 h-4 text-primary" />
                {t("home.newsletter.title")}
              </span>
              
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                Stay Updated with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Cosmos</span>
              </h2>
              <p className="text-lg text-white/70 mb-10 leading-relaxed">
                {t("home.newsletter.subtitle")}
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto bg-white/5 p-2 rounded-full backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all duration-300"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t("home.newsletter.placeholder")}
                  required
                  className="flex-1 h-14 px-6 rounded-full bg-transparent text-white placeholder-white/50 border-none focus:outline-none focus:ring-0 text-base"
                />
                <Button
                  type="submit"
                  className="h-14 px-8 rounded-full bg-primary text-white font-bold text-base shadow-[0_0_40px_rgba(241,2,76,0.3)] hover:shadow-[0_0_60px_rgba(241,2,76,0.4)] transition-all duration-300 hover:scale-[1.02]"
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

              <p className="text-sm text-white/50 mt-6 font-medium">
                {t("home.newsletter.disclaimer")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
