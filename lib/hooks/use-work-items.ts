"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface WorkItem {
    id: string;
    project_id: string;
    identifier: string;
    type_id: string | null;
    title: string;
    description: string | null;
    state_id: string | null;
    priority: "urgent" | "high" | "medium" | "low" | "none";
    assignee_ids: string[];
    created_by_id: string | null;
    label_ids: string[];
    due_date: string | null;
    start_date: string | null;
    cycle_id: string | null;
    module_ids: string[];
    epic_id: string | null;
    parent_id: string | null;
    sort_order: number;
    is_draft: boolean;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
    // Joined data
    state?: IssueState;
    labels?: ProjectLabel[];
}

export interface IssueState {
    id: string;
    project_id: string;
    name: string;
    description: string | null;
    color: string;
    group_name: "backlog" | "unstarted" | "started" | "completed" | "cancelled";
    sort_order: number;
    is_default: boolean;
}

export interface ProjectLabel {
    id: string;
    project_id: string;
    name: string;
    color: string;
    description: string | null;
}

interface UseWorkItemsReturn {
    items: WorkItem[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    createItem: (data: Partial<WorkItem>) => Promise<WorkItem>;
    updateItem: (id: string, data: Partial<WorkItem>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
}

export function useWorkItems(projectId: string | null): UseWorkItemsReturn {
    const [items, setItems] = useState<WorkItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchItems = useCallback(async () => {
        if (!projectId) {
            setIsLoading(false);
            return;
        }

        const supabase = createClient();
        setIsLoading(true);

        try {
            const { data, error: fetchError } = await supabase
                .from("work_items")
                .select(`
                    *,
                    state:issue_states(*)
                `)
                .eq("project_id", projectId)
                .order("sort_order", { ascending: true });

            if (fetchError) throw fetchError;
            setItems(data || []);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    const createItem = async (data: Partial<WorkItem>): Promise<WorkItem> => {
        if (!projectId) throw new Error("No project");

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Get next identifier
        const { data: lastItem } = await supabase
            .from("work_items")
            .select("identifier")
            .eq("project_id", projectId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        const { data: project } = await supabase
            .from("projects")
            .select("identifier")
            .eq("id", projectId)
            .single();

        const nextNum = lastItem
            ? parseInt(lastItem.identifier.split("-")[1]) + 1
            : 1;
        const identifier = `${project?.identifier || "ITEM"}-${nextNum}`;

        const { data: item, error } = await supabase
            .from("work_items")
            .insert({
                project_id: projectId,
                identifier,
                title: data.title || "Nova Tarefa",
                description: data.description,
                state_id: data.state_id,
                priority: data.priority || "none",
                assignee_ids: data.assignee_ids || [],
                created_by_id: user?.id,
                label_ids: data.label_ids || [],
                due_date: data.due_date,
                start_date: data.start_date,
                cycle_id: data.cycle_id,
                module_ids: data.module_ids || [],
                parent_id: data.parent_id,
                sort_order: items.length,
            })
            .select(`*, state:issue_states(*)`)
            .single();

        if (error) throw error;

        setItems((prev) => [...prev, item]);
        return item;
    };

    const updateItem = async (id: string, data: Partial<WorkItem>) => {
        const supabase = createClient();

        const { error } = await supabase
            .from("work_items")
            .update(data)
            .eq("id", id);

        if (error) throw error;

        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...data } : item))
        );
    };

    const deleteItem = async (id: string) => {
        const supabase = createClient();

        const { error } = await supabase
            .from("work_items")
            .delete()
            .eq("id", id);

        if (error) throw error;

        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return {
        items,
        isLoading,
        error,
        refetch: fetchItems,
        createItem,
        updateItem,
        deleteItem,
    };
}

// Hook for issue states
export function useIssueStates(projectId: string | null) {
    const [states, setStates] = useState<IssueState[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStates = useCallback(async () => {
        if (!projectId) {
            setIsLoading(false);
            return;
        }

        const supabase = createClient();

        const { data } = await supabase
            .from("issue_states")
            .select("*")
            .eq("project_id", projectId)
            .order("sort_order");

        setStates(data || []);
        setIsLoading(false);
    }, [projectId]);

    const createState = async (data: Partial<IssueState>) => {
        if (!projectId) throw new Error("No project");

        const supabase = createClient();

        const { data: state, error } = await supabase
            .from("issue_states")
            .insert({
                project_id: projectId,
                name: data.name || "Novo Estado",
                color: data.color || "#6b7280",
                group_name: data.group_name || "backlog",
                sort_order: states.length,
            })
            .select()
            .single();

        if (error) throw error;
        setStates((prev) => [...prev, state]);
        return state;
    };

    const deleteState = async (id: string) => {
        const supabase = createClient();
        await supabase.from("issue_states").delete().eq("id", id);
        setStates((prev) => prev.filter((s) => s.id !== id));
    };

    useEffect(() => {
        fetchStates();
    }, [fetchStates]);

    return { states, isLoading, refetch: fetchStates, createState, deleteState };
}

// Hook for project labels
export function useProjectLabels(projectId: string | null) {
    const [labels, setLabels] = useState<ProjectLabel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLabels = useCallback(async () => {
        if (!projectId) {
            setIsLoading(false);
            return;
        }

        const supabase = createClient();

        const { data } = await supabase
            .from("project_labels")
            .select("*")
            .eq("project_id", projectId)
            .order("name");

        setLabels(data || []);
        setIsLoading(false);
    }, [projectId]);

    const createLabel = async (data: Partial<ProjectLabel>) => {
        if (!projectId) throw new Error("No project");

        const supabase = createClient();

        const { data: label, error } = await supabase
            .from("project_labels")
            .insert({
                project_id: projectId,
                name: data.name || "Nova Label",
                color: data.color || "#6b7280",
            })
            .select()
            .single();

        if (error) throw error;
        setLabels((prev) => [...prev, label]);
        return label;
    };

    const deleteLabel = async (id: string) => {
        const supabase = createClient();
        await supabase.from("project_labels").delete().eq("id", id);
        setLabels((prev) => prev.filter((l) => l.id !== id));
    };

    useEffect(() => {
        fetchLabels();
    }, [fetchLabels]);

    return { labels, isLoading, refetch: fetchLabels, createLabel, deleteLabel };
}
