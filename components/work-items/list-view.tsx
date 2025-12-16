"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, MoreHorizontal } from "lucide-react";
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
    state?: { id: string; name: string; color: string };
    assignees?: { id: string; name: string; avatar?: string }[];
    labels?: { id: string; name: string; color: string }[];
    dueDate?: string;
    children?: WorkItem[];
}

interface ListViewProps {
    items: WorkItem[];
    onItemClick?: (item: WorkItem) => void;
    onItemComplete?: (item: WorkItem) => void;
    groupBy?: "state" | "priority" | "assignee" | "none";
}

const priorityLabels = {
    urgent: "Urgente",
    high: "Alta",
    medium: "Média",
    low: "Baixa",
    none: "Sem prioridade",
};

const priorityColors = {
    urgent: "text-danger",
    high: "text-warning",
    medium: "text-info",
    low: "text-success",
    none: "text-neutral-40",
};

export function ListView({ items, onItemClick, onItemComplete }: ListViewProps) {
    return (
        <div className="bg-primary-20 rounded-lg border border-primary-30 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-primary-30 text-xs font-medium text-neutral-40 uppercase tracking-wider">
                <div className="col-span-6">Tarefa</div>
                <div className="col-span-2">Estado</div>
                <div className="col-span-2">Prioridade</div>
                <div className="col-span-2">Responsável</div>
            </div>

            {/* Items */}
            <div className="divide-y divide-primary-30">
                {items.map((item) => (
                    <ListItem
                        key={item.id}
                        item={item}
                        onItemClick={onItemClick}
                        onItemComplete={onItemComplete}
                    />
                ))}
            </div>
        </div>
    );
}

function ListItem({
    item,
    onItemClick,
    onItemComplete,
    depth = 0,
}: {
    item: WorkItem;
    onItemClick?: (item: WorkItem) => void;
    onItemComplete?: (item: WorkItem) => void;
    depth?: number;
}) {
    const hasChildren = item.children && item.children.length > 0;

    return (
        <>
            <div
                className={cn(
                    "grid grid-cols-12 gap-4 px-4 py-3 hover:bg-primary-10 cursor-pointer group transition-colors",
                    depth > 0 && "bg-primary-30/30"
                )}
                onClick={() => onItemClick?.(item)}
                style={{ paddingLeft: `${16 + depth * 24}px` }}
            >
                {/* Task */}
                <div className="col-span-6 flex items-center gap-3 min-w-0">
                    <Checkbox
                        onClick={(e) => {
                            e.stopPropagation();
                            onItemComplete?.(item);
                        }}
                        className="border-neutral-40"
                    />

                    {hasChildren && (
                        <ChevronRight className="h-4 w-4 text-neutral-40 flex-shrink-0" />
                    )}

                    <span className="text-xs text-neutral-40 flex-shrink-0">
                        {item.identifier}
                    </span>

                    <span className="text-sm text-neutral truncate">{item.title}</span>

                    {/* Labels */}
                    {item.labels && item.labels.length > 0 && (
                        <div className="flex gap-1 flex-shrink-0">
                            {item.labels.slice(0, 2).map((label) => (
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
                </div>

                {/* State */}
                <div className="col-span-2 flex items-center">
                    {item.state && (
                        <Badge variant="secondary" className="text-xs">
                            <span
                                className="w-2 h-2 rounded-full mr-1.5"
                                style={{ backgroundColor: item.state.color }}
                            />
                            {item.state.name}
                        </Badge>
                    )}
                </div>

                {/* Priority */}
                <div className="col-span-2 flex items-center">
                    <span className={cn("text-xs", priorityColors[item.priority])}>
                        {priorityLabels[item.priority]}
                    </span>
                </div>

                {/* Assignees */}
                <div className="col-span-2 flex items-center justify-between">
                    {item.assignees && item.assignees.length > 0 ? (
                        <div className="flex -space-x-2">
                            {item.assignees.slice(0, 3).map((assignee) => (
                                <Avatar key={assignee.id} className="h-6 w-6 border-2 border-primary-20">
                                    <AvatarImage src={assignee.avatar} />
                                    <AvatarFallback className="text-xs">
                                        {assignee.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                    ) : (
                        <span className="text-xs text-neutral-40">—</span>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Duplicar</DropdownMenuItem>
                            <DropdownMenuItem className="text-danger">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Children */}
            {hasChildren &&
                item.children?.map((child) => (
                    <ListItem
                        key={child.id}
                        item={child}
                        onItemClick={onItemClick}
                        onItemComplete={onItemComplete}
                        depth={depth + 1}
                    />
                ))}
        </>
    );
}
