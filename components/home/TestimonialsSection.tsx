"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { Testimonial } from "@/data/types";
import { useAppTranslation } from "@/contexts/LanguageContext";

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

const dummyTestimonials = [
  {
    id: 1,
    name: "Zeesan",
    school: "Gazipur Cantonment Public School and College",
    content: "I have been achieving first place for the last 4 years. This year too I have passed 9th to 10th and achieved first place. Ten Minute School had a lot of contribution behind this...",
    photoUrl: "https://i.pravatar.cc/150?img=11",
    videoThumbnail: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Israt Jahan Lamia",
    school: "Begum Rokeya Kishloy Girls High School",
    content: "Ten Minute School has helped me a lot in my studies. The study tips from many experienced teachers, and their good teaching, have helped me achieve very good results...",
    photoUrl: "https://i.pravatar.cc/150?img=5",
    videoThumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Raisa Jahan Rupa",
    school: "10 Minute School",
    content: "I have now come first in all 5 sections at school. The model tests before the annual exams and the final revision classes were very useful to me. Thank you Ten Minute School.",
    photoUrl: "https://i.pravatar.cc/150?img=9",
    videoThumbnail: "https://images.unsplash.com/photo-1427504494785-319ce83d527c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Mun",
    school: "10 Minute School",
    content: "I really like your teaching style and the way you explain things in a simple way. I have found your videos and content to be very helpful in my studies...",
    photoUrl: "https://i.pravatar.cc/150?img=10",
    videoThumbnail: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Rafsan",
    school: "Sheikh Russell Cantonment Public School",
    content: "Almost half a month has passed in such a mess. When the exam decision is made and such a big syllabus is given to us, almost everyone like me is in a state of panic...",
    photoUrl: "https://i.pravatar.cc/150?img=12",
    videoThumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Redwan Ahmed",
    school: "Birshreshtha Noor Mohammad Public College",
    content: "I am very grateful to Ten Minute School. When I entered 8th grade in 2024, there was a new curriculum. At such a moment, your classes have inspired me a lot...",
    photoUrl: "https://i.pravatar.cc/150?img=13",
    videoThumbnail: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Puja Rani Das",
    school: "The Roses Collectorate School, Habiganj",
    content: "I have been achieving first place for the last 4 years. This year too I have passed 9th to 10th and achieved first place. Actually I have been doing the free classes...",
    photoUrl: "https://i.pravatar.cc/150?img=14",
    videoThumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Jahid Alam",
    school: "Kamar Ali High School, Narayanganj",
    content: "Ten Minute School has helped me a lot in my studies. The study tips from many experienced teachers, and their good teaching, have helped me achieve very good results...",
    photoUrl: "https://i.pravatar.cc/150?img=15",
    videoThumbnail: "https://images.unsplash.com/photo-1427504494785-319ce83d527c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 9,
    name: "Amrita Saha",
    school: "Cantonment Public School & College",
    content: "I have now come first in all 5 sections at school. The model tests before the annual exams and the final revision classes were very useful to me...",
    photoUrl: "https://i.pravatar.cc/150?img=16",
    videoThumbnail: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 10,
    name: "Tawhidul Rahman",
    school: "Jamshed Ahmed High School, Sylhet",
    content: "I really like your teaching style and the way you explain things in a simple way. Your work is truly inspiring for the students. I sincerely wish you success...",
    photoUrl: "https://i.pravatar.cc/150?img=17",
    videoThumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop",
  }
];

const colors = [
  "from-[#3d1328] to-[#1a0710]",
  "from-[#132c1c] to-[#08170e]",
  "from-[#151d36] to-[#070b1a]",
  "from-[#14302c] to-[#071614]",
  "from-[#3d1328] to-[#1a0710]",
  "from-[#132c1c] to-[#08170e]",
];

