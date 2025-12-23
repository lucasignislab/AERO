"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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



export function CalendarView({ items, onItemClick }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    // Helper to check if a date is within the mon-fri range
    const isWeekday = (date: Date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };

    // Calculate days to show (Mon-Fri)
    const getDaysInGrid = () => {
        const days = [];
        const startOfMonth = new Date(year, month, 1);

        // Find the first Monday before or on the 1st of the month
        const firstDateInGrid = new Date(startOfMonth);
        const dayOfWeek = firstDateInGrid.getDay();
        const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
        firstDateInGrid.setDate(firstDateInGrid.getDate() + diff);

        // We show 6 weeks (30 weekday cells)
        const currentGridDate = new Date(firstDateInGrid);
        for (let i = 0; i < 42; i++) {
            if (isWeekday(currentGridDate)) {
                days.push(new Date(currentGridDate));
            }
            currentGridDate.setDate(currentGridDate.getDate() + 1);
            if (days.length >= 30) break;
        }
        return days;
    };

    const daysInGrid = getDaysInGrid();

    // Group items by date
    const itemsByDate: Record<string, WorkItem[]> = {};
    items.forEach((item) => {
        if (item.dueDate) {
            const dateKey = item.dueDate.split("T")[0];
            if (!itemsByDate[dateKey]) itemsByDate[dateKey] = [];
            itemsByDate[dateKey].push(item);
        }
    });

    return (
        <div className="h-full flex flex-col pt-2">
            {/* Header Controls */}
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-1">
                    <div className="flex items-center mr-2">
                        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 text-neutral-40 hover:text-neutral">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 text-neutral-40 hover:text-neutral">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <span className="text-xl font-semibold text-neutral">
                        {monthName}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentDate(new Date())}
                        className="text-xs font-medium text-neutral-40 hover:text-neutral"
                    >
                        Hoje
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-xs font-medium text-neutral-40 hover:text-neutral gap-1">
                                Opções <ChevronDown className="h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Days header (Mon-Fri) */}
            <div className="grid grid-cols-5 border-b border-primary-30">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                    <div key={day} className="text-[11px] font-semibold text-neutral-40 text-right py-2 px-4 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid (Mon-Fri) */}
            <div className="grid grid-cols-5 flex-1 divide-x divide-y divide-primary-30 border-l border-b border-primary-30">
                {daysInGrid.map((date, idx) => {
                    const dateStr = date.toISOString().split("T")[0];
                    const dayItems = itemsByDate[dateStr] || [];
                    const isToday = new Date().toISOString().split("T")[0] === dateStr;
                    const isCurrentMonth = date.getMonth() === month;
                    const dayNum = date.getDate();
                    const dayLabel = dayNum === 1 ? date.toLocaleDateString("en-US", { month: "short" }) + " 1" : dayNum.toString();

                    return (
                        <div
                            key={idx}
                            className={cn(
                                "min-h-[120px] p-2 flex flex-col group transition-colors",
                                !isCurrentMonth && "bg-primary-10/20",
                                "hover:bg-primary-20/30"
                            )}
                        >
                            <div className="flex justify-end mb-2">
                                <div className={cn(
                                    "text-xs font-medium h-6 w-6 flex items-center justify-center rounded-full transition-colors",
                                    isToday ? "bg-[#0070E0] text-white" : "text-neutral-40 group-hover:text-neutral"
                                )}>
                                    {dayLabel}
                                </div>
                            </div>

                            <div className="flex-1 space-y-1">
                                {/* Placeholder for "+ Adicionar item de trabalho" */}
                                {idx === 3 && ( // Simplified: showing only on one day as it appears in the image
                                    <div className="flex items-center gap-2 px-2 py-1.5 bg-primary-20/50 rounded border border-primary-30 text-[11px] text-neutral-40 cursor-pointer hover:bg-primary-20 transition-colors">
                                        <Plus className="h-3 w-3" />
                                        <span>Adicionar item de trabalho</span>
                                    </div>
                                )}

                                {dayItems.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => onItemClick?.(item)}
                                        className={cn(
                                            "text-[11px] px-2 py-1 bg-primary-20/50 rounded border border-primary-30 cursor-pointer hover:bg-primary-20 transition-colors flex items-center gap-1.5 truncate",
                                        )}
                                    >
                                        <span className="text-[10px] text-neutral-40 font-medium">{item.identifier}</span>
                                        <span className="text-neutral truncate">{item.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
