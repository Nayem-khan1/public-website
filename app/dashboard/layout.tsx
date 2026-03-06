"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Settings,
    LogOut,
    Bell,
    ChevronRight,
    Menu,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    clearStudentSession,
    getStudentAccessToken,
    getStudentProfile,
    type StudentProfile,
} from "@/lib/student-api";

const sidebarLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        const token = getStudentAccessToken();
        if (!token) {
            router.replace(`/login?next=${encodeURIComponent(pathname || "/dashboard")}`);
            return;
        }

        void (async () => {
            try {
                const data = await getStudentProfile(token);
                setProfile(data);
            } catch {
                clearStudentSession();
                router.replace(`/login?next=${encodeURIComponent(pathname || "/dashboard")}`);
            } finally {
                setLoadingProfile(false);
            }
        })();
    }, [pathname, router]);

    function handleLogout() {
        clearStudentSession();
        router.replace("/login");
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 flex-col fixed h-full z-40">
                <div className="p-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">AP</div>
                        <span className="font-display font-bold text-lg text-slate-900">Astronomy<span className="text-primary">Pathshala</span></span>
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                pathname === link.href ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <link.icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" /> Log Out
                    </button>
                    <Link
                        href="/"
                        className="mt-1 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        Back to Website
                    </Link>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 top-0 w-64 h-full bg-white shadow-2xl animate-in slide-in-from-left">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">AP</div>
                                <span className="font-display font-bold text-sm">AP Dashboard</span>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></Button>
                        </div>
                        <nav className="p-4 space-y-1">
                            {sidebarLinks.map((link) => (
                                <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
                                    className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                        pathname === link.href ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"
                                    )}>
                                    <link.icon className="w-5 h-5" />{link.label}
                                </Link>
                            ))}
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </Button>
                        <h1 className="text-lg font-display font-bold text-slate-900">Student Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
                            <Bell className="w-5 h-5 text-slate-500" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-bold text-primary">
                                {profile?.name?.charAt(0).toUpperCase() || "S"}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold text-slate-900">
                                    {loadingProfile ? "Loading..." : profile?.name || "Student"}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {loadingProfile ? "Fetching profile..." : profile?.email || "student@example.com"}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
