"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/work-items/kanban-board";
import { ListView } from "@/components/work-items/list-view";
import { CalendarView } from "@/components/work-items/calendar-view";
import { TableView } from "@/components/work-items/table-view";
import { TimelineView } from "@/components/work-items/timeline-view";
import { WorkItemModal } from "@/components/work-items/work-item-modal";
import { useWorkItems, useIssueStates } from "@/lib/hooks";
import {
    LayoutGrid,
    List,
    Plus,
    Filter,
    SlidersHorizontal,
    Calendar,
    Table2,
    GanttChart,
    Loader2,
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

export default function WorkItemsClient() {
    const params = useParams();
    const projectId = params.id as string;

    const { items, isLoading, createItem } = useWorkItems(projectId);
    const { states } = useIssueStates(projectId);

    const [view, setView] = useState<ViewType>("kanban");
    const [modalOpen, setModalOpen] = useState(false);

    // Transform items into kanban columns by state
    const columns = states.map(state => ({
        id: state.id,
        name: state.name,
        color: state.color,
        items: items
            .filter(item => item.state_id === state.id)
            .map(item => ({
                id: item.id,
                identifier: item.identifier,
                title: item.title,
                priority: item.priority,
                labels: item.labels,
            })),
    }));

    // Transform items for list/calendar/table/timeline views
    const viewItems = items.map(item => ({
        id: item.id,
        identifier: item.identifier,
        title: item.title,
        priority: item.priority,
        state: item.state || { id: item.state_id || "", name: "Backlog", color: "#737373" },
        dueDate: item.due_date || undefined,
        startDate: item.start_date || undefined,
        labels: item.labels,
        assignees: item.assignee_ids?.map(id => ({ id, name: "Membro" })) || [],
        estimate: 0,
    }));

    const handleItemClick = (item: { id: string }) => {
        console.log("Item clicked:", item.id);
        // TODO: Open item detail modal
    };

    const handleCreateItem = async (data: { title: string; state_id?: string }) => {
        try {
            await createItem({
                title: data.title,
                state_id: data.state_id || states[0]?.id,
            });
            setModalOpen(false);
        } catch (error) {
            console.error("Failed to create item:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-40" />
            </div>
        );
    }

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
                        columns={columns.length > 0 ? columns : [
                            { id: "backlog", name: "Backlog", color: "#737373", items: [] },
                            { id: "todo", name: "Todo", color: "#388cfa", items: [] },
                            { id: "in-progress", name: "Em Progresso", color: "#A35A01", items: [] },
                            { id: "done", name: "Concluído", color: "#18821C", items: [] },
                        ]}
                        onAddItem={(columnId) => {
                            console.log("Add item to column:", columnId);
                            setModalOpen(true);
                        }}
                    />
                )}
                {view === "list" && (
                    <ListView items={viewItems} />
                )}
                {view === "calendar" && (
                    <CalendarView items={viewItems} onItemClick={handleItemClick} />
                )}
                {view === "table" && (
                    <TableView items={viewItems} onItemClick={handleItemClick} />
                )}
                {view === "timeline" && (
                    <TimelineView items={viewItems} onItemClick={handleItemClick} />
                )}
            </div>

            {/* Modal */}
            <WorkItemModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                onSubmit={handleCreateItem}
                states={states}
            />
        </div>
    );
}
