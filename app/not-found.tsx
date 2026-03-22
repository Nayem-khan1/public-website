import Link from "next/link";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocaleAndTranslations } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t } = await getLocaleAndTranslations();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
      <div className="text-center px-6">
        <Rocket className="w-20 h-20 mx-auto text-primary mb-6" />
        <h1 className="text-7xl font-display font-bold mb-4">404</h1>
        <h2 className="text-2xl font-display font-bold mb-4">{t("notFound.title")}</h2>
        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
          {t("notFound.description")}
        </p>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-lg shadow-primary/25"
        >
          <Link href="/">{t("notFound.returnHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
