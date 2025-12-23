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
    Filter,
    SlidersHorizontal,
    Calendar,
    Table2,
    GanttChart,
    Loader2,
    ChevronRight,
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

    const [view, setView] = useState<ViewType>("timeline");
    const [modalOpen, setModalOpen] = useState(false);

    const viewItems = items.map(item => ({
        id: item.id,
        identifier: item.identifier,
        title: item.title,
        priority: item.priority,
        state: item.state || states.find(s => s.id === item.state_id) || { id: item.state_id || "", name: "Backlog", color: "#737373", group_name: "backlog" as const },
        dueDate: item.due_date || undefined,
        startDate: item.start_date || undefined,
        labels: item.labels,
        assignees: item.assignee_ids?.map(id => ({ id, name: "Lucas Coelho" })) || [],
    }));

    const handleItemClick = (item: { id: string }) => {
        console.log("Item clicked:", item.id);
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
            {/* Project Context & Toolbar */}
            <div className="flex items-center justify-between py-2 border-b border-primary-30 mb-4">
                <div className="flex items-center gap-1">
                    {/* Project Breadcrumb */}
                    <div className="flex items-center gap-2 mr-4">
                        <button className="p-1.5 hover:bg-primary-20 rounded-md text-neutral-40">
                            <List className="h-4 w-4 rotate-90" /> {/* Sidebar toggle mock */}
                        </button>
                        <ChevronRight className="h-3 w-3 text-neutral-40" />
                        <div className="flex items-center gap-1.5 px-1.5 py-1 hover:bg-primary-20 rounded-md cursor-pointer transition-colors">
                            <span className="text-sm">🚀</span>
                            <span className="text-sm font-medium text-neutral-30 truncate max-w-[150px]">
                                AERO Frontend
                            </span>
                        </div>
                        <ChevronRight className="h-3 w-3 text-neutral-40" />
                        <div className="flex items-center gap-2 px-1.5 py-1 hover:bg-primary-20 rounded-md cursor-pointer transition-colors">
                            <span className="text-sm font-medium text-neutral">Work Items</span>
                            <span className="bg-info-20 text-info text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {items.length}
                            </span>
                        </div>
                    </div>

                    {/* View Switcher Icons */}
                    <div className="flex bg-primary-20/50 rounded-md p-1 border border-primary-30 mr-2">
                        {viewOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setView(option.id)}
                                className={cn(
                                    "p-1.5 rounded-md transition-all",
                                    view === option.id
                                        ? "bg-primary-10 text-neutral shadow-sm"
                                        : "text-neutral-40 hover:text-neutral"
                                )}
                                title={option.label}
                            >
                                <option.icon className="h-4 w-4" />
                            </button>
                        ))}
                    </div>

                    {/* Filters */}
                    <Button variant="ghost" size="sm" className="text-neutral-40 hover:text-neutral hover:bg-primary-20 gap-1.5">
                        <Filter className="h-3.5 w-3.5" />
                    </Button>

                    <Button variant="ghost" size="sm" className="text-neutral-40 hover:text-neutral hover:bg-primary-20 gap-1.5 ml-1">
                        <span className="text-xs">Exibir</span>
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                    </Button>

                    <Button variant="ghost" size="sm" className="text-neutral-40 hover:text-neutral hover:bg-primary-20 text-xs ml-1 px-3">
                        Análises
                    </Button>
                </div>

                <Button
                    size="sm"
                    className="bg-[#0070E0] hover:bg-[#0070E0]/90 text-white rounded-md px-3 py-1.5 h-auto text-xs font-semibold"
                    onClick={() => setModalOpen(true)}
                >
                    Adicionar item de trabalho
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0">
                {view === "kanban" && (
                    <KanbanBoard
                        columns={states.map(state => ({
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
                        }))}
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
