// src/routes/Repair.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useChildrenStore } from "../stores/useChildrenStore";
import { REPAIR_FLOW, REQUIRED_REPAIR_COUNT } from "../content/repairFlow";

export default function Repair() {
  // укажем ns один раз — дальше можно не повторять
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  // +3 к trust активного ребёнка
  const repairActive = useChildrenStore((s) => s.repairActive);

  // отмеченные шаги
  const [done, setDone] = useState<string[]>([]);

  // прогресс по обязательным
  const requiredDone = REPAIR_FLOW.filter(
    (s) => s.required && done.includes(s.id)
  ).length;
  const canComplete = requiredDone >= REQUIRED_REPAIR_COUNT;

  const leadId = "repair-lead";

  const toggle = (id: string) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  const onComplete = () => {
    if (!canComplete) return;
    repairActive();      // +3 активному ребёнку
    navigate("/trust");  // назад к шкале
  };

  // получить массив строк из i18n-ключа
  const tArr = (key?: string) => {
    if (!key) return [] as string[];
    const v = t(key, { returnObjects: true }) as unknown;
    return Array.isArray(v) ? (v as string[]) : ([] as string[]);
  };

  return (
    <main className="space-y-5">
      <h1 className="text-2xl font-semibold">{t("repair.title")}</h1>

      <p id={leadId} className="text-base opacity-90">
        {t("repair.lead")}
      </p>

      {/* Карточки шагов */}
      <section className="space-y-3">
        {REPAIR_FLOW.map((step) => {
          const checked = done.includes(step.id);
          return (
            <article
              key={step.id}
              className="border border-token rounded-2xl p-3"
            >
              <header className="flex items-start gap-3">
                <input
                  id={`step-${step.id}`}
                  type="checkbox"
                  className="mt-1"
                  checked={checked}
                  onChange={() => toggle(step.id)}
                  aria-describedby={`step-${step.id}-summary`}
                />
                <div>
                  <label
                    htmlFor={`step-${step.id}`}
                    className="font-medium text-base"
                  >
                    {t(step.titleKey)}
                    {step.required && (
                      <span className="ml-2 text-xs opacity-60">
                        {t("repair.required", { defaultValue: "• required" })}
                      </span>
                    )}
                    {typeof step.estimatedMin === "number" && (
                      <span className="ml-2 text-xs opacity-60">
                        ~{step.estimatedMin}
                        {t("repair.min", { defaultValue: "m" })}
                      </span>
                    )}
                  </label>
                  <p
                    id={`step-${step.id}-summary`}
                    className="text-sm opacity-80 mt-1"
                  >
                    {t(step.summaryKey)}
                  </p>
                </div>
              </header>

              {/* Подсказки/вопросы */}
              {step.promptsKeys?.map((k, i) => {
                const items = tArr(k);
                if (!items.length) return null;
                return (
                  <ul
                    key={`${step.id}-prompts-${i}`}
                    className="list-disc pl-6 mt-2 space-y-1"
                  >
                    {items.map((text, idx) => (
                      <li key={idx} className="text-sm">
                        {text}
                      </li>
                    ))}
                  </ul>
                );
              })}

              {/* Упражнения */}
              {step.exerciseKeys?.map((k, i) => {
                const items = tArr(k);
                if (!items.length) return null;
                return (
                  <ol
                    key={`${step.id}-exercises-${i}`}
                    className="list-decimal pl-6 mt-2 space-y-1"
                  >
                    {items.map((text, idx) => (
                      <li key={idx} className="text-sm">
                        {text}
                      </li>
                    ))}
                  </ol>
                );
              })}
            </article>
          );
        })}
      </section>

      {/* Прогресс и кнопка */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm opacity-70">
          {requiredDone}/{REQUIRED_REPAIR_COUNT}{" "}
          {t("repair.requiredShort", { defaultValue: "required" })}
        </span>

        <button
          className="btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-describedby={leadId}
          onClick={onComplete}
          disabled={!canComplete}
        >
          {t("repair.complete")}
        </button>
      </div>
    </main>
  );
}
