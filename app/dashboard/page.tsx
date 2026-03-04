import { BookOpen, Clock, Trophy, TrendingUp, Play, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/dummy";

const enrolledCourses = [
    { ...courses[0], progress: 65 },
    { ...courses[2], progress: 30 },
    { ...courses[3], progress: 90 },
];

const upcomingClasses = [
    { title: "Stars & Stellar Evolution — Session 3", date: "Mar 06, 2026", time: "7:00 PM", course: "Basic Astronomy" },
    { title: "Celestial Mechanics — Practice Problems", date: "Mar 08, 2026", time: "6:00 PM", course: "Olympiad Prep" },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-2xl text-white">
                <h2 className="text-2xl font-display font-bold mb-2">Welcome back, Student! 🚀</h2>
                <p className="text-white/80">Keep exploring the cosmos. You&apos;re making great progress!</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: BookOpen, label: "Enrolled Courses", value: "3", color: "text-primary bg-primary/10" },
                    { icon: Clock, label: "Hours Learned", value: "24h", color: "text-secondary bg-secondary/10" },
                    { icon: Trophy, label: "Certificates", value: "1", color: "text-amber-500 bg-amber-50" },
                    { icon: TrendingUp, label: "Avg. Progress", value: "62%", color: "text-emerald-500 bg-emerald-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-sm text-slate-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Enrolled Courses with Progress */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-display font-bold text-slate-900">Continue Learning</h3>
                        <Link href="/dashboard/courses" className="text-sm text-primary font-semibold hover:underline">View all</Link>
                    </div>
                    {enrolledCourses.map((course) => (
                        <div key={course.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
                            <img src={course.thumbnailUrl} alt={course.title} className="w-full sm:w-32 h-24 rounded-xl object-cover" />
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 mb-1 line-clamp-1">{course.title}</h4>
                                <p className="text-sm text-slate-500 mb-3">{course.totalLessons} lessons • {course.duration}</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{course.progress}%</span>
                                </div>
                            </div>
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full self-center shrink-0">
                                <Play className="w-4 h-4 mr-1" /> Continue
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Upcoming Classes */}
                <div className="space-y-4">
                    <h3 className="text-lg font-display font-bold text-slate-900">Upcoming Classes</h3>
                    {upcomingClasses.map((cls, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-2">
                                <Calendar className="w-3.5 h-3.5" />
                                {cls.date} at {cls.time}
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1">{cls.title}</h4>
                            <p className="text-xs text-slate-500">{cls.course}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
