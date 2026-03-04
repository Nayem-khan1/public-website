"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import {
    CheckCircle,
    PlayCircle,
    Lock,
    Star,
    Clock,
    BookOpen,
    Globe,
    Medal,
    ChevronRight,
    Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { courses, teamMembers } from "@/data/dummy";

const reviews = [
    {
        id: 1,
        user: "Rahim Ahmed",
        rating: 5,
        date: "2 weeks ago",
        comment:
            "Excellent course! The explanations are very clear and the examples are relatable.",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: 2,
        user: "Fatima Begum",
        rating: 4.5,
        date: "1 month ago",
        comment:
            "Great content for beginners. I learned a lot about the solar system.",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: 3,
        user: "Karim Uddin",
        rating: 5,
        date: "2 months ago",
        comment: "Highly recommended for anyone interested in astronomy.",
        avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    },
];

const faqs = [
    {
        question: "Do I need a telescope for this course?",
        answer:
            "No, a telescope is not required. While we discuss observation techniques, the core concepts can be learned without equipment. Binoculars are recommended for practical sessions.",
    },
    {
        question: "Is the certificate valid internationally?",
        answer:
            "Our certificates are recognized by local astronomy clubs and can be a great addition to your extracurricular portfolio for college applications.",
    },
    {
        question: "Can I access the recordings later?",
        answer:
            "Yes! You get lifetime access to all course materials and recorded sessions.",
    },
];

