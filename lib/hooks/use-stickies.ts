"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Sticky {
    id: string;
    workspace_id: string | null;
    content: string;
    color: "yellow" | "green" | "blue" | "pink" | "purple" | "orange";
    created_by_id: string | null;
    created_at: string;
    updated_at: string;
}

interface UseStickiesReturn {
    stickies: Sticky[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    createSticky: (data: Partial<Sticky>) => Promise<Sticky>;
    updateSticky: (id: string, data: Partial<Sticky>) => Promise<void>;
    deleteSticky: (id: string) => Promise<void>;
}

export function useStickies(workspaceId: string | null): UseStickiesReturn {
    const [stickies, setStickies] = useState<Sticky[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchStickies = useCallback(async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            const { data, error: fetchError } = await supabase
                .from("stickies")
                .select("*")
                .eq("created_by_id", user.id)
                .order("created_at", { ascending: false });

            if (fetchError) throw fetchError;
            setStickies(data || []);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createSticky = async (data: Partial<Sticky>): Promise<Sticky> => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { data: sticky, error } = await supabase
            .from("stickies")
            .insert({
                workspace_id: workspaceId,
                content: data.content || "",
                color: data.color || "yellow",
                created_by_id: user?.id,
            })
            .select()
            .single();

        if (error) throw error;

        setStickies((prev) => [sticky, ...prev]);
        return sticky;
    };

    const updateSticky = async (id: string, data: Partial<Sticky>) => {
        const supabase = createClient();

        const { error } = await supabase
            .from("stickies")
            .update(data)
            .eq("id", id);

        if (error) throw error;

        setStickies((prev) =>
            prev.map((s) => (s.id === id ? { ...s, ...data } : s))
        );
    };

    const deleteSticky = async (id: string) => {
        const supabase = createClient();

        const { error } = await supabase.from("stickies").delete().eq("id", id);

        if (error) throw error;

        setStickies((prev) => prev.filter((s) => s.id !== id));
    };

    useEffect(() => {
        fetchStickies();
    }, [fetchStickies]);

    return {
        stickies,
        isLoading,
        error,
        refetch: fetchStickies,
        createSticky,
        updateSticky,
        deleteSticky,
    };
}
