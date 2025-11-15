
import { useTranslation } from "react-i18next";
import { useChildrenStore } from "../stores/useChildrenStore";

export default function ScoreBadge() {
  const { t } = useTranslation();

  
  const score = useChildrenStore((s) => {
    const active = s.children.find((c) => c.id === s.activeChildId);
    return active?.trustScore ?? 0; 
  });

  return (
    <span className="badge" aria-label={t("app.score", { value: score })}>
      {t("app.score", { value: score })}
    </span>
  );
}

