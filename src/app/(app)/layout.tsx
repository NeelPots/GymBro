import { AppHeader } from "@/components/nav/AppHeader";
import { BottomNav } from "@/components/nav/BottomNav";
import { DesktopSidebar } from "@/components/nav/DesktopSidebar";
import { PageTransition } from "@/components/nav/PageTransition";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full">
      <DesktopSidebar />
      <div className="min-h-full pb-24 lg:pb-8 lg:pl-64">
        <div className="mx-auto w-full max-w-xl lg:max-w-4xl">
          <AppHeader />
          <main className="px-5 sm:px-0 lg:px-8">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
