import Link from "next/link";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { getLocaleAndTranslations } from "@/lib/i18n/server";

export async function Footer() {
  const { t } = await getLocaleAndTranslations();

  return (
    <footer className="bg-slate-900 text-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                AP
              </div>
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                {t("brand.line1")}
                <span className="text-primary">{t("brand.line2")}</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t("footer.description")}
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Linkedin, href: "#" },
                { Icon: Instagram, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-white text-lg mb-6">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-3">
              {[
                { label: t("footer.allCourses"), href: "/courses" },
                { label: t("footer.upcomingEvents"), href: "/events" },
                { label: t("footer.ourInstructors"), href: "/team" },
                { label: t("footer.blogAndNews"), href: "/blog" },
                { label: t("footer.aboutUs"), href: "/about" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white text-lg mb-6">
              {t("footer.categories")}
            </h3>
            <ul className="space-y-3">
              {[
                t("footer.categoryAstronomy"),
                t("footer.categoryAstrophysics"),
                t("footer.categoryOlympiad"),
                t("footer.categoryObservation"),
                t("footer.categoryCosmology"),
              ].map((category) => (
                <li key={category}>
                  <Link
                    href="/courses"
                    className="text-slate-400 hover:text-primary transition-colors text-sm"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white text-lg mb-6">
              {t("footer.getInTouch")}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>
                  {t("footer.addressLine1")}
                  <br />
                  {t("footer.addressLine2")}
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+880 1712 345678</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>info@astronomypathshala.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            &copy; 2026 {t("brand.line1")} {t("brand.line2")}. {t("footer.rightsReserved")}
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.privacyPolicy")}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.termsOfService")}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.cookiePolicy")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
