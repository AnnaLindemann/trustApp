import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ScoreBadge from "./ScoreBadge";

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="mb-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold">{t("app.title")}</h1>

      <div className="flex items-center gap-3">
        <ScoreBadge />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
