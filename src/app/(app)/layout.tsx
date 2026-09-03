import { AppHeader } from "@/components/nav/AppHeader";
import { BottomNav } from "@/components/nav/BottomNav";
import { DesktopSidebar } from "@/components/nav/DesktopSidebar";
import { PageTransition } from "@/components/nav/PageTransition";
import { MotivationalBackdrop } from "@/components/gamification/MotivationalBackdrop";
import { HudGridOverlay } from "@/components/gamification/HudGridOverlay";
import { SystemTerminal } from "@/components/gamification/SystemTerminal";
import { PenaltyOverlay } from "@/components/gamification/PenaltyOverlay";
import { LevelUpModal } from "@/components/gamification/LevelUpModal";
import { QuestProvider } from "@/components/gamification/QuestProvider";
import { InstallBanner } from "@/components/shared/InstallBanner";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <QuestProvider>
      <div className="min-h-full">
        <HudGridOverlay />
        <MotivationalBackdrop />
        <DesktopSidebar />
        <div className="min-h-full pb-24 lg:pb-8 lg:pl-64">
          <div className="mx-auto w-full max-w-xl lg:max-w-4xl">
            <AppHeader />
            <main className="px-5 sm:px-0 lg:px-8">
              <InstallBanner />
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </div>
        <BottomNav />
        <SystemTerminal />
        <PenaltyOverlay />
        <LevelUpModal />
      </div>
    </QuestProvider>
  );
}
