"use client";

import { useEffect, useState } from "react";

const DISMISSED_KEY = "adaptive-coach-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

function isIos(): boolean {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

/**
 * Surfaces "can this be installed right now" across the two real paths:
 * Chrome/Edge/Android fire `beforeinstallprompt` and let you trigger the
 * native dialog programmatically; Safari on iOS never fires that event at
 * all (Apple's manual-only design) so the best a web app can do there is
 * detect iOS + not-already-installed and show instructions for the
 * Share -> Add to Home Screen flow instead.
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStandalone(isStandalone());
    setIos(isIos());
    setDismissed(window.localStorage.getItem(DISMISSED_KEY) === "true");

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  async function promptInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  function dismiss() {
    window.localStorage.setItem(DISMISSED_KEY, "true");
    setDismissed(true);
  }

  const canPromptInstall = deferredPrompt !== null;
  const showIosInstructions = ios && !standalone && !canPromptInstall;

  return {
    canShow: !standalone && !dismissed && (canPromptInstall || showIosInstructions),
    canPromptInstall,
    showIosInstructions,
    promptInstall,
    dismiss,
  };
}
