import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../stores/useAppStore";

export default function Intro() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const hasCompletedOnboarding = useAppStore(
    (state) => state.hasCompletedOnboarding,
  );
  const completeOnboarding = useAppStore(
    (state) => state.completeOnboarding,
  );

  const handleNext = () => {
    if (!hasCompletedOnboarding) {
      completeOnboarding();
      navigate("/children/new");
    } else {
      navigate("/trust");
    }
  };

  return (
    <main className="min-h-full bg-bg flex items-center justify-center px-4 py-8">
      <section className="card w-full max-w-xl px-6 py-8 space-y-6">
        <h1 className="text-2xl font-semibold text-fg">
          {t("intro.title")}
        </h1>

        <p className="text-base text-muted whitespace-pre-line">
          {t("intro.lead")}
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleNext}
            className="btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--brand-300)"
          >
            {t("intro.next")}
          </button>
        </div>
      </section>
    </main>
  );
}
