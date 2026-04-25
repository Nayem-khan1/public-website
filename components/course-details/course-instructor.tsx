interface CourseInstructorItem {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  specialization?: string;
}

interface CourseInstructorProps {
  instructors: CourseInstructorItem[];
  t: (key: string) => string;
}

export function CourseInstructor({ instructors, t }: CourseInstructorProps) {
  if (!instructors.length) return null;
  
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" id="instructors">
      <h2 className="mb-8 text-2xl font-extrabold text-slate-900 tracking-tight">
        {instructors.length > 1 ? t("courseDetails.instructors") : t("courseDetails.instructor")}
      </h2>
      
      <div className={`grid gap-6 ${instructors.length > 1 ? "lg:grid-cols-2" : ""}`}>
        {instructors.map((instructor) => {
          const initials = instructor.name
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase();

          return (
            <div
              key={instructor.id}
              className="flex flex-col gap-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-6 md:flex-row"
            >
              <div className="flex-shrink-0">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl shadow-lg ring-4 ring-white">
                  {instructor.avatar ? (
                    <img
                      src={instructor.avatar}
                      alt={instructor.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-indigo-600 text-2xl font-black text-white">
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{instructor.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {instructor.specialization || t("common.instructor")}
                  </p>
                </div>
                <div className="text-[15px] leading-relaxed text-slate-600">
                  <p>
                    {instructor.bio || "Instructor biography will be added soon."}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
