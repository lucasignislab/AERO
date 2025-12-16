"use client";

import { useEffect, useState, useCallback } from "react";
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
    refetch: () => Promise<void>;
    createProject: (data: Partial<Project>) => Promise<Project>;
    updateProject: (id: string, data: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
}

export function useProjects(workspaceId: string | null): UseProjectsReturn {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProjects = useCallback(async () => {
        if (!workspaceId) {
            setIsLoading(false);
            return;
        }

        const supabase = createClient();
        setIsLoading(true);

        try {
            const { data, error: fetchError } = await supabase
                .from("projects")
                .select("*")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false });

            if (fetchError) throw fetchError;
            setProjects(data || []);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [workspaceId]);

    const createProject = async (data: Partial<Project>): Promise<Project> => {
        if (!workspaceId) throw new Error("No workspace");

        const supabase = createClient();

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

        // Add creator as project admin
        if (user) {
            await supabase.from("project_members").insert({
                project_id: project.id,
                user_id: user.id,
                role: "admin",
            });
        }

        setProjects((prev) => [project, ...prev]);
        return project;
    };

    const updateProject = async (id: string, data: Partial<Project>) => {
        const supabase = createClient();

        const { error } = await supabase
            .from("projects")
            .update(data)
            .eq("id", id);

        if (error) throw error;

        setProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...data } : p))
        );
    };

    const deleteProject = async (id: string) => {
        const supabase = createClient();

        const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", id);

        if (error) throw error;

        setProjects((prev) => prev.filter((p) => p.id !== id));
    };

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return {
        projects,
        isLoading,
        error,
        refetch: fetchProjects,
        createProject,
        updateProject,
        deleteProject,
    };
}

// Hook for single project
export function useProject(projectId: string | null) {
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!projectId) {
            setIsLoading(false);
            return;
        }

        const supabase = createClient();

        async function fetchProject() {
            try {
                const { data, error: fetchError } = await supabase
                    .from("projects")
                    .select("*")
                    .eq("id", projectId)
                    .single();

                if (fetchError) throw fetchError;
                setProject(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProject();
    }, [projectId]);

    return { project, isLoading, error };
}
