"use client";

/* Native images avoid runtime image-proxy dependence for the installable logo. */
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type SiteClientProps = {
  phone: string;
  whatsappBase: string;
  directionsUrl: string;
};

const INSTALL_DISMISSED_AT = "mina-site-install-dismissed-at";
const INSTALL_COOLDOWN = 7 * 24 * 60 * 60 * 1000;
const UPDATE_RELOAD_KEY = "mina-site-update-reload";

function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function detectIos() {
  const userAgent = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(userAgent) ||
    (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
}

function safeCampaignValue(value: string | null) {
  if (!value) return "";
  return value.replace(/[^a-zA-Z0-9_\-.]/g, "").slice(0, 64);
}

export function SiteClient({ phone, whatsappBase, directionsUrl }: SiteClientProps) {
  const [installOpen, setInstallOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installMessage, setInstallMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("نسخه سایت به‌روز است");
  const assistantRef = useRef<HTMLDivElement>(null);

  const whatsappUrl = useMemo(
    () => `${whatsappBase}?text=${encodeURIComponent("سلام، برای دریافت نوبت و مشاوره پیام می‌دهم.")}`,
    [whatsappBase],
  );

  const closeInstall = useCallback(() => {
    setInstallOpen(false);
    try {
      window.localStorage.setItem(INSTALL_DISMISSED_AT, String(Date.now()));
    } catch {
      // Storage may be unavailable in private browsing.
    }
  }, []);

  useEffect(() => {
    const standalone = isStandaloneMode();
    const ios = detectIos();
    const platformTimer = window.setTimeout(() => {
      setIsStandalone(standalone);
      setIsIos(ios);
    }, 0);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsStandalone(true);
      setInstallOpen(false);
      setInstallMessage("برنامه مینا با موفقیت روی دستگاه نصب شد.");
      try {
        window.localStorage.removeItem(INSTALL_DISMISSED_AT);
      } catch {
        // Storage may be unavailable.
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    let dismissedAt = 0;
    try {
      dismissedAt = Number(window.localStorage.getItem(INSTALL_DISMISSED_AT) || 0);
    } catch {
      // Storage may be unavailable.
    }

    const timer = window.setTimeout(() => {
      if (!standalone && Date.now() - dismissedAt > INSTALL_COOLDOWN) {
        setInstallOpen(true);
      }
    }, 3600);

    return () => {
      window.clearTimeout(platformTimer);
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  useEffect(() => {
    const openInstall = () => setInstallOpen(true);
    const buttons = document.querySelectorAll<HTMLElement>("[data-open-install]");
    buttons.forEach((button) => button.addEventListener("click", openInstall));
    return () => buttons.forEach((button) => button.removeEventListener("click", openInstall));
  }, []);

  useEffect(() => {
    let idleTimer = window.setTimeout(() => setIsIdle(true), 22000);
    const markActive = () => {
      setIsIdle(false);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setIsIdle(true), 22000);
    };
    const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll"];
    events.forEach((event) => window.addEventListener(event, markActive, { passive: true }));
    return () => {
      window.clearTimeout(idleTimer);
      events.forEach((event) => window.removeEventListener(event, markActive));
    };
  }, []);

  useEffect(() => {
    if (!assistantOpen) return;
    const handleOutside = (event: PointerEvent) => {
      if (assistantRef.current && !assistantRef.current.contains(event.target as Node)) {
        setAssistantOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [assistantOpen]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const campaign = safeCampaignValue(params.get("utm_campaign"));
    const source = safeCampaignValue(params.get("utm_source"));
    if (!campaign && !source) return;

    const attribution = [source && `منبع: ${source}`, campaign && `کمپین: ${campaign}`]
      .filter(Boolean)
      .join(" | ");

    document.querySelectorAll<HTMLAnchorElement>("[data-whatsapp-link]").forEach((link) => {
      try {
        const url = new URL(link.href);
        const currentText = url.searchParams.get("text") || "سلام، برای دریافت نوبت پیام می‌دهم.";
        url.searchParams.set("text", `${currentText}\n${attribution}`);
        link.href = url.toString();
      } catch {
        // Keep the original verified link if parsing fails.
      }
    });
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) {
      const messageTimer = window.setTimeout(
        () => setUpdateMessage("به‌روزرسانی خودکار پس از انتشار HTTPS فعال می‌شود"),
        0,
      );
      return () => window.clearTimeout(messageTimer);
    }

    let registration: ServiceWorkerRegistration | null = null;
    let updateTimer = 0;
    let reloading = false;

    try {
      window.sessionStorage.removeItem(UPDATE_RELOAD_KEY);
    } catch {
      // Storage may be unavailable.
    }

    const activateWaitingWorker = () => {
      registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
    };

    const watchInstallingWorker = (worker: ServiceWorker | null) => {
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          setUpdateMessage("نسخه جدید آماده شد؛ در حال فعال‌سازی…");
          activateWaitingWorker();
        }
      });
    };

    const checkForUpdates = async () => {
      if (!registration || !navigator.onLine) return;
      try {
        await registration.update();
        activateWaitingWorker();
        setUpdateMessage("نسخه سایت به‌روز است");
      } catch {
        setUpdateMessage("بررسی نسخه جدید پس از اتصال اینترنت تکرار می‌شود");
      }
    };

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        watchInstallingWorker(registration.installing);
        registration.addEventListener("updatefound", () =>
          watchInstallingWorker(registration?.installing ?? null),
        );
        activateWaitingWorker();
        await checkForUpdates();
        updateTimer = window.setInterval(checkForUpdates, 15 * 60 * 1000);
      } catch {
        setUpdateMessage("فعال‌سازی به‌روزرسانی خودکار ناموفق بود");
      }
    };

    const handleControllerChange = () => {
      if (reloading) return;
      reloading = true;
      try {
        window.sessionStorage.setItem(UPDATE_RELOAD_KEY, "1");
      } catch {
        // Reload still provides the latest worker when storage is unavailable.
      }
      window.location.reload();
    };

    const handleVisible = () => {
      if (document.visibilityState === "visible") void checkForUpdates();
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
    window.addEventListener("online", checkForUpdates);
    document.addEventListener("visibilitychange", handleVisible);
    void register();

    return () => {
      window.clearInterval(updateTimer);
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      window.removeEventListener("online", checkForUpdates);
      document.removeEventListener("visibilitychange", handleVisible);
    };
  }, []);

  const requestInstall = async () => {
    if (isStandalone) {
      setInstallMessage("برنامه مینا از قبل روی این دستگاه نصب شده است.");
      return;
    }

    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (choice.outcome === "accepted") {
        setInstallMessage("درخواست نصب پذیرفته شد.");
      } else {
        setInstallMessage("نصب انجام نشد؛ هر زمان خواستید دوباره امتحان کنید.");
      }
      return;
    }

    if (isIos) {
      setInstallMessage("در Safari دکمه اشتراک‌گذاری را بزنید و Add to Home Screen را انتخاب کنید.");
      return;
    }

    setInstallMessage("منوی مرورگر را باز کنید و گزینه Install app یا Add to Home Screen را بزنید.");
  };

  return (
    <>
      <nav className="mobile-dock" aria-label="دسترسی سریع موبایل">
        <a href="#home"><span aria-hidden="true">⌂</span><small>خانه</small></a>
        <a href="#services"><span aria-hidden="true">＋</span><small>خدمات</small></a>
        <a className="dock-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
          <span aria-hidden="true">●</span><small>نوبت</small>
        </a>
        <a href={directionsUrl} target="_blank" rel="noreferrer"><span aria-hidden="true">⌖</span><small>مسیر</small></a>
        <a href={`tel:${phone}`}><span aria-hidden="true">✆</span><small>تماس</small></a>
      </nav>

      <div className={`mina-assistant ${isIdle ? "is-idle" : "is-active"}`} ref={assistantRef}>
        {assistantOpen && (
          <div className="assistant-panel" role="dialog" aria-label="راهنمای سریع مینا">
            <div className="assistant-heading">
              <span>
                <strong>مینا کنار شماست</strong>
                <small>چه کاری می‌خواهید انجام دهید؟</small>
              </span>
              <button type="button" onClick={() => setAssistantOpen(false)} aria-label="بستن راهنما">×</button>
            </div>
            <div className="assistant-actions">
              <a href={whatsappUrl} target="_blank" rel="noreferrer">درخواست نوبت</a>
              <a href={directionsUrl} target="_blank" rel="noreferrer">مسیریابی تا مطب</a>
              <a href="#services" onClick={() => setAssistantOpen(false)}>انتخاب نوع خدمت</a>
              <button type="button" onClick={() => { setAssistantOpen(false); setInstallOpen(true); }}>نصب برنامه مینا</button>
            </div>
            <div className="assistant-status" aria-live="polite">{updateMessage}</div>
          </div>
        )}
        <button
          className="assistant-trigger"
          type="button"
          aria-expanded={assistantOpen}
          aria-label={assistantOpen ? "بستن راهنمای مینا" : "باز کردن راهنمای مینا"}
          onClick={() => setAssistantOpen((current) => !current)}
        >
          <img src="/mina-logo.jpeg" alt="" width={70} height={70} />
          <span className="assistant-mood" aria-hidden="true">{isIdle ? "…" : "✓"}</span>
        </button>
        {!assistantOpen && <span className="assistant-hint">{isIdle ? "هنوز اینجام" : "کمکتان کنم؟"}</span>}
      </div>

      {installOpen && (
        <div className="install-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) closeInstall();
        }}>
          <section className="install-dialog" role="dialog" aria-modal="true" aria-labelledby="install-title">
            <button className="install-close" type="button" onClick={closeInstall} aria-label="بستن پنجره نصب">×</button>
            <div className="install-art">
              <span className="install-glow" aria-hidden="true" />
              <img src="/mina-logo.jpeg" alt="لوگوی برنامه مینا" width={154} height={154} />
              <span className="install-mini-badge">MINA</span>
            </div>
            <div className="install-content">
              <span className="install-kicker">یک لمس تا دسترسی سریع‌تر</span>
              <h2 id="install-title">برنامه مینا را روی گوشی داشته باشید</h2>
              <p>نوبت، تماس، مسیر مطب و نسخه‌های جدید همیشه در دسترس شماست.</p>

              {isIos ? (
                <ol className="ios-steps">
                  <li><span>۱</span><p><strong>Safari</strong> را باز نگه دارید.</p></li>
                  <li><span>۲</span><p>دکمه <strong>Share / اشتراک‌گذاری</strong> را بزنید.</p></li>
                  <li><span>۳</span><p><strong>Add to Home Screen</strong> و سپس Add را انتخاب کنید.</p></li>
                </ol>
              ) : (
                <div className="install-benefits">
                  <span>بدون دانلود از فروشگاه</span>
                  <span>آیکن واقعی روی صفحه گوشی</span>
                  <span>دریافت خودکار به‌روزرسانی‌ها</span>
                </div>
              )}

              {installMessage && <p className="install-message" aria-live="polite">{installMessage}</p>}

              <div className="install-actions">
                <button className="button button-primary" type="button" onClick={requestInstall}>
                  {isIos ? "نمایش راهنمای نصب آیفون" : installPrompt ? "نصب امن برنامه" : "راهنمای نصب روی این گوشی"}
                </button>
                <button className="button button-quiet" type="button" onClick={closeInstall}>بعداً</button>
              </div>
              <small className="install-privacy">نصب فقط با انتخاب شما انجام می‌شود و اطلاعات پزشکی ذخیره نمی‌کند.</small>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
