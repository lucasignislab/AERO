"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
    ChevronDown,
    ChevronRight,
    Search,
    Filter,
    MoreHorizontal,
    Star,
    Eye,
    ChevronUp,
    CircleDashed,
    Target,
    CheckCircle2,
    Tag,
    Briefcase,
    Calendar
} from "lucide-react";

// Simple Burndown Chart Component using SVG
const BurndownChart = () => (
    <div className="relative h-[200px] w-full mt-4">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-neutral-40 pr-2">
            <span>9</span>
            <span>7</span>
            <span>6</span>
            <span>5</span>
            <span>4</span>
            <span>3</span>
            <span>2</span>
            <span>1</span>
            <span>0</span>
        </div>
        <div className="absolute left-6 inset-y-0 right-0 border-l border-b border-primary-30/50">
            {/* Grid Lines */}
            {[...Array(9)].map((_, i) => (
                <div key={i} className="border-t border-primary-30/20 w-full h-[12.5%]" />
            ))}

            {/* Ideal Line (Dashed) */}
            <svg className="absolute inset-0 h-full w-full">
                <line x1="0" y1="90%" x2="100%" y2="100%" stroke="#4B5563" strokeWidth="1" strokeDasharray="4 2" />
                {/* Current Line */}
                <path
                    d="M 0 90 L 30 90 L 40 100 L 100 100"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2"
                />
                <path
                    d="M 0 90 L 30 90 L 40 100 L 100 100 V 100 H 0 Z"
                    fill="url(#gradient)"
                    className="opacity-20"
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
                {/* Points */}
                <circle cx="0" cy="90%" r="3" fill="#2563EB" />
                <circle cx="100%" cy="100%" r="3" fill="#2563EB" />
            </svg>
        </div>
        <div className="absolute left-6 right-0 -bottom-6 flex justify-between text-[10px] text-neutral-40 px-2 font-medium">
            <span>Dec 20</span>
            <span>Dec 25</span>
            <span>Dec 30</span>
            <span>Jan 04</span>
            <span>Jan 09</span>
        </div>
        <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-4">
            <div className="flex items-center gap-1.5 ">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-[10px] text-neutral-30">Current work items</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full border border-dashed border-neutral-40" />
                <span className="text-[10px] text-neutral-30">Ideal work items</span>
            </div>
        </div>
        <div className="absolute top-0 right-0 text-[10px] text-neutral-40 font-medium">
            Pending work items - 1
        </div>
        <div className="absolute left-[-15px] top-[140px] -rotate-90 text-[10px] text-neutral-40 font-bold tracking-widest">
            COMPLETION
        </div>
        <div className="absolute bottom-[-45px] left-1/2 -translate-x-1/2 text-[10px] text-neutral-40 font-bold tracking-widest">
            DATE
        </div>
    </div>
);

