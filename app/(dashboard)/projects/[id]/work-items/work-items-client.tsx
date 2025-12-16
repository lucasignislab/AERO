"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/work-items/kanban-board";
import { ListView } from "@/components/work-items/list-view";
import { CalendarView } from "@/components/work-items/calendar-view";
import { TableView } from "@/components/work-items/table-view";
import { TimelineView } from "@/components/work-items/timeline-view";
import { WorkItemModal } from "@/components/work-items/work-item-modal";
import {
    LayoutGrid,
    List,
    Plus,
    Filter,
    SlidersHorizontal,
    Calendar,
    Table2,
    GanttChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewType = "kanban" | "list" | "calendar" | "table" | "timeline";

const viewOptions: { id: ViewType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "list", label: "Lista", icon: List },
    { id: "kanban", label: "Board", icon: LayoutGrid },
    { id: "calendar", label: "Calendário", icon: Calendar },
    { id: "table", label: "Tabela", icon: Table2 },
    { id: "timeline", label: "Timeline", icon: GanttChart },
];

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

// Get today and create dates for demo
const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);
const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
const lastWeek = new Date(today); lastWeek.setDate(today.getDate() - 7);

const demoItems = [
    {
        id: "1",
        identifier: "AERO-1",
        title: "Configurar autenticação OAuth",
        priority: "high" as const,
        state: { id: "1", name: "Backlog", color: "#737373" },
        dueDate: tomorrow.toISOString(),
        startDate: yesterday.toISOString(),
        assignees: [{ id: "1", name: "Lucas", avatar_url: "" }],
        estimate: 5,
    },
    {
        id: "2",
        identifier: "AERO-2",
        title: "Criar página de perfil do usuário",
        priority: "medium" as const,
        state: { id: "1", name: "Backlog", color: "#737373" },
        dueDate: nextWeek.toISOString(),
        startDate: tomorrow.toISOString(),
        assignees: [{ id: "2", name: "Maria" }],
        estimate: 3,
    },
    {
        id: "3",
        identifier: "AERO-3",
        title: "Implementar Command K",
        priority: "urgent" as const,
        state: { id: "2", name: "Todo", color: "#388cfa" },
        dueDate: today.toISOString(),
        startDate: lastWeek.toISOString(),
        labels: [{ id: "1", name: "UX", color: "#8b5cf6" }],
        estimate: 8,
    },
    {
        id: "4",
        identifier: "AERO-4",
        title: "Migrar para Next.js 14",
        priority: "high" as const,
        state: { id: "3", name: "Em Progresso", color: "#A35A01" },
        labels: [{ id: "1", name: "Frontend", color: "#535c91" }],
        dueDate: nextWeek.toISOString(),
        startDate: yesterday.toISOString(),
        assignees: [{ id: "1", name: "Lucas" }, { id: "3", name: "Pedro" }],
        estimate: 13,
    },
    {
        id: "5",
        identifier: "AERO-5",
        title: "Setup inicial do projeto",
        priority: "none" as const,
        state: { id: "4", name: "Concluído", color: "#18821C" },
        dueDate: yesterday.toISOString(),
        startDate: lastWeek.toISOString(),
        estimate: 2,
    },
];

export default function WorkItemsClient() {
    const [view, setView] = useState<ViewType>("kanban");
    const [modalOpen, setModalOpen] = useState(false);

    const handleItemClick = (item: { id: string }) => {
        console.log("Item clicked:", item.id);
        // TODO: Open item detail modal
    };

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {/* View Switcher */}
                    <div className="flex bg-primary-20 rounded-lg p-1">
                        {viewOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setView(option.id)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                                    view === option.id
                                        ? "bg-primary-10 text-neutral"
                                        : "text-neutral-30 hover:text-neutral"
                                )}
                                title={option.label}
                            >
                                <option.icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{option.label}</span>
                            </button>
                        ))}
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
                {view === "kanban" && (
                    <KanbanBoard
                        columns={demoColumns}
                        onAddItem={(columnId) => {
                            console.log("Add item to column:", columnId);
                            setModalOpen(true);
                        }}
                    />
                )}
                {view === "list" && (
                    <ListView items={demoItems} />
                )}
                {view === "calendar" && (
                    <CalendarView items={demoItems} onItemClick={handleItemClick} />
                )}
                {view === "table" && (
                    <TableView items={demoItems} onItemClick={handleItemClick} />
                )}
                {view === "timeline" && (
                    <TimelineView items={demoItems} onItemClick={handleItemClick} />
                )}
            </div>

            {/* Modal */}
            <WorkItemModal open={modalOpen} onOpenChange={setModalOpen} />
        </div>
    );
}
