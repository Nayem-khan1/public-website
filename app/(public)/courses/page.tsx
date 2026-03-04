"use client";

import { useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { courses } from "@/data/dummy";

const grades = ["All", "Class 6-10", "Class 8-12", "University"];
const prices = ["All", "Free", "Paid"];

export default function CoursesPage() {
    const [gradeFilter, setGradeFilter] = useState("All");
    const [priceFilter, setPriceFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCourses = courses.filter((course) => {
        const matchesGrade =
            gradeFilter === "All" || course.grade === gradeFilter;
        const matchesPrice =
            priceFilter === "All" ||
            (priceFilter === "Free" ? course.price === 0 : course.price > 0);
        const matchesSearch =
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGrade && matchesPrice && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <PageHeader
                title="Explore Our Courses"
                subtitle="Advance your knowledge of the universe with our specialized astronomy courses."
                bgImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000"
            />

            <div className="container mx-auto px-4 md:px-6 py-16">
                {/* Filters & Search */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                        {/* Grade Filter */}
                        <div className="flex flex-col items-center lg:items-start gap-2 w-full lg:w-auto">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                Filter by Grade
                            </span>
                            <div className="flex flex-wrap justify-center gap-2">
                                {grades.map((g) => (
                                    <Button
                                        key={g}
                                        variant={gradeFilter === g ? "default" : "outline"}
                                        onClick={() => setGradeFilter(g)}
                                        className={`rounded-full px-5 h-9 text-sm ${gradeFilter === g
                                                ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 border-primary text-white"
                                                : "hover:bg-slate-100 bg-white text-slate-600 border-slate-200"
                                            }`}
                                    >
                                        {g}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="flex flex-col items-center lg:items-start gap-2 w-full lg:w-auto">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                Filter by Price
                            </span>
                            <div className="flex flex-wrap justify-center gap-2">
                                {prices.map((p) => (
                                    <Button
                                        key={p}
                                        variant={priceFilter === p ? "default" : "outline"}
                                        onClick={() => setPriceFilter(p)}
                                        className={`rounded-full px-5 h-9 text-sm ${priceFilter === p
                                                ? "bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/25 border-secondary text-white"
                                                : "hover:bg-slate-100 bg-white text-slate-600 border-slate-200"
                                            }`}
                                    >
                                        {p}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="relative w-full lg:w-80 mt-4 lg:mt-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 rounded-full bg-white border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10 h-12 shadow-sm text-sm outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <p className="text-slate-500 text-lg">
                                No courses found matching your criteria.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
