"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ChevronRight,
    Search,
    Filter,
    MoreHorizontal,
    Star,
    LayoutGrid,
    List,
    Layers,
    User,
    ArrowUpDown,
    CheckCircle2,
    Maximize2
} from "lucide-react";

interface Module {
    id: string;
    name: string;
    type: "System" | "Feature" | "Area";
    startDate: string;
    endDate: string;
    status: "planned" | "backlog" | "in-progress";
    completedItems: number;
    inProgressItems: number;
    totalItems: number;
    duration: string;
    color: string;
}

const mockModules: Module[] = [
    {
        id: "1",
        name: "Core Workflow",
        type: "System",
        startDate: "Dec 01, 2025",
        endDate: "Dec 15, 2025",
        status: "planned",
        completedItems: 1,
        inProgressItems: 1,
        totalItems: 4,
        duration: "15 days",
        color: "bg-blue-600"
    },
    {
        id: "2",
        name: "Onboarding Flow",
        type: "Feature",
        startDate: "Dec 03, 2025",
        endDate: "Dec 17, 2025",
        status: "backlog",
        completedItems: 0,
        inProgressItems: 0,
        totalItems: 5,
        duration: "15 days",
        color: "bg-zinc-600"
    },
    {
        id: "3",
        name: "Workspace Setup",
        type: "Area",
        startDate: "Dec 05, 2025",
        endDate: "Dec 19, 2025",
        status: "in-progress",
        completedItems: 0,
        inProgressItems: 0,
        totalItems: 2,
        duration: "15 days",
        color: "bg-orange-600"
    }
];

const statusStyles = {
    planned: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    backlog: "text-neutral-40 bg-neutral-40/10 border-neutral-40/20",
    "in-progress": "text-orange-400 bg-orange-400/10 border-orange-400/20"
};

const statusLabels = {
    planned: "Planejado",
    backlog: "Backlog",
    "in-progress": "Em Andamento"
};

const SegmentedProgress = ({ completed, inProgress, total }: { completed: number, inProgress: number, total: number }) => {
    const completedPercent = (completed / total) * 100;
    const inProgressPercent = (inProgress / total) * 100;
    const todoPercent = 100 - completedPercent - inProgressPercent;

    return (
        <div className="h-[8px] flex rounded-full overflow-hidden bg-zinc-800 w-full mt-3 border border-white/5">
            {completedPercent > 0 && (
                <div style={{ width: `${completedPercent}%` }} className="h-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
            )}
            {inProgressPercent > 0 && (
                <div style={{ width: `${inProgressPercent}%` }} className="h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]" />
            )}
            <div style={{ width: `${todoPercent}%` }} className="h-full bg-zinc-700/50" />
        </div>
    );
};

const CircularProgress = ({ progress }: { progress: number }) => {
    const size = 32;
    const strokeWidth = 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-8 h-8">
            <svg className="w-full h-full -rotate-90">
                <circle
                    className="text-zinc-800"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={cn(progress > 0 ? "text-success" : "text-zinc-800")}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <span className="absolute text-[9px] font-bold text-neutral-30">
                {progress}%
            </span>
        </div>
    );
};

