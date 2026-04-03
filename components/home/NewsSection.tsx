"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function NewsSection() {
  const { locale } = useLanguage();

  const eyebrow = locale === "bn" ? "মিডিয়ায় আমরা" : "In the Media";
  const title = locale === "bn" ? "গণমাধ্যমে অ্যাস্ট্রোনমি পাঠশালা" : "Featured On News";
  const subtitle = locale === "bn"
    ? "দেশের শীর্ষস্থানীয় গণমাধ্যমগুলোতে আমাদের কার্যক্রম ও অর্জনসমূহ।"
    : "Read about our initiatives and impact in the leading national media outlets.";

  const newsItems = [
    {
      id: 1,
      title: "বাংলায় জ্যোতির্বিজ্ঞান শেখাচ্ছে অ্যাস্ট্রোনমি পাঠশালা",
      description: "এখানে দেশের বিভিন্ন প্রান্ত থেকে প্রতিদিনই ২০ থেকে ৩০ হাজার শিক্ষার্থী বিনামূল্যে জ্যোতির্বিজ্ঞান শিখছে। ৪৬টি জেলার শিক্ষার্থীরা এ শিক্ষা কার্যক্রমে অংশ নিচ্ছে।",
      source: "The Daily Star",
      link: "https://bangla.thedailystar.net/tech-startup/science-tech-gadgets/news-461411",
      logoUrl: "https://astronomypathshala.com/wp-content/uploads/2023/03/Daily-Star-Logo.png"
    },
    {
      id: 2,
      title: "বাংলায় জ্যোতির্বিজ্ঞান শেখায় অ্যাস্ট্রোনমি পাঠশালা",
      description: "ছোটবেলা থেকে জ্যোতির্বিজ্ঞানবিষয়ক তথ্যচিত্র, ভিডিও কিংবা স্টিফেন হকিংয়ের বক্তব্য মুগ্ধ হয়ে দেখতেন হাসিবুল হোসেন। জ্যোতির্বিজ্ঞান সম্পর্কে আরও জানার আগ্রহটা তখন থেকেই।",
      source: "Prothom Alo",
      link: "https://www.prothomalo.com/lifestyle/i7b99194fs",
      logoUrl: "https://astronomypathshala.com/wp-content/uploads/2023/03/Daily-Star-Logo.png"
    },
    {
      id: 3,
      title: "প্রথমবারের মতো অনুষ্ঠিত হচ্ছে মহাকাশবিজ্ঞান শিক্ষার ‘সামার স্কুল ’",
      description: "এই সামার স্কুলটি সকলের জন্য উন্মুক্ত। দুই দিনব্যাপী চলবে জ্যোতির্বিজ্ঞান, মহাকাশ অন্বেষণ ও অ্যাস্ট্রোফিজিক্স বিষয়ক দেশ-বিদেশের স্বনামধন্য আন্তর্জাতিক বিজ্ঞানীদের ক্লাস।",
      source: "The Daily Campus",
      link: "https://thedailycampus.com/competition-award/202913",
      logoUrl: "https://astronomypathshala.com/wp-content/uploads/2023/03/Daily-Star-Logo.png"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Newspaper className="w-4 h-4" />
            {eyebrow}
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {newsItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link href={item.link} target="_blank" rel="noopener noreferrer" className="block group h-full">
                <div className="h-full relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 p-8 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 flex flex-col pt-16">
                  {/* Decorative background circle */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-[100px] -z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Media Logo / Source */}
                  <div className="absolute top-8 left-8">
                    {/* Just using the source name as a styled tag since logo urls might break or look inconsistent */}
                    <span className="inline-flex h-8 items-center px-4 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm uppercase tracking-widest">
                      {item.source}
                    </span>
                  </div>

                  {/* Icon link */}
                  <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-300 shadow-sm">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col flex-grow mt-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors duration-300 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-base leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
