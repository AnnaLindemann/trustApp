// src/components/ScoreBadge.tsx
import { useTranslation } from "react-i18next";
import { useTrustStore } from "../stores/useTrustStore"; // поправь путь при необходимости

export default function ScoreBadge() {
  const { t } = useTranslation();
  const score = useTrustStore((s) => s.trustScore);

  return (
    <span className="badge" aria-label={t("app.score", { value: score })}>
      {t("app.score", { value: score })}
    </span>
  );
}