export default function ModulesClient() {
    const _params = useParams();
    const [viewMode, setViewMode] = useState<"list" | "grid" | "gantt">("gantt");

    // Timeline Days Data (Simplified)
    const days = Array.from({ length: 20 }, (_, i) => i + 28); // Nov 28 to Dec 17
    const ganttItems = [
        { id: "1", start: 3, length: 14, color: "bg-blue-600/80 hover:bg-blue-600", label: "Core Workflow (System)" },
        { id: "2", start: 6, length: 14, color: "bg-zinc-600/80 hover:bg-zinc-600", label: "Onboarding Flow (Feature)" },
        { id: "3", start: 9, length: 14, color: "bg-orange-600/80 hover:bg-orange-600", label: "Workspace Setup (Area)" },
    ];

    return (
        <div className="h-full flex flex-col bg-[#030303]">
            {/* Header / Breadcrumbs */}
            <div className="flex items-center justify-between p-2 border-b border-primary-30 bg-primary-10">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-2 py-1 hover:bg-primary-20 rounded cursor-pointer">
                        <span className="text-sm">⚡</span>
                        <span className="text-sm font-medium text-neutral-30">lucaspainroom</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-40" />
                    <div className="flex items-center gap-2 px-2 py-1">
                        <Layers className="h-4 w-4 text-neutral-40" />
                        <span className="text-sm font-medium text-neutral">Modules</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-2">
                    <button className="p-1.5 hover:bg-primary-20 rounded text-neutral-40 transition-colors">
                        <Search className="h-4 w-4" />
                    </button>

                    <Button variant="ghost" size="sm" className="text-neutral-30 hover:bg-primary-20 gap-2 h-8 px-3">
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        <span className="text-[13px] font-medium">Nome</span>
                    </Button>

                    <Button variant="ghost" size="sm" className="text-neutral-30 hover:bg-primary-20 gap-2 h-8 px-3">
                        <Filter className="h-3.5 w-3.5" />
                        <span className="text-[13px] font-medium">Filters</span>
                    </Button>

                    <div className="flex bg-primary-20/50 p-0.5 rounded-md border border-primary-30 ml-2">
                        <button
                            onClick={() => setViewMode("list")}
                            className={cn(
                                "p-1.5 rounded transition-all",
                                viewMode === "list" ? "bg-primary-10 text-neutral shadow-sm" : "text-neutral-40 hover:text-neutral"
                            )}
                        >
                            <List className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "p-1.5 rounded transition-all",
                                viewMode === "grid" ? "bg-primary-10 text-neutral shadow-sm" : "text-neutral-40 hover:text-neutral"
                            )}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => setViewMode("gantt")}
                            className={cn(
                                "p-1.5 rounded transition-all",
                                viewMode === "gantt" ? "bg-primary-10 text-neutral shadow-sm" : "text-neutral-40 hover:text-neutral"
                            )}
                        >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <Button size="sm" className="bg-[#0070E0] hover:bg-[#0070E0]/90 text-white gap-2 h-8 px-3 rounded text-[13px] font-semibold ml-2">
                        Adicionar Módulo
                    </Button>
                </div>
            </div>

            {/* Timeline Controls (Sub-header) */}
            {viewMode === "gantt" && (
                <div className="flex items-center justify-end px-4 py-2 border-b border-primary-30/50 bg-[#070707] gap-4">
                    <span className="text-xs text-neutral-40 font-medium mr-auto pl-2">{mockModules.length} Modules</span>
                    <div className="flex bg-zinc-900 border border-white/5 rounded-md p-0.5">
                        <button className="px-3 py-1 text-[11px] font-bold bg-[#1C1C1C] text-neutral rounded shadow-sm">Semana</button>
                        <button className="px-3 py-1 text-[11px] font-bold text-neutral-40 hover:text-neutral">Mês</button>
                        <button className="px-3 py-1 text-[11px] font-bold text-neutral-40 hover:text-neutral">Trimestre</button>
                    </div>
                    <button className="text-[11px] font-bold text-neutral-40 hover:text-neutral">Hoje</button>
                    <button className="text-neutral-40 hover:text-neutral">
                        <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {viewMode === "list" ? (
                    /* List Content (Unchanged) */
                    <div className="overflow-auto p-4 flex flex-col h-full">
                        {mockModules.map((module) => (
                            <div
                                key={module.id}
                                className="flex items-center justify-between px-6 py-4 border-b border-primary-30/50 hover:bg-primary-20/10 transition-colors group cursor-pointer"
                            >
                                <div className="flex items-center gap-6 min-w-0">
                                    <CircularProgress progress={Math.round((module.completedItems / module.totalItems) * 100)} />
                                    <div className="flex items-baseline gap-2 min-w-0">
                                        <span className="text-[14px] font-semibold text-neutral truncate">
                                            {module.name}
                                        </span>
                                        <span className="text-[14px] font-medium text-neutral-40 whitespace-nowrap">
                                            ({module.type})
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-[12px] text-neutral-40 font-medium whitespace-nowrap">
                                        {module.startDate} - {module.endDate}
                                    </div>

                                    <div className={cn(
                                        "px-3 py-1 rounded border text-[11px] font-extrabold uppercase tracking-widest min-w-[100px] text-center",
                                        statusStyles[module.status]
                                    )}>
                                        {statusLabels[module.status]}
                                    </div>

                                    <div className="flex items-center gap-2 pl-4 border-l border-primary-30/50">
                                        <button className="p-1.5 hover:bg-primary-20 rounded text-neutral-40 transition-colors">
                                            <User className="h-4 w-4" />
                                        </button>
                                        <button className="p-1.5 hover:bg-primary-20 rounded text-neutral-40 transition-colors">
                                            <Star className="h-4 w-4" />
                                        </button>
                                        <button className="p-1.5 hover:bg-primary-20 rounded text-neutral-40 transition-colors">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : viewMode === "grid" ? (
                    /* Grid Content (Unchanged) */
                    <div className="overflow-auto p-6 h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockModules.map((module) => (
                                <div key={module.id} className="bg-[#0A0A0A] border border-primary-30/50 rounded-xl overflow-hidden hover:border-primary-30 transition-all group flex flex-col h-fit">
                                    <div className="p-5 flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-baseline gap-1.5 min-w-0">
                                                <h3 className="text-[15px] font-bold text-neutral truncate">{module.name}</h3>
                                                <span className="text-[13px] font-medium text-neutral-40 whitespace-nowrap">({module.type})</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <div className={cn(
                                                    "px-2.5 py-1 rounded text-[10px] font-bold border",
                                                    statusStyles[module.status]
                                                )}>
                                                    {statusLabels[module.status]}
                                                </div>
                                                <button className="text-neutral-40 hover:text-neutral">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5 text-[12px] text-neutral-30 font-bold">
                                                <Layers className="h-3.5 w-3.5 rotate-90 opacity-50" />
                                                <span>{module.completedItems}/{module.totalItems} Work items</span>
                                            </div>
                                            <button className="w-7 h-7 rounded-sm border border-primary-30 flex items-center justify-center bg-primary-20/50 text-neutral-40 hover:text-neutral">
                                                <User className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <SegmentedProgress
                                            completed={module.completedItems}
                                            inProgress={module.inProgressItems}
                                            total={module.totalItems}
                                        />
                                    </div>

                                    <div className="p-4 bg-[#0F0F0F] border-t border-primary-30/30 flex items-center justify-between">
                                        <div className="px-3 py-1.5 rounded-md bg-zinc-900 border border-white/5 text-[11px] font-bold text-neutral-40">
                                            {module.startDate} <span className="mx-1 text-neutral-40/50">→</span> {module.endDate}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button className="text-neutral-40 hover:text-yellow-500 transition-colors">
                                                <Star className="h-4 w-4" />
                                            </button>
                                            <button className="text-neutral-40 hover:text-neutral">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Timeline View */
                    <div className="flex h-full border-t border-primary-30/50">
                        {/* Sidebar */}
                        <div className="w-[300px] border-r border-primary-30 flex flex-col bg-[#030303]">
                            <div className="h-10 border-b border-primary-30/50 flex items-center px-4 text-[11px] font-bold text-neutral-40 uppercase tracking-widest bg-zinc-900/10">
                                <span className="flex-1">Modules</span>
                                <span className="w-20 text-right pr-4">Duração</span>
                            </div>
                            <div className="flex-1 overflow-auto">
                                {mockModules.map((module) => (
                                    <div key={module.id} className="h-14 border-b border-primary-30/30 flex items-center px-4 hover:bg-white/5 transition-colors group cursor-pointer">
                                        <div className="flex-1 flex items-center gap-3 min-w-0">
                                            <div className={cn("w-4 h-4 rounded-full border border-white/10 shrink-0",
                                                module.id === "1" ? "border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" :
                                                    module.id === "3" ? "border-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" : ""
                                            )} />
                                            <span className="text-[13px] font-medium text-neutral truncate">
                                                {module.name} <span className="text-neutral-40 ml-1">({module.type})</span>
                                            </span>
                                        </div>
                                        <span className="w-20 text-[13px] font-medium text-neutral-40 text-right pr-4 uppercase">
                                            {module.duration}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gantt Area */}
                        <div className="flex-1 overflow-auto relative">
                            {/* Sticky Header */}
                            <div className="sticky top-0 z-10 bg-[#030303]">
                                {/* Months/Major Header */}
                                <div className="h-10 border-b border-primary-30/50 flex border-r border-primary-30/50">
                                    <div className="w-[80px] border-r border-white/5 flex items-center justify-center text-[11px] font-bold text-neutral-40 bg-zinc-900/20">
                                        Nov 2025 - Dec 2025
                                    </div>
                                    <div className="flex-1 relative">
                                        <div className="absolute right-[320px] top-1/2 -translate-y-1/2 text-[11px] font-bold text-neutral-40 uppercase tracking-widest px-4 border-l border-white/5">
                                            Week 49
                                        </div>
                                        <div className="absolute right-[240px] top-1/2 -translate-y-1/2 text-[11px] font-bold text-neutral-40 uppercase tracking-widest px-4 border-l border-white/5">
                                            Dec 2025
                                        </div>
                                        <div className="absolute right-[80px] top-1/2 -translate-y-1/2 text-[11px] font-bold text-neutral-40 uppercase tracking-widest px-4 border-l border-white/5">
                                            Week 50
                                        </div>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] font-bold text-neutral-40 uppercase tracking-widest px-4 border-l border-white/5">
                                            Dec 2025
                                        </div>
                                    </div>
                                </div>
                                {/* Days Header */}
                                <div className="h-6 flex border-b border-primary-30/50">
                                    {days.map((day, i) => (
                                        <div key={i} className="w-10 border-r border-white/5 flex flex-col items-center justify-center text-[9px] font-bold text-neutral-40 uppercase bg-zinc-900/5">
                                            <span>{day > 30 ? day - 30 : day}</span>
                                            <span className="text-[7px] opacity-60">
                                                {["Su", "M", "T", "W", "Th", "F", "Sa"][(i + 5) % 7]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Grid Content */}
                            <div className="relative min-h-full">
                                {/* Vertical Grid Lines */}
                                <div className="absolute inset-0 flex">
                                    {days.map((_, i) => (
                                        <div key={i} className="w-10 border-r border-white/[0.02] h-full" />
                                    ))}
                                </div>

                                {/* Bars */}
                                <div className="relative pt-0 z-10">
                                    {ganttItems.map((item, i) => (
                                        <div key={item.id} className="h-14 flex items-center pl-[40px]">
                                            <div
                                                className={cn(
                                                    "h-7 rounded-sm flex items-center px-4 text-[11px] font-bold text-white shadow-lg transition-all border border-white/5",
                                                    item.color
                                                )}
                                                style={{
                                                    marginLeft: `${(item.start - 1) * 40}px`,
                                                    width: `${item.length * 40}px`
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Floating Menu Feel */}
            <div className="p-4 flex justify-end">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md opacity-50 shadow-2xl">
                    <Layers className="h-4 w-4 text-white" />
                </div>
            </div>
        </div>
    );
}
