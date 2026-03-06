"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, Globe, X } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/team", label: "Team" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 border-b",
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-gray-100 py-3 shadow-sm"
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-purple-600 to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-all duration-300">
              AP
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={cn(
                  "text-sm font-bold font-display transition-colors",
                  isScrolled ? "text-slate-900" : "text-white"
                )}
              >
                Astronomy
              </span>
              <span className="text-sm font-bold font-display text-primary">
                Pathshala
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-primary",
                  isActive(link.href)
                    ? "text-primary"
                    : isScrolled
                      ? "text-slate-600"
                      : "text-slate-200"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer hover:text-primary",
                isScrolled ? "text-slate-600" : "text-slate-200"
              )}
            >
              <Globe className="w-4 h-4" />
              {language}
            </button>

            <Button
              asChild
              variant="ghost"
              className={cn(
                "font-semibold transition-colors",
                isScrolled
                  ? "text-slate-700 hover:bg-slate-100"
                  : "text-white hover:bg-white/10 hover:text-white"
              )}
            >
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full px-6">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden transition-colors",
              isScrolled
                ? "text-slate-700 hover:bg-slate-100"
                : "text-white hover:bg-white/10 hover:text-white"
            )}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 w-[300px] sm:w-[380px] h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    AP
                  </div>
                  <span className="font-display font-bold text-lg text-slate-900">
                    Astronomy<span className="text-primary">Pathshala</span>
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  className="text-slate-500"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-lg font-semibold py-3 px-4 rounded-xl transition-colors",
                      isActive(link.href)
                        ? "text-primary bg-primary/5"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="h-px bg-slate-100 my-6" />

              <div className="flex flex-col gap-3">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary py-2 px-4"
                >
                  <Globe className="w-4 h-4" />
                  {language === "EN" ? "Switch to Bangla" : "Switch to English"}
                </button>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link href="/login">Log In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
