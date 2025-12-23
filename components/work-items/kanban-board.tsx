"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Plus,
    Maximize2,
    Calendar,
    Circle,
    CheckCircle2,
    AlertCircle,
    Signal,
    History as HistoryIcon,
    Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkItem {
    id: string;
    identifier: string;
    title: string;
    priority: "urgent" | "high" | "medium" | "low" | "none";
    assignees?: { id: string; name: string; avatar?: string }[];
    labels?: { id: string; name: string; color: string }[];
    dueDate?: string;
    startDate?: string;
    state?: { id: string; name: string; color: string; group_name: string };
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

const priorityIcons = {
    urgent: { icon: AlertCircle, color: "text-danger" },
    high: { icon: Signal, color: "text-warning" },
    medium: { icon: Signal, color: "text-info" },
    low: { icon: Signal, color: "text-success" },
    none: { icon: Circle, color: "text-neutral-40" },
};

const stateIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
    backlog: { icon: Circle, color: "text-neutral-40" },
    unstarted: { icon: Circle, color: "text-neutral-30" },
    started: { icon: HistoryIcon, color: "text-warning" },
    completed: { icon: CheckCircle2, color: "text-success" },
    cancelled: { icon: AlertCircle, color: "text-neutral-40" },
};

export function KanbanBoard({ columns, onItemClick, onAddItem }: KanbanBoardProps) {
    const [draggedItem, setDraggedItem] = useState<WorkItem | null>(null);

    return (
        <div className="flex gap-4 h-full overflow-x-auto pb-4 scrollbar-hide">
            {columns.map((column) => (
                <div
                    key={column.id}
                    className="flex-shrink-0 w-[350px] flex flex-col"
                >
                    {/* Column Header */}
                    <div className="p-3 flex items-center gap-2 group/header">
                        <div className="flex items-center gap-2">
                            {stateIcons[column.name.toLowerCase()] ? (
                                (() => {
                                    const StateIcon = stateIcons[column.name.toLowerCase()].icon;
                                    return <StateIcon className={cn("h-4 w-4", stateIcons[column.name.toLowerCase()].color)} />;
                                })()
                            ) : (
                                <Circle className="h-4 w-4 text-neutral-40" />
                            )}
                            <span className="font-semibold text-neutral text-sm">{column.name}</span>
                            <span className="text-neutral-40 text-sm ml-1">{column.items.length}</span>
                        </div>

                        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-40 hover:text-neutral">
                                <Maximize2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-neutral-40 hover:text-neutral"
                                onClick={() => onAddItem?.(column.id)}
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>

                    {/* Column Items */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-3 min-h-0">
                        {column.items.map((item) => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={() => setDraggedItem(item)}
                                onDragEnd={() => setDraggedItem(null)}
                                onClick={() => onItemClick?.(item)}
                                className={cn(
                                    "bg-[#1A1C23] border border-primary-30 rounded-lg p-4 cursor-pointer shadow-sm",
                                    "hover:border-neutral-40 transition-colors group",
                                    draggedItem?.id === item.id && "opacity-50"
                                )}
                            >
                                <div className="space-y-3">
                                    {/* ID & Title */}
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-medium text-neutral-40 uppercase tracking-wider">
                                            {item.identifier}
                                        </span>
                                        <p className="text-[13px] text-neutral-10 font-medium leading-tight">
                                            {item.title}
                                        </p>
                                    </div>

                                    {/* Badges Row */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Status */}
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-primary-20/50 rounded border border-primary-30 text-[11px] text-neutral-20">
                                            {stateIcons[column.name.toLowerCase()] ? (
                                                (() => {
                                                    const StateIcon = stateIcons[column.name.toLowerCase()].icon;
                                                    return <StateIcon className={cn("h-3 w-3", stateIcons[column.name.toLowerCase()].color)} />;
                                                })()
                                            ) : (
                                                <Circle className="h-3 w-3 text-neutral-40" />
                                            )}
                                            {column.name}
                                        </div>

                                        {/* Priority */}
                                        <div className="p-1 bg-primary-20/50 rounded border border-primary-30">
                                            {priorityIcons[item.priority] && (() => {
                                                const PriorityIcon = priorityIcons[item.priority].icon;
                                                return <PriorityIcon className={cn("h-3 w-3", priorityIcons[item.priority].color)} />;
                                            })()}
                                        </div>

                                        {/* Date */}
                                        {(item.startDate || item.dueDate) && (
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-primary-20/50 rounded border border-primary-30 text-[11px] text-neutral-30">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    {item.startDate ? "Dec 16, 2025" : ""} {item.dueDate ? "- Jan 09, 2026" : ""}
                                                </span>
                                                <button className="ml-1 hover:text-neutral-10">×</button>
                                            </div>
                                        )}

                                        {/* Group Icon (Mock for Team/Circle) */}
                                        <div className="p-1 bg-primary-20/50 rounded border border-primary-30">
                                            <HistoryIcon className="h-3 w-3 text-neutral-40" />
                                        </div>

                                        {/* Calendar Icon */}
                                        <div className="p-1 bg-primary-20/50 rounded border border-primary-30">
                                            <Calendar className="h-3 w-3 text-neutral-40" />
                                        </div>
                                    </div>

                                    {/* Footer Icons & Assignee */}
                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 text-neutral-40 hover:text-neutral-20 transition-colors">
                                                <Paperclip className="h-3.5 w-3.5" />
                                            </div>
                                            {item.labels && item.labels.length > 0 && (
                                                <div className="flex items-center gap-1 py-0.5 px-1.5 bg-primary-20/50 rounded border border-primary-30 text-[11px] text-neutral-30">
                                                    <Circle className="h-2 w-2 fill-current" style={{ color: item.labels[0].color }} />
                                                    {item.labels[0].name}
                                                </div>
                                            )}
                                            <div className="p-1 text-neutral-40 hover:text-neutral-20 transition-colors">
                                                <Plus className="h-3.5 w-3.5" />
                                            </div>
                                        </div>

                                        {item.assignees && item.assignees.length > 0 && (
                                            <Avatar className="h-5 w-5 border border-primary-30">
                                                <AvatarImage src={item.assignees[0].avatar} />
                                                <AvatarFallback className="text-[10px] bg-primary-30">
                                                    {item.assignees[0].name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* New Item Button in Column */}
                        <button
                            onClick={() => onAddItem?.(column.id)}
                            className="w-full flex items-center gap-2 p-2 text-neutral-40 hover:text-neutral-20 transition-colors text-sm group/btn"
                        >
                            <Plus className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                            <span>Novo Item de trabalho</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
