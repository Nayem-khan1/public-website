
import { CheckCircle2, Clock, PlayCircle, Lock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface CourseSyllabusItem {
  title: string;
  lessons: number;
  duration: string;
  topics: string[];
}

interface CourseCurriculumProps {
  syllabus: CourseSyllabusItem[];
  t: (key: string) => string;
}

export function CourseCurriculum({ syllabus, t }: CourseCurriculumProps) {
  if (!syllabus || syllabus.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          {t("courseDetails.curriculum")}
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <BookIcon className="w-12 h-12 mb-4 text-slate-300" />
          <p className="text-lg font-medium text-slate-700">Curriculum is being updated</p>
          <p className="mt-1">Please check back later for detailed modules and lessons.</p>
        </div>
      </div>
    );
  }

  const totalLessons = syllabus.reduce((acc, curr) => acc + curr.lessons, 0);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" id="curriculum">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            {t("courseDetails.curriculum")}
          </h2>
          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full"><ListIcon className="w-4 h-4" /> {syllabus.length} Modules</span>
            <span className="flex items-center gap-2 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full"><PlayCircle className="w-4 h-4" /> {totalLessons} Lessons</span>
          </div>
        </div>
        <button className="text-primary text-sm font-semibold hover:text-white bg-primary/10 hover:bg-primary px-5 py-2.5 rounded-xl transition-all shadow-sm">
          Expand all sections
        </button>
      </div>

      <Accordion type="multiple" className="w-full space-y-4" defaultValue={["item-0"]}>
        {syllabus.map((module, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border border-slate-200/60 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all data-[state=open]:shadow-md data-[state=open]:border-primary/30 group"
          >
            <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-slate-50/50 transition-colors data-[state=open]:bg-slate-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left gap-2 md:gap-4">
                <div className="flex items-start gap-4">
                  <div className="hidden md:flex w-12 h-12 rounded-xl bg-primary/10 text-primary items-center justify-center font-black shrink-0 text-lg group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-colors duration-300">
                    {index + 1}
                  </div>
                  <div className="pt-1 md:pt-0">
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">{module.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold mr-4 mt-2 md:mt-0">
                  <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hidden md:inline-block transition-colors group-hover:border-primary/30">{module.lessons} Lessons</span>
                  <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hidden md:flex items-center gap-1.5 transition-colors group-hover:border-primary/30"><Clock className="w-3.5 h-3.5 text-slate-400"/> {module.duration}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-0">
              <div className="border-t border-slate-100 bg-slate-50/30">
                {module.topics.map((topic, tIndex) => (
                  <div 
                    key={tIndex} 
                    className="flex items-center justify-between px-6 py-4 border-b border-slate-100/80 last:border-0 hover:bg-white transition-colors group/item cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {tIndex === 0 && index === 0 ? (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                           <PlayCircle className="w-4 h-4 text-primary" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover/item:bg-primary/10 transition-colors">
                           <CheckCircle2 className="w-4 h-4 text-slate-300 group-hover/item:text-primary transition-colors" />
                        </div>
                      )}
                      <div>
                        <span className="text-[15px] font-medium text-slate-700 group-hover/item:text-primary transition-colors">{topic}</span>
                        {tIndex === 0 && index === 0 && (
                          <Badge className="ml-3 text-[10px] tracking-wide uppercase bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-sm pb-1">Preview</Badge>
                        )}
                      </div>
                    </div>
                    {tIndex !== 0 && (
                       <Lock className="w-4 h-4 text-slate-400 shrink-0 group-hover/item:text-slate-600 transition-colors" />
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
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
