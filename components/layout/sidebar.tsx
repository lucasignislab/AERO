"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Home,
    User,
    StickyNote,
    FolderKanban,
    Eye,
    BarChart3,
    FileText,
    LayoutDashboard,
    MoreHorizontal,
    ChevronDown,
    ChevronRight,
    Settings,
    LogOut,
    Plus,
    ListTodo,
    Circle,
    Layers,
    FileStack,
    SlidersHorizontal,
    Copy,
    PanelLeftClose,
    PanelLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
    user?: {
        email?: string;
        display_name?: string;
        avatar_url?: string;
    };
    workspaceName?: string;
    projects?: Array<{
        id: string;
        name: string;
        icon?: string;
        color?: string;
    }>;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
}

const mainNavItems = [
    { href: "/", label: "Página inicial", icon: Home },
    { href: "/your-work", label: "Seu trabalho", icon: User },
    { href: "/stickies", label: "Stickies", icon: StickyNote },
];

const workspaceItems = [
    { href: "/projects", label: "Projetos", icon: FolderKanban },
    { href: "/views", label: "Visualizações", icon: Eye },
    { href: "/analytics", label: "Análises", icon: BarChart3 },
    { href: "/files", label: "Arquivos", icon: FileText },
    { href: "/dashboards", label: "Dashboards", icon: LayoutDashboard },
];

const projectSubItems = [
    { href: "items", label: "Itens", icon: ListTodo },
    { href: "cycles", label: "Ciclos", icon: Circle },
    { href: "modules", label: "Módulos", icon: Layers },
    { href: "views", label: "Visualizações", icon: Eye },
    { href: "pages", label: "Páginas", icon: FileStack },
];

export function Sidebar({
    user,
    workspaceName = "Projects",
    projects = [],
    collapsed = false,
    onToggleCollapse,
}: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const toggleProject = (projectId: string) => {
        setExpandedProjects((prev) => {
            const next = new Set(prev);
            if (next.has(projectId)) {
                next.delete(projectId);
            } else {
                next.add(projectId);
            }
            return next;
        });
    };

    const initials = user?.display_name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || user?.email?.[0].toUpperCase() || "U";

    return (
        <aside
            className={cn(
                "h-screen bg-primary-10 border-r border-primary-30 flex flex-col transition-all duration-200",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className={cn("p-4 flex items-center", collapsed ? "justify-center" : "justify-between")}>
                {!collapsed && (
                    <span className="font-semibold text-neutral">{workspaceName}</span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={onToggleCollapse}
                    aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                >
                    {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </Button>
            </div>

            {/* New Item Button */}
            <div className="px-3 mb-2">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full gap-2 text-neutral-30 h-9",
                        collapsed ? "justify-center px-0" : "justify-start"
                    )}
                >
                    <Plus className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Novo item</span>}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3">
                {/* Main Nav */}
                <div className="space-y-0.5">
                    {mainNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                collapsed && "justify-center px-0",
                                pathname === item.href
                                    ? "bg-primary-20 text-neutral"
                                    : "text-neutral-30 hover:bg-primary-20 hover:text-neutral"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && item.label}
                        </Link>
                    ))}
                </div>

                {/* Workspace */}
                {!collapsed && (
                    <div className="mt-6">
                        <span className="px-3 text-xs font-medium text-neutral-40 uppercase tracking-wider">
                            Espaço de trabalho
                        </span>
                    </div>
                )}
                <div className={cn("mt-2 space-y-0.5", !collapsed && "mt-2")}>
                    {workspaceItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                collapsed && "justify-center px-0",
                                pathname === item.href
                                    ? "bg-primary-20 text-neutral"
                                    : "text-neutral-30 hover:bg-primary-20 hover:text-neutral"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && item.label}
                        </Link>
                    ))}
                    {!collapsed && (
                        <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-30 hover:bg-primary-20 hover:text-neutral w-full">
                            <MoreHorizontal className="h-4 w-4" />
                            More
                        </button>
                    )}
                </div>

                {/* Projects */}
                {!collapsed && (
                    <div className="mt-6">
                        <span className="px-3 text-xs font-medium text-neutral-40 uppercase tracking-wider">
                            Projetos
                        </span>
                    </div>
                )}
                <div className={cn("mt-2 space-y-0.5")}>
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div key={project.id}>
                                {collapsed ? (
                                    <Link
                                        href={`/projects/${project.id}`}
                                        className="flex items-center justify-center rounded-md px-0 py-2 text-sm text-neutral-30 hover:bg-primary-20 hover:text-neutral"
                                        title={project.name}
                                    >
                                        <span className="text-lg">{project.icon || "📁"}</span>
                                    </Link>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => toggleProject(project.id)}
                                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-30 hover:bg-primary-20 hover:text-neutral w-full"
                                        >
                                            {expandedProjects.has(project.id) ? (
                                                <ChevronDown className="h-3 w-3" />
                                            ) : (
                                                <ChevronRight className="h-3 w-3" />
                                            )}
                                            <span className="text-lg">{project.icon || "📁"}</span>
                                            <span className="truncate flex-1 text-left">{project.name}</span>
                                        </button>

                                        {expandedProjects.has(project.id) && (
                                            <div className="ml-6 space-y-0.5">
                                                {projectSubItems.map((subItem) => (
                                                    <Link
                                                        key={subItem.href}
                                                        href={`/projects/${project.id}/${subItem.href === "items" ? "work-items" : subItem.href}`}
                                                        className={cn(
                                                            "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-colors",
                                                            pathname.includes(`/projects/${project.id}/${subItem.href}`)
                                                                ? "bg-primary-20 text-neutral"
                                                                : "text-neutral-40 hover:bg-primary-20 hover:text-neutral"
                                                        )}
                                                    >
                                                        <subItem.icon className="h-3.5 w-3.5" />
                                                        {subItem.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        !collapsed && (
                            <div className="px-3 py-2 text-sm text-neutral-40">
                                Nenhum projeto
                            </div>
                        )
                    )}
                </div>
            </nav>

            {/* User Footer */}
            <div className={cn("p-3 border-t border-primary-30", collapsed && "flex justify-center")}>
                {collapsed ? (
                    <button
                        onClick={onToggleCollapse}
                        className="flex items-center justify-center"
                        aria-label="Expandir sidebar"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.avatar_url} />
                            <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                        </Avatar>
                    </button>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 w-full rounded-md px-2 py-2 hover:bg-primary-20 transition-colors">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.avatar_url} />
                                    <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                                </Avatar>
                                <span className="flex-1 text-left text-sm text-neutral truncate">
                                    {user?.display_name || user?.email}
                                </span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem asChild>
                                <Link href="/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Configurações
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-danger">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </aside>
    );
}