export default function CourseDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const course = courses.find((c) => c.slug === slug);

    if (!course) {
        notFound();
    }

    const instructor = teamMembers.find((m) => m.id === course.instructorId);

    return (
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-20">
            {/* Hero Section */}
            <div className="bg-slate-900 pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-90" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

                <div className="container relative mx-auto px-4 md:px-6">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
                        <Link href="/" className="hover:text-white transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link
                            href="/courses"
                            className="hover:text-white transition-colors"
                        >
                            Courses
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-white font-medium truncate">
                            {course.title}
                        </span>
                    </nav>

                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        <div className="lg:col-span-2 text-white">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <Badge
                                    variant="secondary"
                                    className="bg-primary/20 text-primary-foreground border-primary/20 hover:bg-primary/30 px-3 py-1 text-sm"
                                >
                                    {course.category}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="text-slate-300 border-slate-600 px-3 py-1 text-sm bg-slate-800/50"
                                >
                                    {course.level}
                                </Badge>
                                <div className="flex items-center gap-1 text-amber-400 text-sm font-medium ml-2">
                                    <Star className="w-4 h-4 fill-amber-400" />
                                    <span>4.8</span>
                                    <span className="text-slate-400 font-normal">
                                        (250 ratings)
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white leading-tight tracking-tight">
                                {course.title}
                            </h1>

                            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl leading-relaxed">
                                {course.shortDescription}
                            </p>

                            <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-300 border-t border-white/10 pt-6">
                                {[
                                    {
                                        icon: Clock,
                                        label: "Duration",
                                        value: course.duration,
                                    },
                                    {
                                        icon: BookOpen,
                                        label: "Lessons",
                                        value: `${course.totalLessons} Lessons`,
                                    },
                                    {
                                        icon: Globe,
                                        label: "Language",
                                        value: course.language,
                                    },
                                    {
                                        icon: Medal,
                                        label: "Certificate",
                                        value: "Yes, Included",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="p-2 rounded-full bg-white/5 text-white">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wider">
                                                {item.label}
                                            </p>
                                            <p className="text-white">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-10 -mt-8 order-2 lg:order-1">
                        {/* About this Course */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-2xl font-bold font-display text-slate-900 mb-4">
                                About this Course
                            </h3>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                                <p>{course.description}</p>
                            </div>
                        </div>

                        {/* What you'll learn */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-2xl font-bold font-display text-slate-900 mb-6">
                                What you&apos;ll learn
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    "Master core astronomical concepts and theories",
                                    "Analyze real data from telescopes and satellites",
                                    "Understand the physics of stars, galaxies, and black holes",
                                    "Learn practical observation techniques",
                                    "Join a community of like-minded astronomy enthusiasts",
                                    "Receive a verified certificate upon completion",
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-700 text-sm font-medium">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Content */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold font-display text-slate-900">
                                    Course Content
                                </h3>
                                <div className="text-sm text-slate-500 font-medium">
                                    {course.syllabus.length} Modules • {course.totalLessons}{" "}
                                    Lessons
                                </div>
                            </div>

                            <Accordion type="single" collapsible className="w-full">
                                {course.syllabus.map((module, i) => (
                                    <AccordionItem
                                        key={module.title}
                                        value={`item-${i}`}
                                        className="border-slate-100"
                                    >
                                        <AccordionTrigger className="hover:no-underline px-4 py-4 hover:bg-slate-50 rounded-lg group">
                                            <div className="flex items-center gap-4 text-left w-full">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">
                                                        {module.title}
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-medium mt-1">
                                                        {module.lessons} Lessons • {module.duration}
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2 pb-4 px-4 pl-16">
                                            <div className="space-y-3">
                                                {module.topics.map((topic, index) => (
                                                    <div
                                                        key={`${module.title}-${index}`}
                                                        className="flex items-center justify-between py-2"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                                                            <PlayCircle className="w-4 h-4 text-slate-400" />
                                                            <span className="text-slate-600 text-sm">
                                                                {topic}
                                                            </span>
                                                        </div>
                                                        {index > 0 && (
                                                            <Lock className="w-3 h-3 text-slate-300" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>

                        {/* Instructor */}
                        {instructor && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="text-2xl font-bold font-display text-slate-900 mb-6">
                                    Your Instructor
                                </h3>
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <img
                                        src={instructor.photoUrl}
                                        alt={instructor.name}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-xl"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">
                                            {instructor.name}
                                        </h4>
                                        <p className="text-primary font-medium text-sm mb-2">
                                            {instructor.role}
                                        </p>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {instructor.bio}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-end gap-4 mb-8">
                                <h3 className="text-2xl font-bold font-display text-slate-900">
                                    Student Reviews
                                </h3>
                                <div className="flex items-center gap-2 mb-1">
                                    <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                                    <span className="text-2xl font-bold text-slate-900">4.8</span>
                                    <span className="text-slate-500 text-sm">(250 ratings)</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="border-b border-slate-100 pb-6 last:border-0 last:pb-0"
                                    >
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={review.avatar}
                                                alt={review.user}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h5 className="font-bold text-slate-900 text-sm">
                                                        {review.user}
                                                    </h5>
                                                    <span className="text-xs text-slate-400">
                                                        {review.date}
                                                    </span>
                                                </div>
                                                <div className="flex text-amber-400 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 ${i < Math.floor(review.rating)
                                                                    ? "fill-current"
                                                                    : "text-slate-200"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-slate-600 text-sm leading-relaxed">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold font-display text-slate-900 mb-6">
                                Frequently Asked Questions
                            </h3>
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, i) => (
                                    <AccordionItem
                                        key={i}
                                        value={`faq-${i}`}
                                        className="border-slate-100 last:border-0"
                                    >
                                        <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-primary hover:no-underline py-4">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed pb-4">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24 -mt-32 lg:mt-0 relative z-20">
                            <div className="aspect-video rounded-xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
                                <img
                                    src={course.thumbnailUrl}
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                                        <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-end gap-3 mb-6">
                                <span className="text-4xl font-bold text-slate-900 tracking-tight">
                                    {course.isFree
                                        ? "Free"
                                        : `৳${course.price.toLocaleString("en-US")}`}
                                </span>
                                {course.originalPrice && (
                                    <span className="text-lg text-slate-400 line-through mb-1 decoration-slate-400/50">
                                        ৳{course.originalPrice.toLocaleString("en-US")}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 mb-6">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 h-12 text-lg font-bold rounded-xl transition-all hover:translate-y-[-2px]">
                                    Enroll Now
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full h-12 rounded-xl font-semibold border-slate-200 hover:bg-slate-50"
                                >
                                    <Share2 className="w-4 h-4 mr-2" /> Share Course
                                </Button>
                            </div>

                            <p className="text-center text-xs text-slate-500 mb-6 flex items-center justify-center gap-1">
                                <Lock className="w-3 h-3" /> Secure Payment • 30-Day Money-Back
                                Guarantee
                            </p>

                            <div className="space-y-4 pt-6 border-t border-slate-100">
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                                    This course includes:
                                </h4>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex items-center gap-3">
                                        <PlayCircle className="w-4 h-4 text-primary shrink-0" />
                                        <span>
                                            {course.totalLessons} On-demand video lessons
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <BookOpen className="w-4 h-4 text-primary shrink-0" />
                                        <span>Downloadable resources</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                                        <span>Assignments &amp; Quizzes</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Medal className="w-4 h-4 text-primary shrink-0" />
                                        <span>Certificate of completion</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 lg:hidden z-50 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div>
                    <p className="text-xs text-slate-500 font-medium">Total Price</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-slate-900">
                            {course.isFree
                                ? "Free"
                                : `৳${course.price.toLocaleString("en-US")}`}
                        </span>
                        {course.originalPrice && (
                            <span className="text-sm text-slate-400 line-through">
                                ৳{course.originalPrice.toLocaleString("en-US")}
                            </span>
                        )}
                    </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 shadow-lg shadow-primary/20">
                    Enroll Now
                </Button>
            </div>
        </div>
    );
}
