import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import ScoreBadge from "./ScoreBadge";
import logoHeader from "../assets/logoText.svg";

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();

  const showScore =
    location.pathname.startsWith("/trust") ||
    location.pathname.startsWith("/repair");

  return (
    <header className="mb-4 flex flex-col gap-2 sm:gap-3 border-b border-token pb-3 bg-bg">
      <div className="flex items-center justify-between gap-2">
        <Link
          to="/intro"
          className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <img
            src={logoHeader}
            alt={t("app.title")}
            className="h-8 w-auto sm:h-10"
          />
          <span className="sr-only">{t("app.title")}</span>
        </Link>

        <div className="origin-right scale-90 sm:scale-100">
          <LanguageSwitcher />
        </div>
      </div>

      {showScore && (
        <div className="flex w-full justify-center sm:justify-start">
          <ScoreBadge />
        </div>
      )}
    </header>
  );
}
