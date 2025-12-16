"use client";

import { cn } from "@/lib/utils";
import { BarChart3, TrendingUp, Users, ListTodo, PieChart } from "lucide-react";

interface StatCard {
    label: string;
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon: React.ComponentType<{ className?: string }>;
}

const stats: StatCard[] = [
    { label: "Total de Itens", value: 156, change: "+12 esta semana", changeType: "positive", icon: ListTodo },
    { label: "Em Progresso", value: 24, change: "-3 desde ontem", changeType: "negative", icon: TrendingUp },
    { label: "Concluídos", value: 89, change: "+28 este mês", changeType: "positive", icon: BarChart3 },
    { label: "Membros Ativos", value: 8, change: "Sem alteração", changeType: "neutral", icon: Users },
];

const priorityData = [
    { label: "Urgente", value: 5, color: "#ef4444" },
    { label: "Alta", value: 18, color: "#f97316" },
    { label: "Média", value: 45, color: "#eab308" },
    { label: "Baixa", value: 32, color: "#22c55e" },
    { label: "Nenhuma", value: 56, color: "#6b7280" },
];

const stateData = [
    { label: "Backlog", value: 42, color: "#6b7280" },
    { label: "A Fazer", value: 28, color: "#3b82f6" },
    { label: "Em Progresso", value: 24, color: "#eab308" },
    { label: "Revisão", value: 8, color: "#8b5cf6" },
    { label: "Concluído", value: 54, color: "#22c55e" },
];

export default function AnalyticsPage() {
    const totalPriority = priorityData.reduce((acc, d) => acc + d.value, 0);
    const totalState = stateData.reduce((acc, d) => acc + d.value, 0);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-xl font-semibold text-neutral mb-6">Analytics</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-4 rounded-lg bg-primary-20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-neutral-40">{stat.label}</span>
                            <stat.icon className="h-5 w-5 text-neutral-40" />
                        </div>
                        <div className="text-2xl font-bold text-neutral">{stat.value}</div>
                        {stat.change && (
                            <div className={cn(
                                "text-xs mt-1",
                                stat.changeType === "positive" && "text-success",
                                stat.changeType === "negative" && "text-danger",
                                stat.changeType === "neutral" && "text-neutral-40"
                            )}>
                                {stat.change}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Priority Distribution */}
                <div className="p-6 rounded-lg bg-primary-20">
                    <h2 className="text-sm font-medium text-neutral mb-4 flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        Por Prioridade
                    </h2>
                    <div className="space-y-3">
                        {priorityData.map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-neutral-30">{item.label}</span>
                                    <span className="text-neutral">{item.value} ({Math.round((item.value / totalPriority) * 100)}%)</span>
                                </div>
                                <div className="h-2 bg-primary-30 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${(item.value / totalPriority) * 100}%`,
                                            backgroundColor: item.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* State Distribution */}
                <div className="p-6 rounded-lg bg-primary-20">
                    <h2 className="text-sm font-medium text-neutral mb-4 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Por Estado
                    </h2>
                    <div className="space-y-3">
                        {stateData.map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-neutral-30">{item.label}</span>
                                    <span className="text-neutral">{item.value} ({Math.round((item.value / totalState) * 100)}%)</span>
                                </div>
                                <div className="h-2 bg-primary-30 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${(item.value / totalState) * 100}%`,
                                            backgroundColor: item.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Weekly Activity */}
            <div className="mt-6 p-6 rounded-lg bg-primary-20">
                <h2 className="text-sm font-medium text-neutral mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Atividade Semanal
                </h2>
                <div className="flex items-end gap-2 h-32">
                    {[45, 32, 58, 72, 65, 48, 82].map((value, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                                className="w-full bg-brand/60 rounded-t transition-all hover:bg-brand"
                                style={{ height: `${(value / 100) * 100}%` }}
                            />
                            <span className="text-xs text-neutral-40">
                                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
