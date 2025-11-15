import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Intro() {
  const { t } = useTranslation();

  return (
    <main className="min-h-full bg-bg flex items-center justify-center px-4 py-8">
      <section className="card w-full max-w-xl px-6 py-8 space-y-6">
        <h1 className="text-2xl font-semibold text-fg">
          {t("intro.title")}
        </h1>

        <p className="text-base text-muted whitespace-pre-line">
          {t("intro.lead")}
        </p>

        <div className="pt-2">
          <Link
            to="/children/new"
            className="btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--brand-300)"
          >
            {t("intro.next")}
          </Link>
        </div>
      </section>
    </main>
  );
}
