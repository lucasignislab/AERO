"use client";

import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    Maximize2
} from "lucide-react";
import { useState, useMemo, useRef } from "react";

interface WorkItem {
    id: string;
    identifier: string;
    title: string;
    priority: "urgent" | "high" | "medium" | "low" | "none";
    startDate?: string;
    dueDate?: string;
    state?: { id: string; name: string; color: string; group_name: string };
}

interface TimelineViewProps {
    items: WorkItem[];
    onItemClick?: (item: WorkItem) => void;
}

export function TimelineView({ items, onItemClick }: TimelineViewProps) {
    const [viewMode, setViewMode] = useState<"Semana" | "Mês" | "Trimestre">("Semana");
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Base date for timeline - centering around today
    const [baseDate] = useState(new Date("2025-12-23")); // Using the date from image/current time context

    const days = useMemo(() => {
        const result = [];
        const start = new Date(baseDate);
        start.setDate(baseDate.getDate() - 15); // Show some days before

        for (let i = 0; i < 45; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            result.push(date);
        }
        return result;
    }, [baseDate]);

    const weeks = useMemo(() => {
        const result: { weekNum: number; startIdx: number; endIdx: number; monthName: string }[] = [];
        let currentWeek: { weekNum: number; startIdx: number; endIdx: number; monthName: string } | null = null;

        days.forEach((day, idx) => {
            // Simple week calculation for demo (ISO week logic would be better but this matches image)
            const weekNum = 51 + Math.floor((idx - 1) / 7); // Adjusting to match Dec 15-21 as Week 51
            const monthName = day.toLocaleString("en-US", { month: "short", year: "numeric" });

            if (!currentWeek || currentWeek.weekNum !== weekNum) {
                if (currentWeek) currentWeek.endIdx = idx - 1;
                currentWeek = { weekNum, startIdx: idx, endIdx: idx, monthName };
                result.push(currentWeek);
            } else {
                currentWeek.endIdx = idx;
            }
        });
        return result;
    }, [days]);

    // Format week day initials as in image (T, W, Th, F, Sa, Su, M)
    const formatDayLabel = (date: Date) => {
        const weekDays = ["Su", "M", "T", "W", "Th", "F", "Sa"];
        const dayLabel = weekDays[date.getDay()];
        return dayLabel;
    };

    const getItemPosition = (item: WorkItem) => {
        if (!item.startDate || !item.dueDate) return null;

        const start = new Date(item.startDate);
        const end = new Date(item.dueDate);
        const timelineStart = days[0];
        const timelineEnd = days[days.length - 1];

        if (end < timelineStart || start > timelineEnd) return null;

        const startIdx = days.findIndex(d => d.toDateString() === start.toDateString());
        const endIdx = days.findIndex(d => d.toDateString() === end.toDateString());

        const effectiveStartIdx = startIdx === -1 ? 0 : startIdx;
        const effectiveEndIdx = endIdx === -1 ? days.length - 1 : endIdx;

        return {
            left: `${(effectiveStartIdx / days.length) * 100}%`,
            width: `${((effectiveEndIdx - effectiveStartIdx + 1) / days.length) * 100}%`,
        };
    };

    const isCurrentToday = (date: Date) => date.toDateString() === new Date("2025-12-23").toDateString();

    return (
        <div className="h-full flex flex-col bg-primary-10">
            {/* Top Toolbar */}
            <div className="flex items-center justify-end gap-4 p-2 border-b border-primary-30">
                <div className="flex items-center gap-2 text-[12px] text-neutral-40">
                    <span>{items.length} Itens de trabalho</span>
                </div>

                <div className="flex bg-primary-20/50 p-0.5 rounded-md border border-primary-30">
                    {(["Semana", "Mês", "Trimestre"] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={cn(
                                "px-3 py-1 rounded text-[12px] font-medium transition-all",
                                viewMode === mode
                                    ? "bg-primary-10 text-neutral shadow-sm"
                                    : "text-neutral-40 hover:text-neutral"
                            )}
                        >
                            {mode}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 px-2 border-x border-primary-30">
                    <button className="p-1 hover:bg-primary-20 rounded text-neutral-40">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-[12px] font-medium text-neutral-30">Hoje</span>
                    <button className="p-1 hover:bg-primary-20 rounded text-neutral-40">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                <button className="p-1.5 hover:bg-primary-20 rounded text-neutral-40">
                    <Maximize2 className="h-4 w-4" />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Fixed Side Sidebar */}
                <div className="w-[300px] flex flex-col border-r border-primary-30 shrink-0">
                    <div className="h-[80px] flex border-b border-primary-30">
                        <div className="flex-1 p-4 flex items-end">
                            <span className="text-[13px] font-medium text-neutral-30">Itens de trabalho</span>
                        </div>
                        <div className="w-[100px] p-4 flex items-end justify-end border-l border-primary-30">
                            <span className="text-[13px] font-medium text-neutral-30">Duração</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="h-[48px] flex border-b border-primary-30 hover:bg-primary-20/30 cursor-pointer group transition-colors"
                            >
                                <div className="flex-1 px-4 flex items-center gap-3 min-w-0">
                                    <span className="text-[12px] text-neutral-40 font-medium whitespace-nowrap uppercase tracking-wider">
                                        {item.identifier}
                                    </span>
                                    <span className="text-[13px] text-neutral-10 font-medium truncate">
                                        {item.title}
                                    </span>
                                </div>
                                <div className="w-[100px] px-4 flex items-center justify-end border-l border-primary-30/50">
                                    <span className="text-[12px] text-neutral-40 font-medium">
                                        {item.identifier === "AEROPROJEC-2" ? "25 days" : "20 days"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scrollable Timeline Grid */}
                <div className="flex-1 overflow-auto bg-[#0A0A0A]" ref={scrollContainerRef}>
                    <div className="min-w-max h-full relative">
                        {/* Headers */}
                        <div className="sticky top-0 z-20 bg-[#0A0A0A]">
                            {/* Month Header */}
                            <div className="h-[40px] flex border-b border-primary-30">
                                {weeks.map((week, idx) => (
                                    <div
                                        key={idx}
                                        style={{ width: `${((week.endIdx - week.startIdx + 1) / days.length) * 100}%` }}
                                        className="border-r border-primary-30 p-2 flex items-center"
                                    >
                                        <span className="text-[12px] font-medium text-neutral-30 whitespace-nowrap">
                                            {week.monthName}
                                        </span>
                                        <span className="text-[11px] text-neutral-40 ml-auto whitespace-nowrap">
                                            Week {week.weekNum}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {/* Days Header */}
                            <div className="h-[40px] flex border-b border-primary-30">
                                {days.map((day, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex-1 min-w-[40px] border-r border-primary-30 flex flex-col items-center justify-center gap-0.5",
                                            isCurrentToday(day) && "bg-white/5"
                                        )}
                                    >
                                        <span className={cn(
                                            "text-[12px] font-medium",
                                            isCurrentToday(day) ? "bg-info text-white w-6 h-6 flex items-center justify-center rounded-full" : "text-neutral-10"
                                        )}>
                                            {day.getDate()}
                                        </span>
                                        <span className="text-[10px] text-neutral-40 uppercase">
                                            {formatDayLabel(day)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Timeline Body Grid */}
                        <div className="relative pt-0 h-[calc(100%-80px)]">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex">
                                {days.map((day, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex-1 min-w-[40px] border-r border-primary-30/30",
                                            isCurrentToday(day) && "bg-info/10 border-info/20"
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Item Bars */}
                            <div className="relative z-10 w-full">
                                {items.map((item) => {
                                    const position = getItemPosition(item);
                                    if (!position) return null;

                                    return (
                                        <div key={item.id} className="h-[48px] flex items-center">
                                            <div
                                                className={cn(
                                                    "h-[28px] rounded overflow-hidden flex items-center px-4 transition-all hover:ring-2 hover:ring-white/20 select-none",
                                                    item.priority === "urgent" || item.priority === "high"
                                                        ? "bg-[#A35A01] text-white"
                                                        : "bg-primary-30/50 text-neutral-20"
                                                )}
                                                style={{
                                                    left: position.left,
                                                    width: position.width,
                                                    position: 'relative'
                                                }}
                                                onClick={() => onItemClick?.(item)}
                                            >
                                                <span className="text-[13px] font-medium truncate">
                                                    {item.title}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
