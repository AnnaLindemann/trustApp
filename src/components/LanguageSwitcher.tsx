// src/components/LanguageSwitcher.tsx
import { useTranslation } from "react-i18next";

const langs = ["ru", "de", "en"] as const;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <div className="flex gap-2">
      {langs.map((lng) => {
        const active = i18n.resolvedLanguage === lng;
        return (
          <button
            key={lng}
            className={`btn ${active ? "btn-primary" : "btn-ghost"}`}
            aria-pressed={active}
            onClick={() => i18n.changeLanguage(lng)}
          >
            {lng.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
