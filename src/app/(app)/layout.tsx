import { AppHeader } from "@/components/nav/AppHeader";
import { BottomNav } from "@/components/nav/BottomNav";
import { PageTransition } from "@/components/nav/PageTransition";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-full w-full max-w-xl pb-24">
      <AppHeader />
      <main className="px-5 sm:px-0">
        <PageTransition>{children}</PageTransition>
      </main>
      <BottomNav />
    </div>
  );
}
