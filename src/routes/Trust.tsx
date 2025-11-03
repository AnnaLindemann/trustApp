import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useTrustStore } from "../stores/useTrustStore";
import TrustMeter from "../components/TrustMeter";

type ActiveBtn = "truth" | "lie" | "repair" | null;

export default function Trust() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const trustScore = useTrustStore((s) => s.trustScore);
  const truth = useTrustStore((s) => s.truth);
  const lie = useTrustStore((s) => s.lie);

  // Последняя «активная» кнопка — для видимой подсветки
  const [activeBtn, setActiveBtn] = useState<ActiveBtn>(null);

  // Утилита для подсветки активной кнопки
  const activeRing =
    "ring-2 ring-offset-2 ring-offset-transparent ring-[color:var(--brand-400)]";

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("trust.title")}</h1>

        <Link
          to="/children/new"
          className="btn focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          {t("trust.addChild")}
        </Link>
      </div>

      <div className="space-y-3">
        <TrustMeter value={trustScore} />
      </div>

      {/* Три кнопки действий */}
      <div className="flex gap-3">
        <button
          className={`btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            activeBtn === "truth" ? activeRing : ""
          }`}
          onClick={() => {
            truth();
            setActiveBtn("truth");
          }}
          aria-pressed={activeBtn === "truth"}
        >
          {t("btn.truth")}
        </button>

        <button
          className={`btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            activeBtn === "lie" ? activeRing : ""
          }`}
          onClick={() => {
            lie();
            setActiveBtn("lie");
          }}
          aria-pressed={activeBtn === "lie"}
        >
          {t("btn.lie")}
        </button>

        <button
          className={`btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            activeBtn === "repair" ? activeRing : ""
          }`}
          onClick={() => {
            setActiveBtn("repair");
            navigate("/repair");
          }}
          aria-pressed={activeBtn === "repair"}
        >
          {t("btn.repair")}
        </button>
      </div>
    </main>
  );
}
