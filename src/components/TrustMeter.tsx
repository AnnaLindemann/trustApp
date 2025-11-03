// src/components/TrustMeter.tsx
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  /** 0..100 */
  value: number;
};

export default function TrustMeter({ value }: Props) {
  const v = clamp(value, 0, 100);
  const { t } = useTranslation();

  // подбираем «настроение» и статус по диапазону
  const mood = useMemo(() => {
    if (v < 25) return { emoji: "😟", key: "meter.status.low" };
    if (v < 50) return { emoji: "😐", key: "meter.status.midlow" };
    if (v < 75) return { emoji: "🙂", key: "meter.status.midhigh" };
    return { emoji: "🌟", key: "meter.status.high" };
  }, [v]);

  // вычисляем позицию «ползунка»
  const thumbLeft = `${v}%`;

  return (
    <div className="w-full">
      {/* Верхняя строка: статус + цифра */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-sm">
          <span aria-hidden>{mood.emoji}</span>
          <span className="font-medium">{t(mood.key)}</span>
        </div>
        <div className="text-sm opacity-70">{t("app.score", { value: v })}</div>
      </div>

      {/* Трек со шкалой */}
      <div
        className="relative h-5 rounded-2xl meter-track"
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("meter.label")}
      >
        {/* Ползунок */}
        <div
          className="absolute top-1/2 -translate-y-1/2 meter-thumb"
          style={{ left: thumbLeft }}
          aria-hidden
        />

        {/* Деления */}
        <div className="absolute inset-0 pointer-events-none">
          <Ticks />
        </div>
      </div>

      {/* Подписи делений */}
      <div className="mt-1 flex justify-between text-[11px] text-muted">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
}

function Ticks() {
  // 0,25,50,75,100
  return (
    <div className="h-full w-full grid grid-cols-4">
      {/* вертикальные штрихи рисуем псевдоэлементом через border */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="relative">
          <span className="absolute left-0 top-0 h-full border-l border-white/50"></span>
        </div>
      ))}
    </div>
  );
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}
