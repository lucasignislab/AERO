"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Module {
    id: string;
    project_id: string;
    name: string;
    description: string | null;
    lead_id: string | null;
    status: "backlog" | "planned" | "in-progress" | "paused" | "completed" | "cancelled";
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    updated_at: string;
    archived_at: string | null;
    // Computed
    total_items?: number;
    completed_items?: number;
    lead?: { id: string; display_name: string; avatar_url: string | null };
}

interface UseModulesReturn {
    modules: Module[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    createModule: (data: Partial<Module>) => Promise<Module>;
    updateModule: (id: string, data: Partial<Module>) => Promise<void>;
    deleteModule: (id: string) => Promise<void>;
}

export function useModules(projectId: string | null): UseModulesReturn {
    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchModules = useCallback(async () => {
        if (!projectId) {
            setIsLoading(false);
            return;
        }

        const supabase = createClient();
        setIsLoading(true);

        try {
            const { data, error: fetchError } = await supabase
                .from("modules")
                .select(`
                    *,
                    lead:profiles!modules_lead_id_fkey(id, display_name, avatar_url)
                `)
                .eq("project_id", projectId)
                .is("archived_at", null)
                .order("created_at", { ascending: false });

            if (fetchError) throw fetchError;

            // Get work item counts per module
            const modulesWithCounts = await Promise.all(
                (data || []).map(async (module) => {
                    const { count: total } = await supabase
                        .from("work_items")
                        .select("*", { count: "exact", head: true })
                        .contains("module_ids", [module.id]);

                    const { count: completed } = await supabase
                        .from("work_items")
                        .select("*", { count: "exact", head: true })
                        .contains("module_ids", [module.id])
                        .not("completed_at", "is", null);

                    return {
                        ...module,
                        total_items: total || 0,
                        completed_items: completed || 0,
                    };
                })
            );

            setModules(modulesWithCounts);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    const createModule = async (data: Partial<Module>): Promise<Module> => {
        if (!projectId) throw new Error("No project");

        const supabase = createClient();

        const { data: module, error } = await supabase
            .from("modules")
            .insert({
                project_id: projectId,
                name: data.name || "Novo Módulo",
                description: data.description,
                lead_id: data.lead_id,
                status: data.status || "backlog",
                start_date: data.start_date,
                end_date: data.end_date,
            })
            .select()
            .single();

        if (error) throw error;

        const moduleWithCounts = { ...module, total_items: 0, completed_items: 0 };
        setModules((prev) => [moduleWithCounts, ...prev]);
        return moduleWithCounts;
    };

    const updateModule = async (id: string, data: Partial<Module>) => {
        const supabase = createClient();

        const { error } = await supabase
            .from("modules")
            .update(data)
            .eq("id", id);

        if (error) throw error;

        setModules((prev) =>
            prev.map((m) => (m.id === id ? { ...m, ...data } : m))
        );
    };

    const deleteModule = async (id: string) => {
        const supabase = createClient();

        const { error } = await supabase.from("modules").delete().eq("id", id);

        if (error) throw error;

        setModules((prev) => prev.filter((m) => m.id !== id));
    };

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    return {
        modules,
        isLoading,
        error,
        refetch: fetchModules,
        createModule,
        updateModule,
        deleteModule,
    };
}
