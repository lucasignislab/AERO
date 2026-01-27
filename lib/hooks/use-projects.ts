"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface Project {
    id: string;
    workspace_id: string;
    name: string;
    identifier: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    cover_image: string | null;
    lead_id: string | null;
    is_private: boolean;
    is_favorite: boolean;
    features: {
        cycles?: boolean;
        modules?: boolean;
        epics?: boolean;
        views?: boolean;
        pages?: boolean;
    };
    created_at: string;
    updated_at: string;
}

interface UseProjectsReturn {
    projects: Project[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<unknown>;
    createProject: (data: Partial<Project>) => Promise<Project>;
    updateProject: (id: string, data: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
}

export function useProjects(workspaceId: string | null): UseProjectsReturn {
    const queryClient = useQueryClient();
    const supabase = createClient();

    const { data: projects = [], isLoading, error, refetch } = useQuery({
        queryKey: ["projects", workspaceId],
        queryFn: async () => {
            if (!workspaceId) return [];
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as Project[];
        },
        enabled: !!workspaceId,
    });

    const createMutation = useMutation({
        mutationFn: async (data: Partial<Project>) => {
            if (!workspaceId) throw new Error("No workspace");
            const { data: { user } } = await supabase.auth.getUser();

            const { data: project, error } = await supabase
                .from("projects")
                .insert({
                    workspace_id: workspaceId,
                    name: data.name || "Novo Projeto",
                    identifier: data.identifier || `PRJ${Date.now().toString().slice(-4)}`,
                    description: data.description,
                    icon: data.icon,
                    color: data.color,
                    is_private: data.is_private ?? false,
                    features: data.features ?? { cycles: true, modules: true, views: true, pages: true },
                })
                .select()
                .single();

            if (error) throw error;

            if (user) {
                await supabase.from("project_members").insert({
                    project_id: project.id,
                    user_id: user.id,
                    role: "admin",
                });
            }

            return project;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Project> }) => {
            const { error } = await supabase
                .from("projects")
                .update(data)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("projects")
                .delete()
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
        },
    });

    return {
        projects,
        isLoading,
        error: error as Error,
        refetch,
        createProject: (data) => createMutation.mutateAsync(data),
        updateProject: (id, data) => updateMutation.mutateAsync({ id, data }),
        deleteProject: (id) => deleteMutation.mutateAsync(id),
    };
}

export function useProject(projectId: string | null) {
    const supabase = createClient();
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: async () => {
            if (!projectId) return null;
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("id", projectId)
                .single();
            if (error) throw error;
            return data as Project;
        },
        enabled: !!projectId,
    });
}
