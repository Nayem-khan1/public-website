import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: {
    default: "Astronomy Pathshala — Bangladesh's #1 Astronomy Education Platform",
    template: "%s | Astronomy Pathshala",
  },
  description:
    "Explore the universe with Bangladesh's leading astronomy & space science education platform. Online courses, Olympiad prep, live classes, and more.",
  keywords: [
    "astronomy",
    "astrophysics",
    "Bangladesh",
    "education",
    "olympiad",
    "space science",
    "online courses",
  ],
  openGraph: {
    title: "Astronomy Pathshala — Bangladesh's #1 Astronomy Education Platform",
    description:
      "Explore the universe with Bangladesh's leading astronomy & space science education platform.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getServerLocale();
  const messages = getMessages(locale);

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
