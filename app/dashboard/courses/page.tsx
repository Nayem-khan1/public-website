import Link from "next/link";
import { BookOpen, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/dummy";

const enrolledCourses = [
    { ...courses[0], progress: 65, lastAccessed: "2 hours ago" },
    { ...courses[2], progress: 30, lastAccessed: "Yesterday" },
    { ...courses[3], progress: 90, lastAccessed: "3 days ago" },
];

export default function MyCoursesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-slate-900">My Courses</h2>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full">
                    <Link href="/courses">Browse More Courses</Link>
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {enrolledCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="relative h-40 overflow-hidden">
                            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="font-bold text-white text-lg line-clamp-1">{course.title}</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between text-sm text-slate-500">
                                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.totalLessons} lessons</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700">Progress</span>
                                    <span className="text-sm font-bold text-primary">{course.progress}%</span>
                                </div>
                                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${course.progress}%` }} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-slate-400">Last accessed: {course.lastAccessed}</span>
                                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full">
                                    <Play className="w-4 h-4 mr-1" /> Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
