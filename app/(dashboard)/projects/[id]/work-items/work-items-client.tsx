"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/work-items/kanban-board";
import { ListView } from "@/components/work-items/list-view";
import { WorkItemModal } from "@/components/work-items/work-item-modal";
import {
    LayoutGrid,
    List,
    Plus,
    Filter,
    SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Demo data
const demoColumns = [
    {
        id: "backlog",
        name: "Backlog",
        color: "#737373",
        items: [
            { id: "1", identifier: "AERO-1", title: "Configurar autenticação OAuth", priority: "high" as const },
            { id: "2", identifier: "AERO-2", title: "Criar página de perfil do usuário", priority: "medium" as const },
        ],
    },
    {
        id: "todo",
        name: "Todo",
        color: "#388cfa",
        items: [
            { id: "3", identifier: "AERO-3", title: "Implementar Command K", priority: "urgent" as const },
        ],
    },
    {
        id: "in-progress",
        name: "Em Progresso",
        color: "#A35A01",
        items: [
            { id: "4", identifier: "AERO-4", title: "Migrar para Next.js 14", priority: "high" as const, labels: [{ id: "1", name: "Frontend", color: "#535c91" }] },
        ],
    },
    {
        id: "done",
        name: "Concluído",
        color: "#18821C",
        items: [
            { id: "5", identifier: "AERO-5", title: "Setup inicial do projeto", priority: "none" as const },
        ],
    },
];

const demoListItems = [
    {
        id: "1",
        identifier: "AERO-1",
        title: "Configurar autenticação OAuth",
        priority: "high" as const,
        state: { id: "1", name: "Backlog", color: "#737373" },
    },
    {
        id: "2",
        identifier: "AERO-2",
        title: "Criar página de perfil do usuário",
        priority: "medium" as const,
        state: { id: "1", name: "Backlog", color: "#737373" },
    },
    {
        id: "3",
        identifier: "AERO-3",
        title: "Implementar Command K",
        priority: "urgent" as const,
        state: { id: "2", name: "Todo", color: "#388cfa" },
    },
    {
        id: "4",
        identifier: "AERO-4",
        title: "Migrar para Next.js 14",
        priority: "high" as const,
        state: { id: "3", name: "Em Progresso", color: "#A35A01" },
        labels: [{ id: "1", name: "Frontend", color: "#535c91" }],
    },
];

export default function WorkItemsClient() {
    const [view, setView] = useState<"kanban" | "list">("kanban");
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {/* View Switcher */}
                    <div className="flex bg-primary-20 rounded-lg p-1">
                        <button
                            onClick={() => setView("kanban")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                                view === "kanban"
                                    ? "bg-primary-10 text-neutral"
                                    : "text-neutral-30 hover:text-neutral"
                            )}
                        >
                            <LayoutGrid className="h-4 w-4" />
                            Board
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                                view === "list"
                                    ? "bg-primary-10 text-neutral"
                                    : "text-neutral-30 hover:text-neutral"
                            )}
                        >
                            <List className="h-4 w-4" />
                            Lista
                        </button>
                    </div>

                    {/* Filters */}
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-3.5 w-3.5" />
                        Filtros
                    </Button>

                    <Button variant="outline" size="sm" className="gap-2">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Exibir
                    </Button>
                </div>

                <Button onClick={() => setModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Tarefa
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0">
                {view === "kanban" ? (
                    <KanbanBoard
                        columns={demoColumns}
                        onAddItem={(columnId) => {
                            console.log("Add item to column:", columnId);
                            setModalOpen(true);
                        }}
                    />
                ) : (
                    <ListView items={demoListItems} />
                )}
            </div>

            {/* Modal */}
            <WorkItemModal open={modalOpen} onOpenChange={setModalOpen} />
        </div>
    );
}
