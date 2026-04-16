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
    <section className="py-12 relative overflow-hidden z-10 w-full mb-12">
      <div className="container relative mx-auto px-4 md:px-6 mb-12">
        <div className="relative rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 border-t-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-gradient-to-br from-rose-500/10 via-transparent to-orange-500/5 p-8 md:p-14 overflow-hidden group hover:border-rose-500/30 transition-all duration-500">
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
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-white/70">
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
                <div className="h-full relative overflow-hidden rounded-[2rem] bg-[#050505] border border-orange-500/30 p-8 shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] hover:border-orange-400/60 flex flex-col pt-16">
                  {/* Decorative background circle */}
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-bl-[100px] -z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Media Logo / Source */}
                  <div className="absolute top-8 left-8">
                    <span className="inline-flex h-8 items-center px-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-white shadow-sm uppercase tracking-widest">
                      {item.source}
                    </span>
                  </div>

                  {/* Icon link */}
                  <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/60 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col flex-grow mt-4">
                    <h3 className="text-xl font-bold text-white mb-4 transition-all duration-300 group-hover:text-orange-400 group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.5)] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-white/70 text-base leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
