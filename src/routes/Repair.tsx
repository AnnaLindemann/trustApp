// src/routes/Repair.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useChildrenStore } from "../stores/useChildrenStore";
import { REPAIR_FLOW, REQUIRED_REPAIR_COUNT } from "../content/repairFlow";

export default function Repair() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  const repairActive = useChildrenStore((s) => s.repairActive);

  const [done, setDone] = useState<string[]>([]);

  const requiredDone = REPAIR_FLOW.filter(
    (s) => s.required && done.includes(s.id)
  ).length;
  const canComplete = requiredDone >= REQUIRED_REPAIR_COUNT;

  const leadId = "repair-lead";

  const toggle = (id: string) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  const onComplete = () => {
    if (!canComplete) return;
    repairActive();
    navigate("/trust");
  };

  const tArr = (key?: string) => {
    if (!key) return [] as string[];
    const v = t(key, { returnObjects: true }) as unknown;
    return Array.isArray(v) ? (v as string[]) : ([] as string[]);
  };

  return (
    <main className="space-y-5 text-fg">
      <h1 className="text-2xl font-semibold">
        {t("repair.title")}
      </h1>

      <p id={leadId} className="text-base text-muted">
        {t("repair.lead")}
      </p>

      <section className="space-y-3">
        {REPAIR_FLOW.map((step) => {
          const checked = done.includes(step.id);
          const stepBg = step.required ? "note-mint" : "note-sky";

          return (
            <article
              key={step.id}
              className={`rounded-2xl border border-token p-3 ${stepBg}`}
            >
              <header className="flex items-start gap-3">
                <input
                  id={`step-${step.id}`}
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-(--brand-500)]"
                  checked={checked}
                  onChange={() => toggle(step.id)}
                  aria-describedby={`step-${step.id}-summary`}
                />
                <div>
                  <label
                    htmlFor={`step-${step.id}`}
                    className="text-base font-medium text-fg"
                  >
                    {t(step.titleKey)}
                    {step.required && (
                      <span className="ml-2 text-xs text-muted">
                        {t("repair.required", {
                          defaultValue: "• required",
                        })}
                      </span>
                    )}
                    {typeof step.estimatedMin === "number" && (
                      <span className="ml-2 text-xs text-muted">
                        ~{step.estimatedMin}
                        {t("repair.min", { defaultValue: "m" })}
                      </span>
                    )}
                  </label>
                  <p
                    id={`step-${step.id}-summary`}
                    className="mt-1 text-sm text-muted"
                  >
                    {t(step.summaryKey)}
                  </p>
                </div>
              </header>

              {step.promptsKeys?.map((k, i) => {
                const items = tArr(k);
                if (!items.length) return null;
                return (
                  <ul
                    key={`${step.id}-prompts-${i}`}
                    className="mt-2 space-y-1 list-disc pl-6"
                  >
                    {items.map((text, idx) => (
                      <li key={idx} className="text-sm text-fg">
                        {text}
                      </li>
                    ))}
                  </ul>
                );
              })}

              {step.exerciseKeys?.map((k, i) => {
                const items = tArr(k);
                if (!items.length) return null;
                return (
                  <ol
                    key={`${step.id}-exercises-${i}`}
                    className="mt-2 space-y-1 list-decimal pl-6"
                  >
                    {items.map((text, idx) => (
                      <li key={idx} className="text-sm text-fg">
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

      <div className="flex items-center justify-between gap-3 pt-2">
        <span className="text-sm text-muted">
          {requiredDone}/{REQUIRED_REPAIR_COUNT}{" "}
          {t("repair.requiredShort", { defaultValue: "required" })}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => navigate(-1)}
          >
            {t("repair.back")}
          </button>

          <button
            type="button"
            className="btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-describedby={leadId}
            onClick={onComplete}
            disabled={!canComplete}
          >
            {t("repair.complete")}
          </button>
        </div>
      </div>
    </main>
  );
}
