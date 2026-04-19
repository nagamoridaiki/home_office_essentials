"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/contexts/session-context";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout } = useSession();

  const showLogout = pathname !== "/login";

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {showLogout ? (
        <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center justify-end border-b border-black/[0.08] bg-background/90 px-4 backdrop-blur-sm dark:border-white/[0.145]">
          <button
            type="button"
            onClick={logout}
            className="rounded-lg px-3 py-1.5 text-[14px] font-medium text-foreground/70 transition-colors hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.06]"
          >
            ログアウト
          </button>
        </header>
      ) : null}
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
