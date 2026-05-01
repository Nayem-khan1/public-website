import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import {
  getLocaleAndTranslations,
  getLocalizedMetadataLocale,
  getRequestLocale,
} from "@/lib/i18n/server";
import {
  buildMetadataAlternates,
  getLocalizedAbsoluteUrl,
  getSiteUrl,
} from "@/lib/i18n/seo";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bengali = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getLocaleAndTranslations();
  const siteName = `${t("brand.line1")} ${t("brand.line2")}`;
  const title = t("meta.siteTitle");
  const description = t("meta.siteDescription");

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: [
      "astronomy",
      "astrophysics",
      "Bangladesh",
      "education",
      "olympiad",
      "space science",
      "online courses",
      "জ্যোতির্বিজ্ঞান",
      "মহাকাশ বিজ্ঞান",
      "বাংলাদেশ",
    ],
    alternates: buildMetadataAlternates("/", locale),
    openGraph: {
      title,
      description,
      type: "website",
      locale: getLocalizedMetadataLocale(locale),
      siteName,
      url: getLocalizedAbsoluteUrl("/", locale),
    },
    icons: {
      icon: "/favicon.png",
      apple: "/favicon.png",
    },
    other: {
      "content-language": locale,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale} className={`scroll-smooth ${sans.variable} ${display.variable} ${bengali.variable}`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
