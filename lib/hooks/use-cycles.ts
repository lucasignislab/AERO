"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Cycle {
    id: string;
    project_id: string;
    name: string;
    description: string | null;
    start_date: string;
    end_date: string;
    status: "upcoming" | "active" | "completed";
    created_at: string;
    updated_at: string;
    // Computed
    total_items?: number;
    completed_items?: number;
}

interface UseCyclesReturn {
    cycles: Cycle[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    createCycle: (data: Partial<Cycle>) => Promise<Cycle>;
    updateCycle: (id: string, data: Partial<Cycle>) => Promise<void>;
    deleteCycle: (id: string) => Promise<void>;
}

export function useCycles(projectId: string | null): UseCyclesReturn {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchCycles = useCallback(async () => {
        if (!projectId) {
            setIsLoading(false);
            return;
        }

        const supabase = createClient();
        setIsLoading(true);

        try {
            const { data, error: fetchError } = await supabase
                .from("cycles")
                .select("*")
                .eq("project_id", projectId)
                .order("start_date", { ascending: false });

            if (fetchError) throw fetchError;

            // Get work item counts per cycle
            const cyclesWithCounts = await Promise.all(
                (data || []).map(async (cycle) => {
                    const { count: total } = await supabase
                        .from("work_items")
                        .select("*", { count: "exact", head: true })
                        .eq("cycle_id", cycle.id);

                    const { count: completed } = await supabase
                        .from("work_items")
                        .select("*", { count: "exact", head: true })
                        .eq("cycle_id", cycle.id)
                        .not("completed_at", "is", null);

                    return {
                        ...cycle,
                        total_items: total || 0,
                        completed_items: completed || 0,
                    };
                })
            );

            setCycles(cyclesWithCounts);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    const createCycle = async (data: Partial<Cycle>): Promise<Cycle> => {
        if (!projectId) throw new Error("No project");

        const supabase = createClient();

        const { data: cycle, error } = await supabase
            .from("cycles")
            .insert({
                project_id: projectId,
                name: data.name || "Novo Cycle",
                description: data.description,
                start_date: data.start_date,
                end_date: data.end_date,
                status: data.status || "upcoming",
            })
            .select()
            .single();

        if (error) throw error;

        const cycleWithCounts = { ...cycle, total_items: 0, completed_items: 0 };
        setCycles((prev) => [cycleWithCounts, ...prev]);
        return cycleWithCounts;
    };

    const updateCycle = async (id: string, data: Partial<Cycle>) => {
        const supabase = createClient();

        const { error } = await supabase
            .from("cycles")
            .update(data)
            .eq("id", id);

        if (error) throw error;

        setCycles((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...data } : c))
        );
    };

    const deleteCycle = async (id: string) => {
        const supabase = createClient();

        const { error } = await supabase.from("cycles").delete().eq("id", id);

        if (error) throw error;

        setCycles((prev) => prev.filter((c) => c.id !== id));
    };

    useEffect(() => {
        fetchCycles();
    }, [fetchCycles]);

    return {
        cycles,
        isLoading,
        error,
        refetch: fetchCycles,
        createCycle,
        updateCycle,
        deleteCycle,
    };
}
