"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppTranslation } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const studentAccountLinks = [
  {
    href: "/dashboard",
    labelKey: "dashboard.dashboardMenu",
    icon: LayoutDashboard,
  },
  {
    href: "/my-courses",
    labelKey: "dashboard.myCourses",
    icon: BookOpen,
  },
  {
    href: "/dashboard/certificates",
    labelKey: "dashboard.certificates",
    icon: Award,
  },
  {
    href: "/dashboard/report",
    labelKey: "dashboard.learningReport",
    icon: BarChart3,
  },
  {
    href: "/dashboard/orders",
    labelKey: "dashboard.paymentOrders",
    icon: ReceiptText,
  },
  {
    href: "/dashboard/settings",
    labelKey: "dashboard.profileSettings",
    icon: Settings,
  },
] as const;

function getInitials(name: string) {
  return (name || "S")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function StudentAccountMenu({
  profile,
  onLogout,
  className,
}: {
  profile: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  className?: string;
}) {
  const { t } = useAppTranslation();
  const router = useRouter();

  function handleLogout() {
    onLogout?.();
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-2 py-1.5 text-left text-white transition-colors hover:border-white/25 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/25",
          className,
        )}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
          <AvatarFallback className="bg-white/20 text-xs font-bold text-white">
            {getInitials(profile.name)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-semibold text-white">{profile.name}</p>
          <p className="truncate text-xs text-white/60">{profile.email}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-white/70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[280px] rounded-[1.5rem] border border-white/10 bg-slate-950/98 p-2 text-white shadow-[0_24px_60px_-36px_rgba(2,6,23,0.95)] backdrop-blur-2xl"
      >
        <div className="rounded-[1.25rem] border border-white/8 bg-white/5 px-4 py-3">
          <p className="truncate text-sm font-semibold text-white">{profile.name}</p>
          <p className="truncate text-xs text-white/55">{profile.email}</p>
        </div>

        <div className="mt-2 space-y-1">
          {studentAccountLinks.map((link) => (
            <DropdownMenuItem
              key={link.href}
              asChild
              className="rounded-xl px-3 py-3 text-sm text-white/80 focus:bg-white/10 focus:text-white"
            >
              <Link href={link.href}>
                <link.icon className="h-4 w-4" />
                {t(link.labelKey)}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="mx-1 my-2 bg-white/10" />

        <DropdownMenuItem
          onSelect={handleLogout}
          className="rounded-xl px-3 py-3 text-sm text-rose-300 focus:bg-rose-500/15 focus:text-rose-200"
        >
          <LogOut className="h-4 w-4" />
          {t("dashboard.logOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
