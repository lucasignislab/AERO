"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Settings, Users, Zap, CircleDot, Tag, Calculator, ChevronLeft } from "lucide-react";

const projectSettingsTabs = [
    { id: "general", label: "Geral", icon: Settings, href: "" },
    { id: "members", label: "Membros", icon: Users, href: "/members" },
    { id: "features", label: "Recursos", icon: Zap, href: "/features" },
    { id: "states", label: "Estados", icon: CircleDot, href: "/states" },
    { id: "labels", label: "Etiquetas", icon: Tag, href: "/labels" },
    { id: "estimates", label: "Estimativas", icon: Calculator, href: "/estimates" },
];

export default function ProjectSettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const params = useParams();
    const projectId = params.id as string;
    const basePath = `/projects/${projectId}/settings`;

    return (
        <div className="flex h-full">
            {/* Settings Sidebar */}
            <aside className="w-64 border-r border-primary-30 p-4">
                <Link
                    href={`/projects/${projectId}`}
                    className="flex items-center gap-2 text-neutral-30 hover:text-neutral text-sm mb-4"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Voltar ao Projeto
                </Link>
                <h2 className="text-lg font-semibold text-neutral mb-4">
                    Configurações do Projeto
                </h2>
                <nav className="space-y-1">
                    {projectSettingsTabs.map((tab) => {
                        const tabHref = basePath + tab.href;
                        const isActive = pathname === tabHref || (tab.href === "" && pathname === basePath);
                        return (
                            <Link
                                key={tab.id}
                                href={tabHref}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                    isActive
                                        ? "bg-primary-20 text-neutral"
                                        : "text-neutral-30 hover:bg-primary-20 hover:text-neutral"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Settings Content */}
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    );
}
