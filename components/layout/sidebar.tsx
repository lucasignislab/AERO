"use client";

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
    Inbox,
    Briefcase,
    StickyNote,
    FolderKanban,
    LayoutDashboard,
    ChevronDown,
    Settings,
    LogOut,
    Plus,
    Search,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
    user?: {
        email?: string;
        display_name?: string;
        avatar_url?: string;
    };
    workspaceName?: string;
}

const navItems = [
    { href: "/inbox", label: "Inbox", icon: Inbox },
    { href: "/your-work", label: "Your Work", icon: Briefcase },
    { href: "/stickies", label: "Stickies", icon: StickyNote },
];

const workspaceItems = [
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Sidebar({ user, workspaceName = "AERO" }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const initials = user?.display_name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || user?.email?.[0].toUpperCase() || "U";

    return (
        <aside className="w-64 h-screen bg-primary-10 border-r border-primary-30 flex flex-col">
            {/* Workspace Header */}
            <div className="p-4 border-b border-primary-30">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between h-10">
                            <span className="font-semibold">{workspaceName}</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Workspace Settings
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Search */}
            <div className="p-4">
                <Button variant="outline" className="w-full justify-start gap-2 text-neutral-30">
                    <Search className="h-4 w-4" />
                    <span>Search...</span>
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-primary-30 bg-primary-20 px-1.5 font-mono text-[10px] font-medium opacity-100">
                        ⌘K
                    </kbd>
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3">
                {/* Personal */}
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                pathname === item.href
                                    ? "bg-primary-20 text-neutral"
                                    : "text-neutral-30 hover:bg-primary-20 hover:text-neutral"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Workspace */}
                <div className="mt-6">
                    <div className="flex items-center justify-between px-3 mb-2">
                        <span className="text-xs font-medium text-neutral-40 uppercase tracking-wider">
                            Workspace
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="space-y-1">
                        {workspaceItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                    pathname === item.href
                                        ? "bg-primary-20 text-neutral"
                                        : "text-neutral-30 hover:bg-primary-20 hover:text-neutral"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-primary-30">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar_url} />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-neutral truncate">
                                    {user?.display_name || user?.email}
                                </p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-neutral-40" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem asChild>
                            <Link href="/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-danger">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    );
}
