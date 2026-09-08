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
const INSTALL_NUDGE_DELAY = 12_000;
const UPDATE_RELOAD_KEY = "mina-site-update-reload";

type MinaConversionAction =
  | "appointment_whatsapp"
  | "phone_call"
  | "directions"
  | "pwa_install_open"
  | "pwa_install_accept";

type MinaDataLayerWindow = Window & {
  dataLayer?: Array<Record<string, string>>;
};

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

function emitConversion(action: MinaConversionAction, label = "") {
  const params = new URLSearchParams(window.location.search);
  const payload = {
    event: "mina_conversion",
    action,
    label: label.slice(0, 80),
    source: safeCampaignValue(params.get("utm_source")),
    campaign: safeCampaignValue(params.get("utm_campaign")),
    path: window.location.pathname,
  };

  window.dispatchEvent(new CustomEvent("mina:conversion", { detail: payload }));
  (window as MinaDataLayerWindow).dataLayer?.push(payload);
}

type LiveRouteButtonProps = {
  destination: string;
  fallbackUrl: string;
};

export function LiveRouteButton({ destination, fallbackUrl }: LiveRouteButtonProps) {
  const [state, setState] = useState<"idle" | "locating" | "ready" | "denied" | "unsupported">("idle");
  const [liveUrl, setLiveUrl] = useState("");
  const requestButtonRef = useRef<HTMLButtonElement>(null);
  const readyLinkRef = useRef<HTMLAnchorElement>(null);
  const locationPendingRef = useRef(false);
  const transferRouteFocusRef = useRef(false);

  useEffect(() => {
    if (state !== "ready" || !transferRouteFocusRef.current) return;
    transferRouteFocusRef.current = false;
    if (document.activeElement === document.body) {
      readyLinkRef.current?.focus();
    }
  }, [state]);

  const requestLocation = () => {
    if (locationPendingRef.current) return;
    if (!("geolocation" in navigator)) {
      setState("unsupported");
      return;
    }

    locationPendingRef.current = true;
    setState("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const origin = `${coords.latitude.toFixed(6)},${coords.longitude.toFixed(6)}`;
        const url = new URL("https://www.google.com/maps/dir/");
        url.searchParams.set("api", "1");
        url.searchParams.set("origin", origin);
        url.searchParams.set("destination", destination);
        url.searchParams.set("travelmode", "driving");
        url.searchParams.set("dir_action", "navigate");
        transferRouteFocusRef.current = document.activeElement === requestButtonRef.current;
        locationPendingRef.current = false;
        setLiveUrl(url.toString());
        setState("ready");
      },
      () => {
        locationPendingRef.current = false;
        setState("denied");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  };

  return (
    <div className="live-route-control">
      {state !== "ready" ? (
        <button
          ref={requestButtonRef}
          className="live-route-button"
          type="button"
          data-conversion="directions"
          data-conversion-label="live-location-request"
          onClick={requestLocation}
          aria-disabled={state === "locating"}
          aria-busy={state === "locating"}
        >
          <span className="live-route-icon" aria-hidden="true">⌖</span>
          <span>
            <strong>{state === "locating" ? "در حال دریافت موقعیت شما…" : "دریافت موقعیت من برای مسیریابی"}</strong>
            <small>با اجازهٔ شما، موقعیت دریافت می‌شود؛ با بازکردن مسیر، آن را با نقشهٔ گوگل به اشتراک می‌گذارید.</small>
          </span>
        </button>
      ) : (
        <a
          ref={readyLinkRef}
          className="live-route-button is-ready"
          data-conversion="directions"
          data-conversion-label="live-location-ready"
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span className="live-route-icon" aria-hidden="true">✓</span>
          <span>
            <strong>مسیر آماده است</strong>
            <small>برای بازکردن مسیر در Google Maps لمس کنید</small>
          </span>
        </a>
      )}
      <div className="live-route-status" aria-live="polite">
        {state === "ready" && <span>مسیر آماده است؛ برای ادامه، لینک «مسیر آماده است» را باز کنید.</span>}
        {state === "denied" && (
          <span>موقعیت شما دریافت نشد؛ اجازهٔ دسترسی و روشن‌بودن مکان‌یابی را بررسی کنید. <a href={fallbackUrl} target="_blank" rel="noreferrer">بازکردن نقشه و انتخاب مبدأ</a></span>
        )}
        {state === "unsupported" && (
          <span>دریافت موقعیت در این مرورگر در دسترس نیست. <a href={fallbackUrl} target="_blank" rel="noreferrer">بازکردن مسیر عادی</a></span>
        )}
      </div>
    </div>
  );
}

export function SiteClient({ phone, whatsappBase, directionsUrl }: SiteClientProps) {
  const [installOpen, setInstallOpen] = useState(false);
  const [installNudgeOpen, setInstallNudgeOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installMessage, setInstallMessage] = useState("");
  const [installPending, setInstallPending] = useState(false);
  const installPendingRef = useRef(false);
  const installedRef = useRef(false);
  const [updateMessage, setUpdateMessage] = useState("بررسی به‌روزرسانی سایت");
  const assistantRef = useRef<HTMLDivElement>(null);
  const assistantTriggerRef = useRef<HTMLButtonElement>(null);
  const assistantPanelRef = useRef<HTMLDivElement>(null);
  const installDialogRef = useRef<HTMLElement>(null);
  const installReturnFocusRef = useRef<HTMLElement | null>(null);

  const whatsappUrl = useMemo(
    () => `${whatsappBase}?text=${encodeURIComponent("سلام، برای دریافت نوبت و مشاوره پیام می‌دهم.")}`,
    [whatsappBase],
  );

  const rememberInstallDismissal = useCallback(() => {
    try {
      window.localStorage.setItem(INSTALL_DISMISSED_AT, String(Date.now()));
    } catch {
      // Storage may be unavailable in private browsing.
    }
  }, []);

  const closeInstall = useCallback(() => {
    setInstallOpen(false);
    rememberInstallDismissal();
  }, [rememberInstallDismissal]);

  const dismissInstallNudge = useCallback(() => {
    setInstallNudgeOpen(false);
    rememberInstallDismissal();
  }, [rememberInstallDismissal]);

  const openInstall = useCallback(() => {
    installReturnFocusRef.current = document.activeElement as HTMLElement | null;
    setInstallNudgeOpen(false);
    setInstallOpen(true);
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
      installedRef.current = true;
      setIsStandalone(true);
      setInstallPrompt(null);
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
        setInstallNudgeOpen(true);
      }
    }, INSTALL_NUDGE_DELAY);

    return () => {
      window.clearTimeout(platformTimer);
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  useEffect(() => {
    const handleOpenInstall = () => openInstall();
    const buttons = document.querySelectorAll<HTMLElement>("[data-open-install]");
    buttons.forEach((button) => button.addEventListener("click", handleOpenInstall));
    return () => buttons.forEach((button) => button.removeEventListener("click", handleOpenInstall));
  }, [openInstall]);

  useEffect(() => {
    const trackConversion = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>("[data-conversion]");
      if (!target) return;
      emitConversion(
        target.dataset.conversion as MinaConversionAction,
        target.dataset.conversionLabel || "",
      );
    };

    document.addEventListener("click", trackConversion);
    return () => document.removeEventListener("click", trackConversion);
  }, []);

  useEffect(() => {
    if (!installOpen) return;

    const dialog = installDialogRef.current;
    if (!dialog) return;
    const fallbackFocusTarget = assistantTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );

    window.requestAnimationFrame(() => getFocusable()[0]?.focus());

    const handleDialogKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeInstall();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleDialogKeydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleDialogKeydown);
      window.requestAnimationFrame(() => {
        if (installReturnFocusRef.current?.isConnected) {
          installReturnFocusRef.current?.focus();
        } else {
          fallbackFocusTarget?.focus();
        }
      });
    };
  }, [closeInstall, installOpen]);

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
    const focusFrame = window.requestAnimationFrame(() => {
      assistantPanelRef.current?.querySelector<HTMLElement>("button, a[href]")?.focus();
    });
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setAssistantOpen(false);
      assistantTriggerRef.current?.focus();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [assistantOpen]);

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
        () => setUpdateMessage("بررسی خودکار به‌روزرسانی در این مرورگر در دسترس نیست."),
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
        setUpdateMessage("بررسی به‌روزرسانی انجام شد.");
      } catch {
        setUpdateMessage("بررسی به‌روزرسانی انجام نشد؛ اتصال اینترنت را بررسی کنید.");
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
    if (installPendingRef.current) return;
    if (isStandalone) {
      setInstallMessage("برنامه مینا از قبل روی این دستگاه نصب شده است.");
      return;
    }

    if (installPrompt) {
      const promptEvent = installPrompt;
      installPendingRef.current = true;
      setInstallPending(true);
      setInstallPrompt(null);
      setInstallMessage("منتظر پاسخ شما به درخواست نصب مرورگر هستیم.");
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === "accepted") {
          emitConversion("pwa_install_accept", "browser-install-prompt");
        }
        if (!installedRef.current) {
          setInstallMessage(choice.outcome === "accepted"
            ? "درخواست نصب پذیرفته شد؛ منتظر تکمیل نصب توسط مرورگر هستیم."
            : "درخواست نصب رد شد؛ برای نصب می‌توانید منوی مرورگر را بررسی کنید.");
        }
      } catch {
        if (!installedRef.current) {
          setInstallMessage("درخواست نصب اجرا نشد؛ گزینهٔ نصب یا افزودن به صفحهٔ اصلی را در منوی مرورگر بررسی کنید.");
        }
      } finally {
        installPendingRef.current = false;
        setInstallPending(false);
      }
      return;
    }

    if (isIos) {
      setInstallMessage("در Safari دکمه اشتراک‌گذاری را بزنید و Add to Home Screen را انتخاب کنید.");
      return;
    }

    setInstallMessage("منوی مرورگر را بررسی کنید؛ اگر گزینهٔ «نصب برنامه» (Install app) یا «افزودن به صفحهٔ اصلی» (Add to Home Screen) وجود داشت، آن را انتخاب کنید.");
  };

  return (
    <>
      <nav className="mobile-dock" aria-label="دسترسی سریع موبایل">
        <a href="#home"><span aria-hidden="true">⌂</span><small>خانه</small></a>
        <a href="#services"><span aria-hidden="true">＋</span><small>خدمات</small></a>
        <a className="dock-primary" data-conversion="appointment_whatsapp" data-conversion-label="mobile-dock" href={whatsappUrl} target="_blank" rel="noreferrer">
          <span aria-hidden="true">●</span><small>نوبت</small>
        </a>
        <a data-conversion="directions" data-conversion-label="mobile-dock" href={directionsUrl} target="_blank" rel="noreferrer"><span aria-hidden="true">⌖</span><small>مسیر</small></a>
        <a data-conversion="phone_call" data-conversion-label="mobile-dock" href={`tel:${phone}`}><span aria-hidden="true">✆</span><small>تماس</small></a>
      </nav>

      {installNudgeOpen && !isStandalone && (
        <aside className="install-nudge" aria-label="پیشنهاد نصب برنامه مینا">
          <button className="install-nudge-close" type="button" onClick={dismissInstallNudge} aria-label="بستن پیشنهاد نصب">×</button>
          <img src="/mina-logo.jpeg" alt="" width={58} height={58} />
          <span className="install-nudge-copy">
            <strong>مینا را روی گوشی داشته باشید</strong>
            <small>راه‌های تماس و مسیر مطب در دسترس شما</small>
          </span>
          <button
            className="install-nudge-action"
            type="button"
            data-conversion="pwa_install_open"
            data-conversion-label="smart-nudge"
            onClick={openInstall}
          >
            نصب و راهنما
          </button>
        </aside>
      )}

      <div className={`mina-assistant ${isIdle ? "is-idle" : "is-active"}`} ref={assistantRef}>
        {assistantOpen && (
          <div className="assistant-panel" id="mina-guide-panel" ref={assistantPanelRef} role="dialog" aria-label="راهنمای سریع مینا">
            <div className="assistant-heading">
              <span>
                <strong>راهنمای سایت مینا</strong>
                <small>چه کاری می‌خواهید انجام دهید؟</small>
              </span>
              <button type="button" onClick={() => { setAssistantOpen(false); assistantTriggerRef.current?.focus(); }} aria-label="بستن راهنما">×</button>
            </div>
            <div className="assistant-actions">
              <a data-conversion="appointment_whatsapp" data-conversion-label="assistant" href={whatsappUrl} target="_blank" rel="noreferrer">درخواست نوبت در واتساپ</a>
              <a data-conversion="directions" data-conversion-label="assistant" href={directionsUrl} target="_blank" rel="noreferrer">مسیریابی تا مطب</a>
              <a href="#services" onClick={() => setAssistantOpen(false)}>انتخاب نوع خدمت</a>
              <button type="button" data-conversion="pwa_install_open" data-conversion-label="assistant" onClick={() => { setAssistantOpen(false); openInstall(); }}>نصب برنامه مینا</button>
            </div>
            <div className="assistant-status" aria-live="polite">{updateMessage}</div>
          </div>
        )}
        <button
          className="assistant-trigger"
          ref={assistantTriggerRef}
          aria-controls={assistantOpen ? "mina-guide-panel" : undefined}
          type="button"
          aria-expanded={assistantOpen}
          aria-label={assistantOpen ? "بستن راهنمای مینا" : "باز کردن راهنمای مینا"}
          onClick={() => setAssistantOpen((current) => !current)}
        >
          <img src="/mina-logo.jpeg" alt="" width={70} height={70} />
          <span className="assistant-mood" aria-hidden="true">{isIdle ? "…" : "✓"}</span>
        </button>
        {!assistantOpen && <span className="assistant-hint">{isIdle ? "راهنمای سایت" : "کمکتان کنم؟"}</span>}
      </div>

      {installOpen && (
        <div className="install-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) closeInstall();
        }}>
          <section
            className="install-dialog"
            ref={installDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
            aria-describedby="install-description"
          >
            <button className="install-close" type="button" onClick={closeInstall} aria-label="بستن پنجره نصب">×</button>
            <div className="install-art">
              <span className="install-glow" aria-hidden="true" />
              <img src="/mina-logo.jpeg" alt="لوگوی برنامه مینا" width={154} height={154} />
              <span className="install-mini-badge">MINA</span>
            </div>
            <div className="install-content">
              <span className="install-kicker">یک لمس تا دسترسی سریع‌تر</span>
              <h2 id="install-title">برنامه مینا را روی گوشی داشته باشید</h2>
              <p id="install-description">در مرورگرهای سازگار، سایت را به صفحهٔ اصلی اضافه کنید تا تماس و مسیر مطب را آسان‌تر پیدا کنید.</p>

              {isIos ? (
                <ol className="ios-steps">
                  <li><span>۱</span><p><strong>Safari</strong> را باز نگه دارید.</p></li>
                  <li><span>۲</span><p>دکمه <strong>Share / اشتراک‌گذاری</strong> را بزنید.</p></li>
                  <li><span>۳</span><p><strong>Add to Home Screen</strong> و سپس Add را انتخاب کنید.</p></li>
                </ol>
              ) : (
                <div className="install-benefits">
                  <span>بدون دانلود از فروشگاه</span>
                  <span>میان‌بر روی صفحهٔ اصلی</span>
                  <span>دسترسی به راه‌های تماس</span>
                </div>
              )}

              <p className="install-message" role="status">{installMessage}</p>

              <div className="install-actions">
                <button className="button button-primary" type="button" data-conversion="pwa_install_open" data-conversion-label="install-dialog" onClick={requestInstall} disabled={installPending || isStandalone} aria-busy={installPending}>
                  {isStandalone ? "نصب شده است" : installPending ? "در انتظار پاسخ مرورگر…" : isIos ? "نمایش راهنمای نصب آیفون" : installPrompt ? "نصب برنامه" : "راهنمای نصب روی این گوشی"}
                </button>
                <button className="button button-quiet" type="button" onClick={closeInstall}>بعداً</button>
              </div>
              <small className="install-privacy">افزودن سایت اختیاری است و به‌معنای ثبت نوبت نیست.</small>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
