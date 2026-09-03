"use client";

import { Download, Share, X } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { systemAudio } from "@/lib/gamification/audio";

/** Dismissible "install the app" banner - the real Chrome/Android prompt where supported, manual iOS instructions otherwise. */
export function InstallBanner() {
  const { canShow, canPromptInstall, promptInstall, dismiss } = useInstallPrompt();
  if (!canShow) return null;

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border border-signal/25 bg-signal/5 px-4 py-3 hud-panel">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal">
        {canPromptInstall ? <Download size={16} /> : <Share size={16} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-foreground">Install the System</div>
        <div className="truncate text-xs text-muted-foreground">
          {canPromptInstall ? "Add Lock In to your home screen for the full app experience." : 'Tap Share, then "Add to Home Screen."'}
        </div>
      </div>
      {canPromptInstall && (
        <button
          type="button"
          onClick={() => {
            systemAudio.click();
            void promptInstall();
          }}
          className="shrink-0 rounded-md bg-signal px-3 py-1.5 font-mono text-xs font-semibold text-white transition-colors hover:bg-signal/90"
        >
          Install
        </button>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss install prompt"
        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X size={16} />
      </button>
    </div>
  );
}