const borderColors = [
  "border-[#5c1c3c]/50",
  "border-[#204a2f]/50",
  "border-[#23315a]/50",
  "border-[#1a403a]/50",
  "border-[#5c1c3c]/50",
  "border-[#204a2f]/50",
];

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const { t } = useAppTranslation();
  const videoSliderRef = useRef<HTMLDivElement>(null);
  const textSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const attachDrag = (slider: HTMLElement | null) => {
      if (!slider) return;
      let isDown = false;
      let startX: number;
      let scrollLeft: number;

      const onMouseDown = (e: MouseEvent) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        slider.style.scrollSnapType = 'none'; // Disable snap to slide raw
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      };

      const onMouseLeave = () => {
        if (!isDown) return;
        isDown = false;
        slider.style.cursor = 'grab';
        slider.style.scrollSnapType = 'x mandatory';
      };

      const onMouseUp = () => {
        if (!isDown) return;
        isDown = false;
        slider.style.cursor = 'grab';
        slider.style.scrollSnapType = 'x mandatory';
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
      };

      slider.style.cursor = 'grab';
      slider.addEventListener('mousedown', onMouseDown);
      slider.addEventListener('mouseleave', onMouseLeave);
      slider.addEventListener('mouseup', onMouseUp);
      slider.addEventListener('mousemove', onMouseMove);

      return () => {
        slider.removeEventListener('mousedown', onMouseDown);
        slider.removeEventListener('mouseleave', onMouseLeave);
        slider.removeEventListener('mouseup', onMouseUp);
        slider.removeEventListener('mousemove', onMouseMove);
      };
    };

    const cleanup1 = attachDrag(videoSliderRef.current);
    const cleanup2 = attachDrag(textSliderRef.current);

    return () => {
      cleanup1?.();
      cleanup2?.();
    };
  }, []);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden z-10 w-full pt-20">
      <div className="container mx-auto px-4 md:px-6 mb-12 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
            {t("home.testimonials.eyebrow")}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {t("home.testimonials.title")}
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t("home.testimonials.subtitle")}
          </p>
        </motion.div>
      </div>

      <div className="w-full flex flex-col gap-8 md:gap-10 overflow-hidden relative z-10 group">
        {/* Left Edge Shadow Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none transition-opacity duration-300" />
        
        {/* Right Edge Shadow Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none transition-opacity duration-300" />

        {/* Top Side: YouTube Video Cards */}
        <div 
          ref={videoSliderRef}
          className="flex overflow-x-auto pb-4 px-12 md:px-24 gap-4 md:gap-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {dummyTestimonials.map((item, i) => (
            <motion.div
              key={`video-${item.id}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative shrink-0 w-[300px] md:w-[320px] p-4 rounded-[1.5rem] snap-center group border border-white/5 bg-[#12141c] hover:bg-[#161821] transition-colors"
            >
              {/* Background Image / Video Thumbnail */}
              <div className="relative w-full aspect-video rounded-[1rem] overflow-hidden mb-5">
                <img
                  src={item.videoThumbnail}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none select-none"
                />
                <div className="absolute inset-0 bg-black/20 pointer-events-none select-none" />
                
                {/* Play Button Center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 text-red-600 fill-red-600 ml-1" />
                  </div>
                </div>
              </div>

              {/* Bottom Info: Avatar and Texts */}
              <div className="flex items-center gap-3">
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover pointer-events-none select-none border border-white/10"
                />
                <div className="flex-1 min-w-0 pointer-events-none select-none">
                  <h4 className="text-white font-bold truncate text-sm">
                    {item.name}
                  </h4>
                  <p className="text-white/40 text-xs truncate mt-0.5">
                    {item.school}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Side: Text Cards */}
        <div 
          ref={textSliderRef}
          className="flex overflow-x-auto pb-12 px-12 md:px-24 gap-4 md:gap-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {dummyTestimonials.map((item, i) => (
            <motion.div
              key={`text-${item.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`relative shrink-0 w-[300px] md:w-[350px] p-6 rounded-[1.5rem] snap-center border bg-gradient-to-br ${
                colors[i % colors.length]
              } ${
                borderColors[i % borderColors.length]
              } flex flex-col justify-between min-h-[260px] select-none`}
            >
              <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-[7] pointer-events-none">
                {item.content}
              </p>
              
              <div className="mt-auto pointer-events-none">
                <span className="text-[#41b96a] text-sm font-medium mb-5 inline-block pointer-events-auto cursor-pointer hover:text-[#329654] transition-colors">
                  Read more
                </span>
                
                <div className="flex items-center gap-3">
                  <img src={item.photoUrl} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-white/10 pointer-events-none"/>
                  <div className="flex-1 min-w-0 pointer-events-none">
                    <h4 className="text-white font-bold truncate text-sm">
                      {item.name}
                    </h4>
                    <p className="text-white/40 text-xs truncate mt-0.5">
                      {item.school}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
