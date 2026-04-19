"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { SessionManager, type Account, type Role } from "@/lib/session-manager";

type SessionContextValue = {
  userId: string | undefined;
  email: string | undefined;
  role: Role | null | undefined;
  hasRole: (role: Role) => boolean;
  logout: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [account, setAccount] = useState<Account | undefined>(undefined);

  useEffect(() => {
    const info = SessionManager.getInfo();
    setAccount(info);
  }, [pathname]);

  const hasRole = useCallback(
    (role: Role) => account?.role === role,
    [account],
  );

  const logout = useCallback(() => {
    SessionManager.clearSession();
    setAccount(undefined);
    router.push("/login");
  }, [router]);

  return (
    <SessionContext.Provider
      value={{
        userId: account?.id,
        email: account?.email,
        role: account?.role,
        hasRole,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
