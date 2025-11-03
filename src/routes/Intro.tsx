import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Intro() {
  const { t } = useTranslation();

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("intro.title")}</h1>
      <p className="text-base">{t("intro.lead")}</p>

      <Link
        to="/children/new"
        className="btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        {t("intro.next")}
      </Link>
    </main>
  );
}
