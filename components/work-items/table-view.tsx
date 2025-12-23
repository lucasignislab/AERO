"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ChevronDown,
    Circle,
    CheckCircle2,
    AlertCircle,
    Signal,
    History as HistoryIcon,
    User2,
    Tag,
    Layers,
    CircleDot,
    Calendar,
    Plus
} from "lucide-react";

interface WorkItem {
    id: string;
    identifier: string;
    title: string;
    priority: "urgent" | "high" | "medium" | "low" | "none";
    state?: { id: string; name: string; color: string; group_name: string };
    assignees?: { id: string; name: string; avatar_url?: string }[];
    labels?: { id: string; name: string; color: string }[];
    dueDate?: string;
    estimate?: number;
    createdAt?: string;
}

const stateIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
    backlog: { icon: Circle, color: "text-neutral-40" },
    unstarted: { icon: Circle, color: "text-neutral-30" },
    started: { icon: HistoryIcon, color: "text-warning" },
    completed: { icon: CheckCircle2, color: "text-success" },
    cancelled: { icon: AlertCircle, color: "text-neutral-40" },
};

const priorityIcons = {
    urgent: { icon: AlertCircle, color: "text-danger", label: "Urgent" },
    high: { icon: Signal, color: "text-warning", label: "High" },
    medium: { icon: Signal, color: "text-info", label: "Medium" },
    low: { icon: Signal, color: "text-success", label: "Low" },
    none: { icon: Circle, color: "text-neutral-40", label: "None" },
};

interface Column {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    width?: string;
}

interface TableViewProps {
    items: WorkItem[];
    onItemClick?: (item: WorkItem) => void;
}

const columns: Column[] = [
    { id: "work_items", label: "Work items", width: "min-w-[300px]" },
    { id: "state", label: "Estado", icon: CircleDot, width: "w-40" },
    { id: "priority", label: "Prioridade", icon: Signal, width: "w-40" },
    { id: "assignees", label: "Responsáveis", icon: User2, width: "w-48" },
    { id: "labels", label: "Etiquetas", icon: Tag, width: "w-40" },
    { id: "modules", label: "Módulos", icon: Layers, width: "w-40" },
    { id: "cycle", label: "Ciclo", icon: CircleDot, width: "w-40" },
    { id: "date", label: "Data de i...", icon: Calendar, width: "w-40" },
];

export function TableView({ items, onItemClick }: TableViewProps) {
    return (
        <div className="h-full overflow-auto border-t border-primary-30">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-primary-30">
                        {columns.map((col) => (
                            <th
                                key={col.id}
                                className={cn(
                                    "text-left p-3 text-[13px] font-medium text-neutral-30 whitespace-nowrap",
                                    col.width
                                )}
                            >
                                <div className="flex items-center gap-2 group cursor-pointer hover:text-neutral transition-colors">
                                    {col.icon && <col.icon className="h-4 w-4 text-neutral-40" />}
                                    <span>{col.label}</span>
                                    <ChevronDown className="h-3.5 w-3.5 text-neutral-40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-primary-30/50">
                    {items.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => onItemClick?.(item)}
                            className="hover:bg-primary-20/30 cursor-pointer transition-colors group"
                        >
                            {/* Work Items (ID + Title) */}
                            <td className="p-3 text-[13px]">
                                <div className="flex items-center gap-4">
                                    <span className="text-neutral-40 font-medium uppercase tracking-wider min-w-[100px]">
                                        {item.identifier}
                                    </span>
                                    <span className="text-neutral-10 truncate font-medium">
                                        {item.title}
                                    </span>
                                </div>
                            </td>

                            {/* Estado */}
                            <td className="p-3">
                                <div className="flex items-center gap-2 text-[13px] text-neutral-10 font-medium">
                                    {(() => {
                                        const state = item.state || { group_name: "backlog", name: "Backlog" };
                                        const StateIcon = stateIcons[state.group_name]?.icon || Circle;
                                        return <StateIcon className={cn("h-4 w-4", stateIcons[state.group_name]?.color || "text-neutral-40")} />;
                                    })()}
                                    <span>{item.state?.name || "Backlog"}</span>
                                </div>
                            </td>

                            {/* Prioridade */}
                            <td className="p-3">
                                <div className="flex items-center gap-2 text-[13px] text-neutral-10 font-medium">
                                    {(() => {
                                        const PriorityIcon = priorityIcons[item.priority]?.icon || Circle;
                                        return (
                                            <div className="p-1 rounded border border-primary-30">
                                                <PriorityIcon className={cn("h-3.5 w-3.5", priorityIcons[item.priority]?.color || "text-neutral-40")} />
                                            </div>
                                        );
                                    })()}
                                    <span>{priorityIcons[item.priority]?.label}</span>
                                </div>
                            </td>

                            {/* Responsáveis */}
                            <td className="p-3">
                                <div className="flex items-center gap-2 text-[13px] text-neutral-40">
                                    {item.assignees && item.assignees[0] ? (
                                        <>
                                            <Avatar className="h-6 w-6 border border-primary-30 shadow-sm">
                                                <AvatarImage src={item.assignees[0].avatar_url} />
                                                <AvatarFallback className="text-[10px] bg-primary-30">
                                                    {item.assignees[0].name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-neutral-10 font-medium">{item.assignees[0].name.toLowerCase()}</span>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <User2 className="h-4 w-4" />
                                            <span>Assignees</span>
                                        </div>
                                    )}
                                </div>
                            </td>

                            {/* Etiquetas */}
                            <td className="p-3">
                                <div className="flex items-center gap-2 text-[13px] text-neutral-40">
                                    <Tag className="h-4 w-4" />
                                    <span>Select labels</span>
                                </div>
                            </td>

                            {/* Módulos */}
                            <td className="p-3">
                                <div className="flex items-center gap-2 text-[13px] text-neutral-40">
                                    <Layers className="h-4 w-4" />
                                    <span>Select modules</span>
                                </div>
                            </td>

                            {/* Ciclo */}
                            <td className="p-3">
                                <div className="flex items-center gap-2 text-[13px] text-neutral-10 font-medium">
                                    <CircleDot className="h-4 w-4 text-neutral-40" />
                                    <span>{item.identifier === "AEROPROJEC-2" ? "Teste" : "Select cycle"}</span>
                                </div>
                            </td>

                            {/* Data de... */}
                            <td className="p-3">
                                <div className="flex items-center gap-2 text-[13px] text-neutral-30 font-medium">
                                    <div className="relative">
                                        <Calendar className="h-4 w-4" />
                                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-brand rounded-full border border-black" />
                                    </div>
                                    <span>{item.dueDate ? "Dec 16, 2" : "Select date"}</span>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {/* Add Item Row */}
                    <tr className="border-t border-primary-30">
                        <td colSpan={columns.length} className="p-3">
                            <button className="flex items-center gap-2 text-[13px] text-neutral-40 hover:text-neutral transition-colors">
                                <Plus className="h-4 w-4" />
                                <span>Adicionar item de trabalho</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
