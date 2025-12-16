"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface SavedView {
    id: string;
    workspace_id: string;
    project_id: string | null;
    name: string;
    description: string | null;
    queries: Record<string, unknown>;
    is_favorite: boolean;
    is_private: boolean;
    created_by_id: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    // Joined
    created_by?: { id: string; display_name: string };
}

interface UseSavedViewsReturn {
    views: SavedView[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    createView: (data: Partial<SavedView>) => Promise<SavedView>;
    updateView: (id: string, data: Partial<SavedView>) => Promise<void>;
    deleteView: (id: string) => Promise<void>;
}

export function useSavedViews(
    workspaceId: string | null,
    projectId?: string | null
): UseSavedViewsReturn {
    const [views, setViews] = useState<SavedView[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchViews = useCallback(async () => {
        if (!workspaceId) {
            setIsLoading(false);
            return;
        }

        const supabase = createClient();
        setIsLoading(true);

        try {
            let query = supabase
                .from("saved_views")
                .select(`
                    *,
                    created_by:profiles!saved_views_created_by_id_fkey(id, display_name)
                `)
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false });

            if (projectId) {
                query = query.eq("project_id", projectId);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;
            setViews(data || []);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [workspaceId, projectId]);

    const createView = async (data: Partial<SavedView>): Promise<SavedView> => {
        if (!workspaceId) throw new Error("No workspace");

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { data: view, error } = await supabase
            .from("saved_views")
            .insert({
                workspace_id: workspaceId,
                project_id: projectId || data.project_id,
                name: data.name || "Nova View",
                description: data.description,
                queries: data.queries || {},
                is_private: data.is_private ?? true,
                created_by_id: user?.id,
            })
            .select(`
                *,
                created_by:profiles!saved_views_created_by_id_fkey(id, display_name)
            `)
            .single();

        if (error) throw error;

        setViews((prev) => [view, ...prev]);
        return view;
    };

    const updateView = async (id: string, data: Partial<SavedView>) => {
        const supabase = createClient();

        const { error } = await supabase
            .from("saved_views")
            .update(data)
            .eq("id", id);

        if (error) throw error;

        setViews((prev) => prev.map((v) => (v.id === id ? { ...v, ...data } : v)));
    };

    const deleteView = async (id: string) => {
        const supabase = createClient();

        const { error } = await supabase.from("saved_views").delete().eq("id", id);

        if (error) throw error;

        setViews((prev) => prev.filter((v) => v.id !== id));
    };

    useEffect(() => {
        fetchViews();
    }, [fetchViews]);

    return {
        views,
        isLoading,
        error,
        refetch: fetchViews,
        createView,
        updateView,
        deleteView,
    };
}
