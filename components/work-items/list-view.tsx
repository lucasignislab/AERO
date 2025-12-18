"use client";

import {
    ChevronDown,
    ChevronRight,
    Circle,
    CircleDot,
    CheckCircle2,
    XCircle,
    Plus,
    MoreHorizontal,
    MessageSquare,
    Eye,
    Paperclip,
    AlertCircle,
    SignalHigh,
    SignalMedium,
    SignalLow,
    CircleSlash,
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

const StateIcon = ({ group, color }: { group: string; color: string }) => {
    switch (group) {
        case "backlog":
            return <Circle className="h-4 w-4 text-neutral-40" />;
        case "unstarted":
            return <Circle className="h-4 w-4 text-white" />;
        case "started":
            return <CircleDot className="h-4 w-4 text-warning" />;
        case "completed":
            return <CheckCircle2 className="h-4 w-4 text-success" />;
        case "cancelled":
            return <XCircle className="h-4 w-4 text-neutral-40" />;
        default:
            return <Circle className="h-4 w-4" style={{ color }} />;
    }
};

const PriorityIcon = ({ priority }: { priority: string }) => {
    switch (priority) {
        case "urgent":
            return <AlertCircle className="h-3.5 w-3.5 text-danger" />;
        case "high":
            return <SignalHigh className="h-3.5 w-3.5 text-warning" />;
        case "medium":
            return <SignalMedium className="h-3.5 w-3.5 text-info" />;
        case "low":
            return <SignalLow className="h-3.5 w-3.5 text-success" />;
        default:
            return <CircleSlash className="h-3.5 w-3.5 text-neutral-40" />;
    }
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
                    <div className="flex items-center justify-between group px-2 py-1">
                        <div className="flex items-center gap-2">
                            <StateIcon group={state.group_name} color={state.color} />
                            <span className="text-sm font-semibold text-neutral">
                                {state.name}
                            </span>
                            <span className="text-xs text-neutral-40">
                                {items.filter(i => i.state.id === state.id).length}
                            </span>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary-20 rounded transition-opacity">
                            <Plus className="h-4 w-4 text-neutral-40" />
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="space-y-[1px]">
                        {items
                            .filter(i => i.state.id === state.id)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => onItemClick?.(item)}
                                    className="flex items-center gap-4 px-3 py-2.5 hover:bg-primary-20/50 group cursor-pointer border-y border-transparent hover:border-primary-30 transition-all rounded-md"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="text-xs font-medium text-neutral-40 w-24 flex-shrink-0">
                                            {item.identifier}
                                        </span>
                                        <span className="text-sm text-neutral truncate font-medium">
                                            {item.title}
                                        </span>
                                    </div>

                                    {/* Item Meta */}
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        {/* Status Badge */}
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-20/50 border border-primary-30">
                                            <StateIcon group={item.state.group_name} color={item.state.color} />
                                            <span className="text-[10px] font-medium text-neutral-30">
                                                {item.state.name}
                                            </span>
                                        </div>

                                        {/* Priority */}
                                        <div className="p-1 rounded bg-primary-20/50 border border-primary-30">
                                            <PriorityIcon priority={item.priority} />
                                        </div>

                                        {/* Date */}
                                        {(item.startDate || item.dueDate) && (
                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-primary-20/50 border border-primary-30 text-[10px] text-neutral-30">
                                                <span>{item.startDate ? "Dec 16, 2025" : ""}</span>
                                                <span>-</span>
                                                <span>{item.dueDate ? "Jan 09, 2026" : ""}</span>
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
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            <Eye className="h-3.5 w-3.5" />
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
