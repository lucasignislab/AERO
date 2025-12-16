"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface WorkItem {
    id: string;
    identifier: string;
    title: string;
    priority: "urgent" | "high" | "medium" | "low" | "none";
    startDate?: string;
    dueDate?: string;
    state?: { id: string; name: string; color: string };
}

interface TimelineViewProps {
    items: WorkItem[];
    onItemClick?: (item: WorkItem) => void;
}

const priorityColors = {
    urgent: "bg-danger",
    high: "bg-warning",
    medium: "bg-yellow-500",
    low: "bg-success",
    none: "bg-neutral-40",
};

export function TimelineView({ items, onItemClick }: TimelineViewProps) {
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        today.setDate(today.getDate() - today.getDay()); // Start of week
        return today;
    });

    const days = useMemo(() => {
        const result = [];
        for (let i = 0; i < 28; i++) { // 4 weeks
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            result.push(date);
        }
        return result;
    }, [startDate]);

    const prevPeriod = () => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() - 7);
        setStartDate(newDate);
    };

    const nextPeriod = () => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + 7);
        setStartDate(newDate);
    };

    const goToToday = () => {
        const today = new Date();
        today.setDate(today.getDate() - today.getDay());
        setStartDate(today);
    };

    const getItemPosition = (item: WorkItem) => {
        if (!item.startDate || !item.dueDate) return null;

        const start = new Date(item.startDate);
        const end = new Date(item.dueDate);
        const timelineStart = days[0];
        const timelineEnd = days[days.length - 1];

        if (end < timelineStart || start > timelineEnd) return null;

        const effectiveStart = start < timelineStart ? timelineStart : start;
        const effectiveEnd = end > timelineEnd ? timelineEnd : end;

        const startOffset = Math.floor((effectiveStart.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
        const duration = Math.ceil((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        return {
            left: `${(startOffset / 28) * 100}%`,
            width: `${(duration / 28) * 100}%`,
        };
    };

    const todayIndex = days.findIndex(
        (d) => d.toDateString() === new Date().toDateString()
    );

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={prevPeriod}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium text-neutral w-64 text-center">
                        {days[0].toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} - {days[days.length - 1].toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <Button variant="ghost" size="icon" onClick={nextPeriod}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <Button variant="ghost" onClick={goToToday}>
                    Hoje
                </Button>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-auto">
                {/* Days header */}
                <div className="flex border-b border-primary-30 sticky top-0 bg-primary-10 z-10">
                    <div className="w-48 shrink-0 p-2 border-r border-primary-30">
                        <span className="text-xs font-medium text-neutral-40">Item</span>
                    </div>
                    <div className="flex-1 flex relative">
                        {days.map((day, i) => {
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                            const isToday = day.toDateString() === new Date().toDateString();
                            return (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex-1 text-center py-1 border-r border-primary-30 last:border-r-0",
                                        isWeekend && "bg-primary-20/50",
                                        isToday && "bg-brand/10"
                                    )}
                                >
                                    <div className="text-[10px] text-neutral-40">
                                        {day.toLocaleDateString("pt-BR", { weekday: "short" })}
                                    </div>
                                    <div className={cn(
                                        "text-xs font-medium",
                                        isToday ? "text-brand" : "text-neutral-30"
                                    )}>
                                        {day.getDate()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Items */}
                {items.map((item) => {
                    const position = getItemPosition(item);
                    return (
                        <div
                            key={item.id}
                            className="flex border-b border-primary-30 hover:bg-primary-20/50"
                        >
                            <div
                                className="w-48 shrink-0 p-2 border-r border-primary-30 cursor-pointer"
                                onClick={() => onItemClick?.(item)}
                            >
                                <div className="text-xs text-neutral-40 font-mono">
                                    {item.identifier}
                                </div>
                                <div className="text-sm text-neutral truncate">
                                    {item.title}
                                </div>
                            </div>
                            <div className="flex-1 relative h-12">
                                {position && (
                                    <div
                                        className={cn(
                                            "absolute top-2 h-8 rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center px-2",
                                            priorityColors[item.priority]
                                        )}
                                        style={{
                                            left: position.left,
                                            width: position.width,
                                            minWidth: "20px",
                                        }}
                                        onClick={() => onItemClick?.(item)}
                                    >
                                        <span className="text-xs text-white truncate">
                                            {item.title}
                                        </span>
                                    </div>
                                )}
                                {todayIndex >= 0 && (
                                    <div
                                        className="absolute top-0 bottom-0 w-0.5 bg-brand z-10"
                                        style={{ left: `${((todayIndex + 0.5) / 28) * 100}%` }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