export default function CyclesClient() {
    const _params = useParams();

    const [activeSection, setActiveSection] = useState<string>("active");
    const [subTab, setSubTab] = useState<string>("Responsáveis");

    const sections = [
        { id: "active", label: "Ciclo ativo", color: "text-warning", icon: Target },
        { id: "upcoming", label: "Próximo ciclo", color: "text-blue-500", icon: CircleDashed, count: 0 },
        { id: "completed", label: "Ciclo concluído", color: "text-success", icon: CheckCircle2, count: 0 },
    ];

    return (
        <div className="h-full flex flex-col bg-[#030303]">
            {/* Header / Breadcrumbs */}
            <div className="flex items-center justify-between p-2 border-b border-primary-30 bg-primary-10">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-2 py-1 hover:bg-primary-20 rounded cursor-pointer">
                        <span className="text-sm">🚀</span>
                        <span className="text-sm font-medium text-neutral-30">AERO - PROJECT MA...</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-40" />
                    <div className="flex items-center gap-2 px-2 py-1">
                        <Target className="h-4 w-4 text-neutral-40" />
                        <span className="text-sm font-medium text-neutral">Cycles</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-2">
                    <button className="p-1.5 hover:bg-primary-20 rounded text-neutral-40 transition-colors">
                        <Search className="h-4 w-4" />
                    </button>
                    <Button variant="ghost" size="sm" className="text-neutral-30 hover:bg-primary-20 gap-2 h-8 px-3">
                        <Filter className="h-3.5 w-3.5" />
                        <span className="text-[13px] font-medium">Filtros</span>
                    </Button>
                    <Button size="sm" className="bg-[#0070E0] hover:bg-[#0070E0]/90 text-white gap-2 h-8 px-3 rounded text-[13px] font-semibold">
                        Adicionar ciclo
                    </Button>
                </div>
            </div>

            {/* Content Scroller */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {sections.map((section) => (
                    <div key={section.id} className="border border-primary-30/50 rounded-lg overflow-hidden bg-[#0A0A0A]">
                        {/* Section Header */}
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-primary-20/20 transition-colors group"
                            onClick={() => setActiveSection(activeSection === section.id ? "" : section.id)}
                        >
                            <div className="flex items-center gap-3">
                                <section.icon className={cn("h-5 w-5", section.color)} />
                                <span className="text-[15px] font-bold text-neutral">
                                    {section.label}
                                    {section.count !== undefined && <span className="ml-2 font-normal text-neutral-40">{section.count}</span>}
                                </span>
                            </div>
                            {activeSection === section.id ? <ChevronUp className="h-4 w-4 text-neutral-40" /> : <ChevronDown className="h-4 w-4 text-neutral-40" />}
                        </div>

                        {/* Section Body */}
                        {activeSection === section.id && section.id === "active" && (
                            <div className="p-4 pt-0 space-y-4">
                                {/* Active Cycle Header */}
                                <div className="border border-primary-30/50 rounded-md p-4 bg-primary-10/10 flex items-center justify-between transition-all hover:border-primary-30">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full border border-primary-30 flex items-center justify-center text-[10px] font-bold text-neutral-40 bg-zinc-900 shadow-inner">
                                            0%
                                        </div>
                                        <span className="text-[15px] font-semibold text-neutral">Teste</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider">
                                            <Eye className="h-3 w-3" />
                                            Mais detalhes
                                        </button>
                                        <div className="flex items-center gap-2 text-[12px] text-neutral-40 font-medium">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>Dec 16, 2025 - Jan 09, 2026</span>
                                        </div>
                                        <Avatar className="h-6 w-6 border border-primary-30 shadow-sm">
                                            <AvatarImage src="/placeholder-user.jpg" />
                                            <AvatarFallback className="text-[10px] bg-primary-30">LC</AvatarFallback>
                                        </Avatar>
                                        <div className="flex items-center gap-2 border-l border-primary-30 pl-4 ml-2">
                                            <button className="p-1 hover:bg-primary-20 rounded text-neutral-40"><Star className="h-4 w-4" /></button>
                                            <button className="p-1 hover:bg-primary-20 rounded text-neutral-40"><MoreHorizontal className="h-4 w-4" /></button>
                                        </div>
                                    </div>
                                </div>

                                {/* Dashboard Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    {/* Progress Card */}
                                    <div className="border border-primary-30/50 rounded-lg p-6 bg-[#0E0E0E]">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-[13px] font-bold text-neutral-30 uppercase tracking-widest">Progresso</h3>
                                            <span className="text-[12px] text-neutral-40 font-medium tracking-tight">0/1 Work item closed</span>
                                        </div>
                                        <div className="h-[10px] bg-zinc-900 rounded-full mt-4 overflow-hidden border border-primary-30/30">
                                            <div className="h-full bg-orange-500 w-[10%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                                        </div>
                                        <div className="mt-8 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
                                                <span className="text-[13px] font-semibold text-neutral-10">Started</span>
                                            </div>
                                            <span className="text-[13px] font-medium text-neutral-30">1 Work item</span>
                                        </div>
                                    </div>

                                    {/* Burndown Card */}
                                    <div className="border border-primary-30/50 rounded-lg p-6 bg-[#0E0E0E]">
                                        <h3 className="text-[13px] font-bold text-neutral-30 uppercase tracking-widest">Burndown de itens de trabalho</h3>
                                        <BurndownChart />
                                    </div>

                                    {/* Tabs Card */}
                                    <div className="border border-primary-30/50 rounded-lg overflow-hidden bg-[#0E0E0E] flex flex-col">
                                        <div className="flex border-b border-primary-30">
                                            {["Itens de trabalho prioritários", "Responsáveis", "Etiquetas"].map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setSubTab(tab)}
                                                    className={cn(
                                                        "flex-1 px-2 py-3 text-[11px] font-bold border-r border-primary-30 last:border-r-0 transition-colors uppercase tracking-wider",
                                                        subTab === tab ? "bg-primary-20/30 text-neutral" : "text-neutral-40 hover:text-neutral-30 hover:bg-primary-20/10"
                                                    )}
                                                >
                                                    {tab === "Itens de trabalho prioritários" ? "Itens de trabalho prioritários" : tab}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex-1 p-6">
                                            {subTab === "Responsáveis" ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-md transition-all">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-7 w-7 border border-primary-30 bg-zinc-800">
                                                                <AvatarImage src="/placeholder-user.jpg" />
                                                                <AvatarFallback className="text-[10px]">LC</AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-[13px] font-bold text-neutral-20">lucascoelho.cps</span>
                                                        </div>
                                                        <span className="text-[12px] font-bold text-neutral-40 group-hover:text-neutral-20">0% of 1</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
                                                    {subTab === "Etiquetas" ? <Tag className="h-10 w-10 mb-2" /> : <Briefcase className="h-10 w-10 mb-2" />}
                                                    <p className="text-xs font-semibold uppercase tracking-widest">Sem dados no momento</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Minimal Shadow for bottom floating icons feel */}
            <div className="absolute bottom-4 right-4 pointer-events-none">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md opacity-50 shadow-2xl">
                    <MoreHorizontal className="h-4 w-4 text-white" />
                </div>
            </div>
        </div>
    );
}
