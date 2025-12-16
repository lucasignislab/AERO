"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface WorkItem {
    id: string;
    identifier: string;
    title: string;
    priority: "urgent" | "high" | "medium" | "low" | "none";
    state?: { id: string; name: string; color: string };
    assignees?: { id: string; name: string; avatar_url?: string }[];
    labels?: { id: string; name: string; color: string }[];
    dueDate?: string;
    estimate?: number;
    createdAt?: string;
}

interface Column {
    id: string;
    label: string;
    accessor: keyof WorkItem | "actions";
    width?: string;
    sortable?: boolean;
}

interface TableViewProps {
    items: WorkItem[];
    onItemClick?: (item: WorkItem) => void;
}

const columns: Column[] = [
    { id: "identifier", label: "ID", accessor: "identifier", width: "w-24", sortable: true },
    { id: "title", label: "Título", accessor: "title", sortable: true },
    { id: "state", label: "Estado", accessor: "state", width: "w-32" },
    { id: "priority", label: "Prioridade", accessor: "priority", width: "w-28", sortable: true },
    { id: "assignees", label: "Responsáveis", accessor: "assignees", width: "w-32" },
    { id: "dueDate", label: "Data Limite", accessor: "dueDate", width: "w-28", sortable: true },
    { id: "estimate", label: "Estimativa", accessor: "estimate", width: "w-24" },
    { id: "actions", label: "", accessor: "actions", width: "w-10" },
];

const priorityLabels = {
    urgent: { label: "Urgente", color: "bg-danger text-white" },
    high: { label: "Alta", color: "bg-warning text-white" },
    medium: { label: "Média", color: "bg-yellow-500 text-black" },
    low: { label: "Baixa", color: "bg-success text-white" },
    none: { label: "-", color: "bg-neutral-40 text-white" },
};

export function TableView({ items, onItemClick }: TableViewProps) {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (columnId: string) => {
        if (sortColumn === columnId) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnId);
            setSortDirection("asc");
        }
    };

    const sortedItems = [...items].sort((a, b) => {
        if (!sortColumn) return 0;
        const aVal = a[sortColumn as keyof WorkItem];
        const bVal = b[sortColumn as keyof WorkItem];
        if (aVal === bVal) return 0;
        if (aVal === undefined) return 1;
        if (bVal === undefined) return -1;
        const comparison = String(aVal).localeCompare(String(bVal));
        return sortDirection === "asc" ? comparison : -comparison;
    });

    return (
        <div className="h-full overflow-auto">
            <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-primary-10 z-10">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.id}
                                className={cn(
                                    "text-left text-xs font-medium text-neutral-40 p-3 border-b border-primary-30",
                                    col.width,
                                    col.sortable && "cursor-pointer hover:text-neutral"
                                )}
                                onClick={() => col.sortable && handleSort(col.id)}
                            >
                                <div className="flex items-center gap-1">
                                    {col.label}
                                    {col.sortable && sortColumn === col.id && (
                                        sortDirection === "asc" ? (
                                            <ChevronUp className="h-3 w-3" />
                                        ) : (
                                            <ChevronDown className="h-3 w-3" />
                                        )
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedItems.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => onItemClick?.(item)}
                            className="hover:bg-primary-20 cursor-pointer border-b border-primary-30"
                        >
                            <td className="p-3 text-sm text-neutral-40 font-mono">
                                {item.identifier}
                            </td>
                            <td className="p-3 text-sm text-neutral">
                                {item.title}
                            </td>
                            <td className="p-3">
                                {item.state && (
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: item.state.color }}
                                        />
                                        <span className="text-xs text-neutral-30">
                                            {item.state.name}
                                        </span>
                                    </div>
                                )}
                            </td>
                            <td className="p-3">
                                <span className={cn(
                                    "text-xs px-2 py-0.5 rounded",
                                    priorityLabels[item.priority].color
                                )}>
                                    {priorityLabels[item.priority].label}
                                </span>
                            </td>
                            <td className="p-3">
                                <div className="flex -space-x-1">
                                    {item.assignees?.slice(0, 3).map((assignee) => (
                                        <Avatar key={assignee.id} className="h-6 w-6 border border-primary-10">
                                            <AvatarImage src={assignee.avatar_url} />
                                            <AvatarFallback className="text-[10px]">
                                                {assignee.name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                            </td>
                            <td className="p-3 text-xs text-neutral-40">
                                {item.dueDate ? new Date(item.dueDate).toLocaleDateString("pt-BR") : "-"}
                            </td>
                            <td className="p-3 text-xs text-neutral-40 text-center">
                                {item.estimate ?? "-"}
                            </td>
                            <td className="p-3">
                                <button className="p-1 hover:bg-primary-30 rounded">
                                    <MoreHorizontal className="h-4 w-4 text-neutral-40" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
