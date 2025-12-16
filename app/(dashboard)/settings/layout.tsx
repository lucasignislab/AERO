"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Settings, Users, Zap } from "lucide-react";

const settingsTabs = [
    { id: "general", label: "Geral", icon: Settings, href: "/settings" },
    { id: "members", label: "Membros", icon: Users, href: "/settings/members" },
    { id: "features", label: "Recursos", icon: Zap, href: "/settings/features" },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex h-full">
            {/* Settings Sidebar */}
            <aside className="w-64 border-r border-primary-30 p-4">
                <h2 className="text-lg font-semibold text-neutral mb-4">
                    Configurações do Workspace
                </h2>
                <nav className="space-y-1">
                    {settingsTabs.map((tab) => (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                pathname === tab.href
                                    ? "bg-primary-20 text-neutral"
                                    : "text-neutral-30 hover:bg-primary-20 hover:text-neutral"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Settings Content */}
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    );
}
