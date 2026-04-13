"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/db/supabase-browser";
import type { Profile } from "./navbar.types";

const supabase = createBrowserSupabaseClient();

export function useNavbarAuth(onAfterLogout?: () => void) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const isMountedRef = useRef(false);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    const loadUserProfile = async () => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;

      try {
        if (!isMountedRef.current) return;
        setLoadingUser(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user;

        if (!user) {
          if (isMountedRef.current) {
            setProfile(null);
            setLoadingUser(false);
          }
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, first_name, last_name, username, avatar_url, role")
          .eq("id", user.id)
          .single();

        if (!isMountedRef.current) return;

        if (error) {
          console.error("Failed to load profile:", error.message);
          setProfile(null);
        } else {
          setProfile(data as Profile);
        }
      } finally {
        if (isMountedRef.current) {
          setLoadingUser(false);
        }
        isLoadingRef.current = false;
      }
    };

    loadUserProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMountedRef.current) return;

      if (!session?.user) {
        setProfile(null);
        setLoadingUser(false);
        return;
      }

      queueMicrotask(() => {
        loadUserProfile();
      });
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    setProfile(null);
    onAfterLogout?.();
    router.push("/login");
    router.refresh();
  };

  return {
    profile,
    loadingUser,
    handleLogout,
  };
}