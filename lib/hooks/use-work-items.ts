"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    refetch: () => Promise<unknown>;
    createItem: (data: Partial<WorkItem>) => Promise<WorkItem>;
    updateItem: (id: string, data: Partial<WorkItem>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
}

export function useWorkItems(projectId: string | null): UseWorkItemsReturn {
    const queryClient = useQueryClient();
    const supabase = createClient();

    const { data: items = [], isLoading, error, refetch } = useQuery({
        queryKey: ["work-items", projectId],
        queryFn: async () => {
            if (!projectId) return [];
            const { data, error } = await supabase
                .from("work_items")
                .select(`
                    *,
                    state:issue_states(*)
                `)
                .eq("project_id", projectId)
                .order("sort_order", { ascending: true });

            if (error) throw error;
            return data as WorkItem[];
        },
        enabled: !!projectId,
    });

    const createMutation = useMutation({
        mutationFn: async (data: Partial<WorkItem>) => {
            if (!projectId) throw new Error("No project");
            const { data: { user } } = await supabase.auth.getUser();

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
            return item;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["work-items", projectId] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<WorkItem> }) => {
            const { error } = await supabase
                .from("work_items")
                .update(data)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["work-items", projectId] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("work_items")
                .delete()
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["work-items", projectId] });
        },
    });

    return {
        items,
        isLoading,
        error: error as Error,
        refetch,
        createItem: (data) => createMutation.mutateAsync(data),
        updateItem: (id, data) => updateMutation.mutateAsync({ id, data }),
        deleteItem: (id) => deleteMutation.mutateAsync(id),
    };
}

export function useIssueStates(projectId: string | null) {
    const supabase = createClient();
    const queryClient = useQueryClient();

    const { data: states = [], isLoading } = useQuery({
        queryKey: ["issue-states", projectId],
        queryFn: async () => {
            if (!projectId) return [];
            const { data, error } = await supabase
                .from("issue_states")
                .select("*")
                .eq("project_id", projectId)
                .order("sort_order");
            if (error) throw error;
            return data as IssueState[];
        },
        enabled: !!projectId,
    });

    const createStateMutation = useMutation({
        mutationFn: async (data: Partial<IssueState>) => {
            if (!projectId) throw new Error("No project");
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
            return state;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["issue-states", projectId] });
        },
    });

    const deleteStateMutation = useMutation({
        mutationFn: async (id: string) => {
            await supabase.from("issue_states").delete().eq("id", id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["issue-states", projectId] });
        },
    });

    return {
        states,
        isLoading,
        createState: (data: Partial<IssueState>) => createStateMutation.mutateAsync(data),
        deleteState: (id: string) => deleteStateMutation.mutateAsync(id)
    };
}

export function useProjectLabels(projectId: string | null) {
    const supabase = createClient();
    const queryClient = useQueryClient();

    const { data: labels = [], isLoading } = useQuery({
        queryKey: ["project-labels", projectId],
        queryFn: async () => {
            if (!projectId) return [];
            const { data } = await supabase
                .from("project_labels")
                .select("*")
                .eq("project_id", projectId)
                .order("name");
            return (data || []) as ProjectLabel[];
        },
        enabled: !!projectId,
    });

    const createLabelMutation = useMutation({
        mutationFn: async (data: Partial<ProjectLabel>) => {
            if (!projectId) throw new Error("No project");
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
            return label;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-labels", projectId] });
        },
    });

    const deleteLabelMutation = useMutation({
        mutationFn: async (id: string) => {
            await supabase.from("project_labels").delete().eq("id", id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-labels", projectId] });
        },
    });

    return {
        labels,
        isLoading,
        createLabel: (data: Partial<ProjectLabel>) => createLabelMutation.mutateAsync(data),
        deleteLabel: (id: string) => deleteLabelMutation.mutateAsync(id)
    };
}
