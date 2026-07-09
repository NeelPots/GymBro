"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SettingsActions() {
  return (
    <Button
      variant="destructive"
      size="sm"
      className="mt-3"
      onClick={() => {
        window.localStorage.removeItem("adaptive-coach-state-v2");
        toast.success("Local data cleared. Reload to start fresh.");
      }}
    >
      Clear local data
    </Button>
  );
}
