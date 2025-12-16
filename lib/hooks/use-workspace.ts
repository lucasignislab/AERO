"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Workspace {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    owner_id: string | null;
    plan: string;
    settings: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

interface WorkspaceMember {
    id: string;
    workspace_id: string;
    user_id: string;
    role: "admin" | "member" | "guest";
    status: string;
}

interface UseWorkspaceReturn {
    workspace: Workspace | null;
    members: WorkspaceMember[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    updateWorkspace: (data: Partial<Workspace>) => Promise<void>;
}

export function useWorkspace(userId: string | null): UseWorkspaceReturn {
    const [workspace, setWorkspace] = useState<Workspace | null>(null);
    const [members, setMembers] = useState<WorkspaceMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchWorkspace = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        const supabase = createClient();
        setIsLoading(true);

        try {
            // Get user's workspace membership
            const { data: membership, error: membershipError } = await supabase
                .from("workspace_members")
                .select("workspace_id")
                .eq("user_id", userId)
                .eq("status", "active")
                .limit(1)
                .single();

            if (membershipError) {
                // If no workspace exists, create one
                if (membershipError.code === "PGRST116") {
                    const { data: newWorkspace, error: createError } = await supabase
                        .from("workspaces")
                        .insert({
                            name: "Meu Workspace",
                            slug: `workspace-${Date.now()}`,
                            owner_id: userId,
                        })
                        .select()
                        .single();

                    if (createError) throw createError;

                    // Add user as admin member
                    await supabase.from("workspace_members").insert({
                        workspace_id: newWorkspace.id,
                        user_id: userId,
                        role: "admin",
                        status: "active",
                    });

                    setWorkspace(newWorkspace);
                    return;
                }
                throw membershipError;
            }

            // Fetch workspace details
            const { data: ws, error: wsError } = await supabase
                .from("workspaces")
                .select("*")
                .eq("id", membership.workspace_id)
                .single();

            if (wsError) throw wsError;
            setWorkspace(ws);

            // Fetch members
            const { data: membersData } = await supabase
                .from("workspace_members")
                .select("*")
                .eq("workspace_id", membership.workspace_id);

            setMembers(membersData || []);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const updateWorkspace = async (data: Partial<Workspace>) => {
        if (!workspace) return;

        const supabase = createClient();
        const { error } = await supabase
            .from("workspaces")
            .update(data)
            .eq("id", workspace.id);

        if (error) throw error;

        setWorkspace({ ...workspace, ...data });
    };

    useEffect(() => {
        fetchWorkspace();
    }, [fetchWorkspace]);

    return {
        workspace,
        members,
        isLoading,
        error,
        refetch: fetchWorkspace,
        updateWorkspace,
    };
}
