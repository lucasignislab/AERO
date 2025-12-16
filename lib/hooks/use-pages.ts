"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Page {
    id: string;
    project_id: string;
    parent_id: string | null;
    title: string;
    content: Record<string, unknown> | null;
    icon: string | null;
    cover_image: string | null;
    is_published: boolean;
    created_by_id: string | null;
    created_at: string;
    updated_at: string;
    // Joined
    created_by?: { id: string; display_name: string };
}

interface UsePagesReturn {
    pages: Page[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    createPage: (data: Partial<Page>) => Promise<Page>;
    updatePage: (id: string, data: Partial<Page>) => Promise<void>;
    deletePage: (id: string) => Promise<void>;
}

export function usePages(projectId: string | null): UsePagesReturn {
    const [pages, setPages] = useState<Page[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPages = useCallback(async () => {
        if (!projectId) {
            setIsLoading(false);
            return;
        }

        const supabase = createClient();
        setIsLoading(true);

        try {
            const { data, error: fetchError } = await supabase
                .from("pages")
                .select(`
                    *,
                    created_by:profiles!pages_created_by_id_fkey(id, display_name)
                `)
                .eq("project_id", projectId)
                .order("updated_at", { ascending: false });

            if (fetchError) throw fetchError;
            setPages(data || []);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    const createPage = async (data: Partial<Page>): Promise<Page> => {
        if (!projectId) throw new Error("No project");

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { data: page, error } = await supabase
            .from("pages")
            .insert({
                project_id: projectId,
                title: data.title || "Nova Página",
                content: data.content,
                parent_id: data.parent_id,
                icon: data.icon,
                is_published: data.is_published ?? false,
                created_by_id: user?.id,
            })
            .select(`
                *,
                created_by:profiles!pages_created_by_id_fkey(id, display_name)
            `)
            .single();

        if (error) throw error;

        setPages((prev) => [page, ...prev]);
        return page;
    };

    const updatePage = async (id: string, data: Partial<Page>) => {
        const supabase = createClient();

        const { error } = await supabase.from("pages").update(data).eq("id", id);

        if (error) throw error;

        setPages((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    };

    const deletePage = async (id: string) => {
        const supabase = createClient();

        const { error } = await supabase.from("pages").delete().eq("id", id);

        if (error) throw error;

        setPages((prev) => prev.filter((p) => p.id !== id));
    };

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    return {
        pages,
        isLoading,
        error,
        refetch: fetchPages,
        createPage,
        updatePage,
        deletePage,
    };
}
