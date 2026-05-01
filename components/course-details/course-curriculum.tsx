import { CheckCircle2, PlayCircle, Lock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface CourseCurriculumLesson {
  id: string;
  title?: string;
  is_preview?: boolean;
}

interface CourseCurriculumProps {
  sections: Array<{
    id: string;
    title?: string;
    total_lessons?: number;
    lessons?: CourseCurriculumLesson[];
  }>;
  t: (key: string) => string;
}

export function CourseCurriculum({ sections, t }: CourseCurriculumProps) {
  if (!sections || sections.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          {t("courseDetails.curriculum")}
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <BookIcon className="w-12 h-12 mb-4 text-slate-300" />
          <p className="text-lg font-medium text-slate-700">{t("courseDetails.curriculumPending")}</p>
        </div>
      </div>
    );
  }

  const totalLessons = sections.reduce(
    (acc, section) => acc + (section.lessons?.length ?? section.total_lessons ?? 0),
    0,
  );

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" id="curriculum">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t("courseDetails.curriculum")}
          </h2>
          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">{sections.length} {t("courseDetails.modules")}</span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">{totalLessons} {t("common.lessons")}</span>
          </div>
        </div>
      </div>

      <Accordion type="multiple" className="w-full space-y-4" defaultValue={["item-0"]}>
        {sections.map((section, index) => {
          const lessons = section.lessons ?? [];

          return (
            <AccordionItem
              key={section.id || index}
              value={`item-${index}`}
              className="border border-slate-200 rounded-xl bg-white overflow-hidden data-[state=open]:border-primary/30 transition-all group"
            >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-slate-50/50 transition-colors data-[state=open]:bg-slate-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left gap-2 md:gap-4">
                  <div className="flex items-start gap-3">
                    <div className="hidden md:flex w-8 h-8 rounded-lg bg-primary/10 text-primary items-center justify-center font-bold shrink-0 text-sm group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-colors duration-300">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-[15px] group-hover:text-primary transition-colors">{section.title || t("courseDetails.curriculum")}</h3>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mr-4 mt-2 md:mt-0">
                  <span className="hidden md:inline-block">
                    {lessons.length || section.total_lessons || 0} {t("common.lessons")}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-0">
                <div className="border-t border-slate-100">
                  {lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id || lessonIndex}
                      className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100/80 last:border-0 hover:bg-slate-50 transition-colors group/item cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        {lesson.is_preview ? (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                             <PlayCircle className="w-4 h-4 text-primary" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover/item:bg-primary/10 transition-colors">
                             <CheckCircle2 className="w-4 h-4 text-slate-300 group-hover/item:text-primary transition-colors" />
                          </div>
                        )}
                        <div>
                          <span className="text-sm text-slate-700 group-hover/item:text-primary transition-colors">{lesson.title}</span>
                          {lesson.is_preview && (
                            <Badge className="ml-3 text-[10px] tracking-wide uppercase bg-secondary/10 text-secondary hover:bg-secondary/20 border-none shadow-sm pb-1">Preview</Badge>
                          )}
                        </div>
                      </div>
                      {!lesson.is_preview && (
                         <Lock className="w-4 h-4 text-slate-400 shrink-0 group-hover/item:text-slate-600 transition-colors" />
                      )}
                    </div>
                  ))}
                  {lessons.length === 0 ? (
                    <div className="px-6 py-5 text-sm text-slate-500">
                      {t("courseDetails.curriculumPending")}
                    </div>
                  ) : null}
                  </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}
