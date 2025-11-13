// src/routes/Trust.tsx
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { useChildrenStore } from "../stores/useChildrenStore";
import TrustMeter from "../components/TrustMeter";

type ActiveBtn = "truth" | "lie" | "repair" | null;

export default function Trust() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Подписываемся ТОЛЬКО на стор детей
  const children = useChildrenStore((s) => s.children);
  const activeChildId = useChildrenStore((s) => s.activeChildId);
  const setActiveChild = useChildrenStore((s) => s.setActiveChild);

  // Новые экшены для счёта активного ребёнка
  const truthActive = useChildrenStore((s) => s.truthActive);
  const lieActive = useChildrenStore((s) => s.lieActive);

  // Текущий активный ребёнок и его счёт
  const activeChild = useMemo(
    () => children.find((c) => c.id === activeChildId) ?? null,
    [children, activeChildId]
  );
  const score = activeChild?.trustScore ?? 0;

  // Визуальная подсветка последней нажатой кнопки
  const [activeBtn, setActiveBtn] = useState<ActiveBtn>(null);
  const activeRing =
    "ring-2 ring-offset-2 ring-offset-transparent ring-[color:var(--brand-400)]";

  return (
    <main className="space-y-4">
      {/* Заголовок + переход к добавлению ребёнка */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("trust.title")}</h1>
        <Link
          to="/children/new"
          className="btn focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          {t("trust.addChild")}
        </Link>
      </div>

      {/* Если нет детей — призыв добавить */}
      {!activeChild && (
        <div className="card p-4">
          <p className="mb-3">{t("child.single")}</p>
          <Link to="/children/new" className="btn btn-primary">
            {t("trust.addChild")}
          </Link>
        </div>
      )}

      {/* Имя/фото активного ребёнка + селектор при >1 ребёнке */}
      {activeChild && (
        <div className="flex items-center gap-3">
          {activeChild.photoUrl && (
            <img
              src={activeChild.photoUrl}
              alt={activeChild.name}
              className="h-10 w-10 rounded-2xl object-cover border border-token"
            />
          )}
          <div className="text-sm">
            <div className="font-medium">{activeChild.name}</div>
            <div className="text-muted">
              {children.length > 1 ? t("child.current") : t("child.single")}
            </div>
          </div>

          {children.length > 1 && (
            <select
              className="input h-9 px-2 ml-auto"
              value={activeChildId ?? ""}
              onChange={(e) => setActiveChild(e.target.value || null)}
              aria-label={t("child.choose")}
            >
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Шкала доверия ДЛЯ АКТИВНОГО ребёнка */}
      {activeChild && (
        <div className="space-y-3">
          <TrustMeter value={score} />
        </div>
      )}

      {/* Три кнопки действий — бьют в активного ребёнка */}
      <div className="flex gap-3">
        <button
          className={`btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            activeBtn === "truth" ? activeRing : ""
          }`}
          onClick={() => {
            truthActive();     // +5 активному
            setActiveBtn("truth");
          }}
          disabled={!activeChild}
          aria-pressed={activeBtn === "truth"}
        >
          {t("btn.truth")}
        </button>

        <button
          className={`btn focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            activeBtn === "lie" ? activeRing : ""
          }`}
          onClick={() => {
            lieActive();       // -10 активному
            setActiveBtn("lie");
          }}
          disabled={!activeChild}
          aria-pressed={activeBtn === "lie"}
        >
          {t("btn.lie")}
        </button>

        <button
          className={`btn focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            activeBtn === "repair" ? activeRing : ""
          }`}
          onClick={() => {
            setActiveBtn("repair");
            navigate("/repair"); // +3 произойдёт на /repair
          }}
          disabled={!activeChild}
          aria-pressed={activeBtn === "repair"}
        >
          {t("btn.repair")}
        </button>
      </div>
    </main>
  );
}
