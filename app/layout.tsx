import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

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
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${plusJakarta.variable} font-sans antialiased`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
