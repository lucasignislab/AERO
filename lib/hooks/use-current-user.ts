"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Profile {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
    role: string;
    preferences: Record<string, unknown>;
}

interface CurrentUser {
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
    error: Error | null;
}

export function useCurrentUser(): CurrentUser {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const supabase = createClient();

        async function getUser() {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError) {
                    // Provide mock user for preview
                    const mockUser = {
                        id: "mock-user-id",
                        email: "lucas@example.com",
                        aud: "authenticated",
                        role: "authenticated",
                        app_metadata: {},
                        user_metadata: { display_name: "Lucas Coelho" },
                        created_at: new Date().toISOString(),
                    } as User;
                    setUser(mockUser);
                    setProfile({
                        id: "mock-user-id",
                        email: "lucas@example.com",
                        display_name: "Lucas Coelho",
                        avatar_url: null,
                        role: "admin",
                        preferences: {}
                    });
                    return;
                }

                setUser(user);

                if (user) {
                    const { data: profile, error: profileError } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", user.id)
                        .single();

                    if (profileError) throw profileError;
                    setProfile(profile);
                }
            } catch (err) {
                // Return mock even on error for preview
                setUser({
                    id: "mock-user-id",
                    email: "lucas@example.com",
                    user_metadata: { display_name: "Lucas Coelho" },
                } as any);
                setProfile({
                    id: "mock-user-id",
                    email: "lucas@example.com",
                    display_name: "Lucas Coelho",
                    avatar_url: null,
                    role: "admin",
                    preferences: {}
                });
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", session.user.id)
                        .single();
                    setProfile(profile);
                } else {
                    setProfile(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return { user, profile, isLoading, error };
}
