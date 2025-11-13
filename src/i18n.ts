import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ru from "./locales/ru/common.json";
import de from "./locales/de/common.json";
import en from "./locales/en/common.json";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { ru: { common: ru }, de: { common: de }, en: { common: en } },
    debug: true,
    fallbackLng: { default: ["ru"], de: ["ru"], en: ["ru"] },
    supportedLngs: ["ru", "de", "en"],
    load: "currentOnly",                 // de-DE → de
    nonExplicitSupportedLngs: true,
    ns: ["common"],
    defaultNS: "common",
    detection: { order: ["querystring", "localStorage", "navigator"], caches: ["localStorage"] },
    interpolation: { escapeValue: false },
    returnEmptyString: false
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng || "ru";
  console.log("[i18n] languageChanged:", lng);
});

export default i18n;
