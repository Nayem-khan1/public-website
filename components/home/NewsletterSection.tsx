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
    <section className="py-20 bg-gradient-to-br from-slate-50 to-purple-50/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
            {t("home.newsletter.title")}
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            {t("home.newsletter.subtitle")}
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("home.newsletter.placeholder")}
              required
              className="flex-1 h-12 px-5 rounded-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
            <Button
              type="submit"
              className="h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
            >
              <Send className="w-4 h-4 mr-2" />
              {t("home.newsletter.subscribe")}
            </Button>
          </form>

          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 font-medium mt-4"
            >
              {t("home.newsletter.submitted")}
            </motion.p>
          )}

          <p className="text-xs text-slate-400 mt-4">
            {t("home.newsletter.disclaimer")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
