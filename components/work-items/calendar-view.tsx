"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface WorkItem {
    id: string;
    identifier: string;
    title: string;
    priority: "urgent" | "high" | "medium" | "low" | "none";
    dueDate?: string;
    state?: { id: string; name: string; color: string };
}

interface CalendarViewProps {
    items: WorkItem[];
    onItemClick?: (item: WorkItem) => void;
}

const priorityColors = {
    urgent: "border-l-danger",
    high: "border-l-warning",
    medium: "border-l-yellow-500",
    low: "border-l-success",
    none: "border-l-neutral-40",
};

export function CalendarView({ items, onItemClick }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const monthName = currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

    // Group items by date
    const itemsByDate: Record<string, WorkItem[]> = {};
    items.forEach((item) => {
        if (item.dueDate) {
            const dateKey = item.dueDate.split("T")[0];
            if (!itemsByDate[dateKey]) itemsByDate[dateKey] = [];
            itemsByDate[dateKey].push(item);
        }
    });

    const days = [];
    for (let i = 0; i < startPadding; i++) {
        days.push(<div key={`pad-${i}`} className="min-h-[100px] bg-primary-10/50" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayItems = itemsByDate[dateStr] || [];
        const isToday = new Date().toISOString().split("T")[0] === dateStr;

        days.push(
            <div
                key={day}
                className={cn(
                    "min-h-[100px] p-1 border border-primary-30",
                    isToday && "bg-brand/10"
                )}
            >
                <div className={cn(
                    "text-xs font-medium mb-1",
                    isToday ? "text-brand" : "text-neutral-40"
                )}>
                    {day}
                </div>
                <div className="space-y-1">
                    {dayItems.slice(0, 3).map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onItemClick?.(item)}
                            className={cn(
                                "text-[10px] px-1 py-0.5 bg-primary-20 rounded cursor-pointer hover:bg-primary-30 truncate border-l-2",
                                priorityColors[item.priority]
                            )}
                        >
                            {item.title}
                        </div>
                    ))}
                    {dayItems.length > 3 && (
                        <div className="text-[10px] text-neutral-40 px-1">
                            +{dayItems.length - 3} mais
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-medium text-neutral capitalize w-48 text-center">
                        {monthName}
                    </span>
                    <Button variant="ghost" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <Button variant="ghost" onClick={() => setCurrentDate(new Date())}>
                    Hoje
                </Button>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-0 mb-1">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                    <div key={day} className="text-xs font-medium text-neutral-40 text-center py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0 flex-1 overflow-auto">
                {days}
            </div>
        </div>
    );
}
