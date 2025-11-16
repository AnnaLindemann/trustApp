import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isInStandaloneMode() {
  if (window.matchMedia?.("(display-mode: standalone)").matches) {
    return true;
  }

  if ("standalone" in window.navigator) {
    const nav = window.navigator as unknown as { standalone?: boolean };
    if (nav.standalone) return true;
  }

  return false;
}

export default function InstallBanner() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) {
      return;
    }

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      const bipEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(bipEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  if (!visible || !deferredPrompt) {
    return null;
  }

  const onInstallClick = async () => {
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } finally {
      setVisible(false);
      setDeferredPrompt(null);
    }
  };

  const onNotNowClick = () => {
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:pb-6">
      <div className="mx-auto max-w-xl">
        <div className="card bg-card border border-border-token shadow-lg px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-fg">
              {t("install.bannerTitle")}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              {t("install.bannerDescription")}
            </p>
          </div>

          <div className="flex flex-row gap-2 sm:ml-4">
            <button
              type="button"
              className="btn btn-primary flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm"
              onClick={onInstallClick}
            >
              {t("install.installButton")}
            </button>
            <button
              type="button"
              className="btn btn-ghost flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm"
              onClick={onNotNowClick}
            >
              {t("install.notNowButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
