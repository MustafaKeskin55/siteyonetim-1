"use client";

import * as React from "react";
import { browserApiUrl } from "@/lib/browser-api-base";

export type SessionUser = {
  id: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  name: string;
  siteId?: string | null;
  apartmentNo?: string | null;
  mustChangePassword?: boolean;
};

export function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-state-change"));
  }
}

export function useSession() {
  const [user, setUser] = React.useState<SessionUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refreshSession = React.useCallback(async () => {
    if (typeof window === "undefined") return null;

    // 1. Önce localStorage'dan anında oku (UI titreşimi / gecikme olmasın)
    try {
      const local = localStorage.getItem("user");
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && typeof parsed === "object" && parsed.id && parsed.role) {
          setUser(parsed);
        }
      }
    } catch {
      /* ignore */
    }

    // 2. Sunucudaki HTTP-only cookie ile doğrula
    try {
      const res = await fetch(browserApiUrl("/api/auth/me"), {
        credentials: "include",
        cache: "no-store",
      });

      if (res.ok) {
        const data = (await res.json()) as {
          authenticated?: boolean;
          user?: SessionUser;
        };

        if (data?.authenticated && data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          setLoading(false);
          return data.user;
        }
      }

      // Sunucu oturum olmadığını bildirdiyse yerel depoyu da temizle
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch {
      // Çevrimdışı / ağ hatası: Yerel veri varsa koru
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  React.useEffect(() => {
    refreshSession();

    const handleAuthChange = () => {
      refreshSession();
    };

    window.addEventListener("auth-state-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-state-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [refreshSession]);

  const logout = React.useCallback(async () => {
    try {
      await fetch(browserApiUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* ignore */
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    notifyAuthChange();
  }, []);

  const panelUrl =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? "/admin" : "/dashboard";

  const roleLabel =
    user?.role === "SUPER_ADMIN"
      ? "Süper Yönetici"
      : user?.role === "ADMIN"
      ? "Site Yöneticisi"
      : user?.apartmentNo
      ? `Daire ${user.apartmentNo}`
      : "Sakin";

  return {
    user,
    loading,
    isAuthenticated: !!user,
    panelUrl,
    roleLabel,
    logout,
    refreshSession,
  };
}
