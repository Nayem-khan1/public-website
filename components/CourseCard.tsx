import Link from "next/link";
import { Clock, BookOpen, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import type { Course } from "@/data/types";

interface CourseProps {
  course: Course;
}

export function CourseCard({ course }: CourseProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-md border-none font-semibold w-fit">
            {course.category}
          </Badge>
          <Badge className="bg-black/50 text-white hover:bg-black/60 backdrop-blur-md border border-white/20 font-medium w-fit">
            {course.grade}
          </Badge>
        </div>

        {/* Live/Recorded Badge */}
        <div className="absolute top-4 right-4">
          <Badge
            variant={course.mode === "Live" ? "default" : "secondary"}
            className={`${course.mode === "Live"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-slate-700 hover:bg-slate-800"
              } text-white border-none shadow-lg`}
          >
            {course.mode}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3 text-sm font-medium text-slate-500">
          <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
            <BookOpen className="w-3.5 h-3.5 text-primary" /> {course.level}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />{" "}
              {course.totalLessons} Lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {course.duration}
            </span>
          </div>
        </div>

        <Link href={`/courses/${course.slug}`}>
          <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
            {course.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-4 h-4 fill-amber-400 text-amber-400"
            />
          ))}
          <span className="text-xs text-slate-500 ml-1">(4.8)</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 line-through">
              {course.originalPrice
                ? `BDT ${course.originalPrice.toLocaleString("en-US")}`
                : ""}
            </span>
            <span className="text-xl font-bold text-primary">
              {course.price === 0
                ? "Free"
                : `BDT ${course.price.toLocaleString("en-US")}`}
            </span>
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="text-sm font-semibold text-slate-900 hover:text-primary underline decoration-2 underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
