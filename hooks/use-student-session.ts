"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearStudentSession,
  getStudentAccessToken,
  getStudentProfile,
  type StudentProfile,
} from "@/lib/student-api";

type SessionStatus = "loading" | "authenticated" | "guest";

export function useStudentSession() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  const refresh = useCallback(async () => {
    const token = getStudentAccessToken();
    if (!token) {
      setProfile(null);
      setStatus("guest");
      return;
    }

    try {
      const nextProfile = await getStudentProfile(token);
      setProfile(nextProfile);
      setStatus("authenticated");
    } catch {
      clearStudentSession();
      setProfile(null);
      setStatus("guest");
    }
  }, []);

  useEffect(() => {
    const initialRefreshTimeout = window.setTimeout(() => {
      void refresh();
    }, 0);

    function handleSessionChange() {
      void refresh();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }

    window.addEventListener("storage", handleSessionChange);
    window.addEventListener("ap-student-session-change", handleSessionChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(initialRefreshTimeout);
      window.removeEventListener("storage", handleSessionChange);
      window.removeEventListener("ap-student-session-change", handleSessionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refresh]);

  const logout = useCallback(() => {
    clearStudentSession();
    setProfile(null);
    setStatus("guest");
  }, []);

  return {
    profile,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    refresh,
    logout,
  };
}
