import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  value: number;
};

export default function TrustMeter({ value }: Props) {
  const v = clamp(value, 0, 100);
  const { t } = useTranslation();

  const mood = useMemo(() => {
    if (v < 25) return { emoji: "😟", key: "meter.status.low" };
    if (v < 50) return { emoji: "😐", key: "meter.status.midlow" };
    if (v < 75) return { emoji: "🙂", key: "meter.status.midhigh" };
    return { emoji: "🌟", key: "meter.status.high" };
  }, [v]);

  const thumbLeft = `${v}%`;

  return (
    <div className="w-full">
      
      <div className="mb-1 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span aria-hidden>{mood.emoji}</span>
          <span className="font-medium text-fg">
            {t(mood.key)}
          </span>
        </div>
        <div className="text-muted">
          {t("app.score", { value: v })}
        </div>
      </div>

      
      <div
        className="meter-track relative h-5 rounded-2xl"
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("meter.label")}
      >
     
        <div
          className="meter-thumb absolute top-1/2 -translate-y-1/2"
          style={{ left: thumbLeft }}
          aria-hidden
        />

      
        <div className="pointer-events-none absolute inset-0">
          <Ticks />
        </div>
      </div>

   
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
  return (
    <div className="grid h-full w-full grid-cols-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="relative">
          <span className="absolute left-0 top-0 h-full border-l border-white/50" />
        </div>
      ))}
    </div>
  );
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}
