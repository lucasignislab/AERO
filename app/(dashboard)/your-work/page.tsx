"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ListTodo, Plus, User, PenLine, BookmarkCheck } from "lucide-react";

type Tab = "assigned" | "created" | "subscribed";

interface WorkItem {
    id: string;
    identifier: string;
    title: string;
    priority: "urgent" | "high" | "medium" | "low" | "none";
    state: { id: string; name: string; color: string };
    projectName: string;
}

const priorityColors = {
    urgent: "border-l-danger",
    high: "border-l-warning",
    medium: "border-l-yellow-500",
    low: "border-l-success",
    none: "border-l-neutral-40",
};

const demoItems: Record<Tab, WorkItem[]> = {
    assigned: [
        { id: "1", identifier: "AERO-42", title: "Implementar filtros avançados", priority: "high", state: { id: "1", name: "Em Progresso", color: "#eab308" }, projectName: "AERO" },
        { id: "2", identifier: "AERO-38", title: "Revisar componentes UI", priority: "medium", state: { id: "2", name: "A Fazer", color: "#3b82f6" }, projectName: "AERO" },
        { id: "3", identifier: "WEB-15", title: "Corrigir bug no checkout", priority: "urgent", state: { id: "1", name: "Em Progresso", color: "#eab308" }, projectName: "E-commerce" },
    ],
    created: [
        { id: "4", identifier: "AERO-35", title: "Setup de testes E2E", priority: "low", state: { id: "3", name: "Backlog", color: "#6b7280" }, projectName: "AERO" },
        { id: "5", identifier: "AERO-30", title: "Documentação API", priority: "medium", state: { id: "4", name: "Concluído", color: "#22c55e" }, projectName: "AERO" },
    ],
    subscribed: [
        { id: "6", identifier: "AERO-25", title: "Migração de banco de dados", priority: "high", state: { id: "1", name: "Em Progresso", color: "#eab308" }, projectName: "AERO" },
    ],
};

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "assigned", label: "Atribuído a mim", icon: User },
    { id: "created", label: "Criados por mim", icon: PenLine },
    { id: "subscribed", label: "Inscrições", icon: BookmarkCheck },
];

export default function YourWorkPage() {
    const [activeTab, setActiveTab] = useState<Tab>("assigned");
    const items = demoItems[activeTab];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-xl font-semibold text-neutral mb-6">Seu Trabalho</h1>

            {/* Tabs */}
            <div className="flex gap-1 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors",
                            activeTab === tab.id
                                ? "bg-primary-20 text-neutral"
                                : "text-neutral-40 hover:text-neutral hover:bg-primary-20/50"
                        )}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                        <Badge variant="secondary" className="ml-1">
                            {demoItems[tab.id].length}
                        </Badge>
                    </button>
                ))}
            </div>

            {/* Items List */}
            <div className="space-y-2">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-lg bg-primary-20 hover:bg-primary-30 transition-colors cursor-pointer border-l-4",
                            priorityColors[item.priority]
                        )}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-neutral-40 font-mono">
                                    {item.identifier}
                                </span>
                                <span className="text-xs text-neutral-40">
                                    {item.projectName}
                                </span>
                            </div>
                            <h3 className="text-sm font-medium text-neutral truncate">
                                {item.title}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: item.state.color }}
                            />
                            <span className="text-xs text-neutral-40">
                                {item.state.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-12 text-neutral-40">
                    <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum item encontrado</p>
                </div>
            )}
        </div>
    );
}
