import type { Metadata } from "next";
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
    <html lang={locale} className="scroll-smooth">
      <body className="font-sans antialiased" suppressHydrationWarning>
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
