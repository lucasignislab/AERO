"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    MoreHorizontal,
    Plus,
    GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkItem {
    id: string;
    identifier: string;
    title: string;
    priority: "urgent" | "high" | "medium" | "low" | "none";
    assignees?: { id: string; name: string; avatar?: string }[];
    labels?: { id: string; name: string; color: string }[];
}

interface Column {
    id: string;
    name: string;
    color: string;
    items: WorkItem[];
}

interface KanbanBoardProps {
    columns: Column[];
    onItemClick?: (item: WorkItem) => void;
    onAddItem?: (columnId: string) => void;
}

const priorityColors = {
    urgent: "bg-danger",
    high: "bg-warning",
    medium: "bg-info",
    low: "bg-success",
    none: "bg-neutral-40",
};

export function KanbanBoard({ columns, onItemClick, onAddItem }: KanbanBoardProps) {
    const [draggedItem, setDraggedItem] = useState<WorkItem | null>(null);

    return (
        <div className="flex gap-4 h-full overflow-x-auto pb-4">
            {columns.map((column) => (
                <div
                    key={column.id}
                    className="flex-shrink-0 w-72 bg-primary-20 rounded-lg flex flex-col"
                >
                    {/* Column Header */}
                    <div className="p-3 border-b border-primary-30 flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: column.color }}
                        />
                        <span className="font-medium text-neutral text-sm">{column.name}</span>
                        <span className="text-neutral-40 text-xs ml-1">{column.items.length}</span>
                        <div className="ml-auto flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => onAddItem?.(column.id)}
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <MoreHorizontal className="h-3.5 w-3.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                    <DropdownMenuItem>Esconder</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Column Items */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {column.items.map((item) => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={() => setDraggedItem(item)}
                                onDragEnd={() => setDraggedItem(null)}
                                onClick={() => onItemClick?.(item)}
                                className={cn(
                                    "bg-card border border-primary-30 rounded-lg p-3 cursor-pointer",
                                    "hover:border-brand/50 transition-colors group",
                                    draggedItem?.id === item.id && "opacity-50"
                                )}
                            >
                                <div className="flex items-start gap-2">
                                    <GripVertical className="h-4 w-4 text-neutral-40 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 cursor-grab" />
                                    <div className="flex-1 min-w-0">
                                        {/* Priority + Identifier */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <div
                                                className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    priorityColors[item.priority]
                                                )}
                                            />
                                            <span className="text-xs text-neutral-40">{item.identifier}</span>
                                        </div>

                                        {/* Title */}
                                        <p className="text-sm text-neutral font-medium line-clamp-2">
                                            {item.title}
                                        </p>

                                        {/* Labels */}
                                        {item.labels && item.labels.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {item.labels.map((label) => (
                                                    <Badge
                                                        key={label.id}
                                                        variant="outline"
                                                        className="text-xs px-1.5 py-0"
                                                        style={{ borderColor: label.color, color: label.color }}
                                                    >
                                                        {label.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {/* Assignees */}
                                        {item.assignees && item.assignees.length > 0 && (
                                            <div className="flex -space-x-2 mt-2">
                                                {item.assignees.slice(0, 3).map((assignee) => (
                                                    <Avatar key={assignee.id} className="h-6 w-6 border-2 border-card">
                                                        <AvatarImage src={assignee.avatar} />
                                                        <AvatarFallback className="text-xs">
                                                            {assignee.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ))}
                                                {item.assignees.length > 3 && (
                                                    <div className="h-6 w-6 rounded-full bg-primary-20 border-2 border-card flex items-center justify-center">
                                                        <span className="text-xs text-neutral-30">
                                                            +{item.assignees.length - 3}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
