
import { Award, PlayCircle, Users, Star } from "lucide-react";

interface CourseInstructorProps {
  instructor: {
    name: string;
    bio: string;
    avatar?: string;
    specialization?: string;
  };
  t: (key: string) => string;
}

export function CourseInstructor({ instructor, t }: CourseInstructorProps) {
  if (!instructor) return null;
  
  const initials = instructor.name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" id="instructor">
      <h2 className="mb-8 text-2xl font-extrabold text-slate-900 tracking-tight">
        {t("courseDetails.instructor")}
      </h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-xl ring-4 ring-slate-100">
            {instructor.avatar ? (
               <img 
                 src={instructor.avatar} 
                 alt={instructor.name} 
                 className="w-full h-full object-cover"
               />
            ) : (
               <div className="w-full h-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-3xl font-black text-white">
                 {initials}
               </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 space-y-5">
           <div>
             <h3 className="text-2xl font-bold text-slate-900">{instructor.name}</h3>
             <p className="text-primary font-semibold text-base mt-0.5">{instructor.specialization || "Senior Instructor"}</p>
           </div>
           
           <div className="flex flex-wrap gap-3 text-sm font-medium">
             <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3.5 py-2 rounded-xl ring-1 ring-amber-100">
               <Star className="w-4 h-4 fill-current text-amber-500" />
               <span>4.9 Rating</span>
             </div>
             <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3.5 py-2 rounded-xl ring-1 ring-blue-100">
               <Users className="w-4 h-4" />
               <span>10k+ Students</span>
             </div>
             <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3.5 py-2 rounded-xl ring-1 ring-indigo-100">
               <PlayCircle className="w-4 h-4" />
               <span>5 Courses</span>
             </div>
           </div>
           
           <div className="text-[15px] text-slate-600 leading-relaxed">
             <p>
               {instructor.bio || "An experienced educator dedicated to astronomy and space sciences. Providing in-depth knowledge and hands-on learning experiences for students."}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
