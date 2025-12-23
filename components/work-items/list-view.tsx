"use client";

import {
    Plus,
    Calendar,
    Circle,
    CheckCircle2,
    AlertCircle,
    Signal,
    History as HistoryIcon,
    Paperclip,
    MoreHorizontal,
    Clipboard,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WorkItem {
    id: string;
    identifier: string;
    title: string;
    priority: "urgent" | "high" | "medium" | "low" | "none";
    state: { id: string; name: string; color: string; group_name: string };
    assignees: { id: string; name: string; avatar?: string }[];
    labels?: { id: string; name: string; color: string }[];
    dueDate?: string;
    startDate?: string;
}

interface ListViewProps {
    items: WorkItem[];
    onItemClick?: (item: WorkItem) => void;
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

export function ListView({ items, onItemClick }: ListViewProps) {
    // Group items by state
    const states = Array.from(new Set(items.map(i => i.state.id)))
        .map(id => items.find(i => i.state.id === id)!.state)
        .sort((a, b) => {
            const order = ["backlog", "unstarted", "started", "completed", "cancelled"];
            return order.indexOf(a.group_name) - order.indexOf(b.group_name);
        });

    return (
        <div className="space-y-6">
            {states.map((state) => (
                <div key={state.id} className="space-y-1">
                    {/* State Header */}
                    <div className="flex items-center justify-between group px-2 py-1 cursor-pointer hover:bg-primary-20/30 rounded-lg transition-colors">
                        <div className="flex items-center gap-2">
                            {(() => {
                                const StateIcon = stateIcons[state.group_name]?.icon || Circle;
                                return <StateIcon className={cn("h-4 w-4", stateIcons[state.group_name]?.color || "text-neutral-40")} />;
                            })()}
                            <span className="text-sm font-semibold text-neutral">
                                {state.name}
                            </span>
                            <span className="text-sm font-medium text-neutral-40 ml-1">
                                {items.filter(i => i.state.id === state.id).length}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="h-4 w-4 text-neutral-40 hover:text-neutral transition-colors" />
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-[1px]">
                        {items
                            .filter(i => i.state.id === state.id)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => onItemClick?.(item)}
                                    className="flex items-center justify-between gap-4 px-3 py-2.5 hover:bg-primary-20/50 group cursor-pointer border-y border-transparent transition-all"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="text-[10px] font-medium text-neutral-40 uppercase tracking-wider w-24 flex-shrink-0">
                                            {item.identifier}
                                        </span>
                                        <span className="text-[13px] text-neutral-10 font-medium truncate">
                                            {item.title}
                                        </span>
                                    </div>

                                    {/* Item Meta */}
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        {/* Status Badge */}
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-primary-20/50 rounded border border-primary-30 text-[11px] text-neutral-20">
                                            {(() => {
                                                const StateIcon = stateIcons[state.group_name]?.icon || Circle;
                                                return <StateIcon className={cn("h-3 w-3", stateIcons[state.group_name]?.color || "text-neutral-40")} />;
                                            })()}
                                            {state.name}
                                        </div>

                                        {/* Priority */}
                                        <div className="p-1 bg-primary-20/50 rounded border border-primary-30 text-neutral-40">
                                            {(() => {
                                                const PriorityIcon = priorityIcons[item.priority]?.icon || Circle;
                                                return <PriorityIcon className={cn("h-3 w-3", priorityIcons[item.priority]?.color || "text-neutral-40")} />;
                                            })()}
                                        </div>

                                        {/* Date */}
                                        {(item.startDate || item.dueDate) && (
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-primary-20/50 rounded border border-primary-30 text-[11px] text-neutral-30">
                                                <Calendar className="h-3 w-3" />
                                                <span>{item.startDate ? "Dec 16, 2025" : ""}</span>
                                                <span className="mx-0.5">-</span>
                                                <span>{item.dueDate ? "Jan 09, 2026" : ""}</span>
                                                <button className="ml-1 hover:text-neutral-10 text-[8px]">×</button>
                                            </div>
                                        )}

                                        {/* Assignee */}
                                        {item.assignees && item.assignees[0] && (
                                            <Avatar className="h-5 w-5 border border-primary-30 shadow-sm">
                                                <AvatarImage src={item.assignees[0].avatar} />
                                                <AvatarFallback className="text-[10px] bg-primary-30">
                                                    {item.assignees[0].name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}

                                        {/* Icons */}
                                        <div className="flex items-center gap-2 text-neutral-40">
                                            <Clipboard className="h-3.5 w-3.5" />
                                            <Clock className="h-3.5 w-3.5" />
                                            {item.labels?.map((label) => (
                                                <div key={label.id} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary-20/50 border border-primary-30 text-[10px]">
                                                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: label.color }} />
                                                    <span>{label.name}</span>
                                                </div>
                                            ))}
                                            <Paperclip className="h-3.5 w-3.5" />
                                            <MoreHorizontal className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {/* New Item Placeholder */}
                        <div className="flex items-center gap-2 px-3 py-2 text-neutral-40 hover:text-neutral transition-colors cursor-pointer group">
                            <Plus className="h-4 w-4" />
                            <span className="text-xs font-medium">Novo Item de trabalho</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
