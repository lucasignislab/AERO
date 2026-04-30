"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSidebar } from "@/lib/hooks/use-sidebar";

export function DashboardShell({
    children,
    user,
    profile,
    projects,
}: {
    children: React.ReactNode;
    user: { email: string; id: string };
    profile?: { display_name?: string; avatar_url?: string } | null;
    projects?: Array<{ id: string; name: string; icon?: string; color?: string }>;
}) {
    const { collapsed, toggle } = useSidebar();

    return (
        <TooltipProvider>
            <div className="flex h-screen bg-background">
                <Sidebar
                    user={{
                        email: user.email,
                        display_name: profile?.display_name,
                        avatar_url: profile?.avatar_url,
                    }}
                    projects={projects || []}
                    collapsed={collapsed}
                    onToggleCollapse={toggle}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
}
