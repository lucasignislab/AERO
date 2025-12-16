"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Plus,
    Calendar,
    MoreHorizontal,
    Pencil,
    Trash2,
    Play,
    Square,
    ArrowRight,
    TrendingUp,
} from "lucide-react";

interface Cycle {
    id: string;
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    status: "active" | "upcoming" | "completed";
    totalItems: number;
    completedItems: number;
}

// Demo data
const demoCycles: Cycle[] = [
    {
        id: "1",
        name: "Sprint 1",
        description: "Setup inicial e autenticação",
        startDate: "2024-12-09",
        endDate: "2024-12-20",
        status: "active",
        totalItems: 12,
        completedItems: 5,
    },
    {
        id: "2",
        name: "Sprint 2",
        description: "Work Items e Layouts",
        startDate: "2024-12-23",
        endDate: "2025-01-03",
        status: "upcoming",
        totalItems: 8,
        completedItems: 0,
    },
    {
        id: "3",
        name: "Sprint 0",
        description: "Planejamento",
        startDate: "2024-12-01",
        endDate: "2024-12-08",
        status: "completed",
        totalItems: 5,
        completedItems: 5,
    },
];

const statusConfig = {
    active: { label: "Ativo", color: "bg-success", textColor: "text-success" },
    upcoming: { label: "Próximo", color: "bg-blue-500", textColor: "text-blue-400" },
    completed: { label: "Concluído", color: "bg-neutral-40", textColor: "text-neutral-40" },
};

export default function CyclesClient() {
    const [cycles, setCycles] = useState<Cycle[]>(demoCycles);
    const [modalOpen, setModalOpen] = useState(false);
    const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "completed">("all");
    const [newCycle, setNewCycle] = useState({ name: "", description: "", startDate: "", endDate: "" });

    const filteredCycles = cycles.filter(cycle =>
        filter === "all" || cycle.status === filter
    );

    const activeCycle = cycles.find(c => c.status === "active");

    const handleCreate = () => {
        if (!newCycle.name || !newCycle.startDate || !newCycle.endDate) return;
        const cycle: Cycle = {
            id: Date.now().toString(),
            name: newCycle.name,
            description: newCycle.description,
            startDate: newCycle.startDate,
            endDate: newCycle.endDate,
            status: "upcoming",
            totalItems: 0,
            completedItems: 0,
        };
        setCycles([...cycles, cycle]);
        setNewCycle({ name: "", description: "", startDate: "", endDate: "" });
        setModalOpen(false);
    };

    const deleteCycle = (id: string) => {
        setCycles(cycles.filter(c => c.id !== id));
    };

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-neutral">Cycles</h1>
                    <div className="flex bg-primary-20 rounded-lg p-1 ml-4">
                        {(["all", "active", "upcoming", "completed"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm transition-colors",
                                    filter === status
                                        ? "bg-primary-10 text-neutral"
                                        : "text-neutral-30 hover:text-neutral"
                                )}
                            >
                                {status === "all" ? "Todos" : statusConfig[status].label}
                            </button>
                        ))}
                    </div>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Cycle
                </Button>
            </div>

            {/* Active Cycle Highlight */}
            {activeCycle && filter === "all" && (
                <div className="mb-6 p-4 rounded-lg bg-success/10 border border-success/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-success text-white">Ativo</Badge>
                                <h2 className="text-lg font-medium text-neutral">{activeCycle.name}</h2>
                            </div>
                            <p className="text-sm text-neutral-40 mt-1">
                                {new Date(activeCycle.startDate).toLocaleDateString("pt-BR")} - {new Date(activeCycle.endDate).toLocaleDateString("pt-BR")}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-success" />
                                <span className="text-2xl font-bold text-neutral">
                                    {Math.round((activeCycle.completedItems / activeCycle.totalItems) * 100)}%
                                </span>
                            </div>
                            <p className="text-sm text-neutral-40">
                                {activeCycle.completedItems}/{activeCycle.totalItems} itens
                            </p>
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 h-2 bg-primary-30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-success transition-all"
                            style={{ width: `${(activeCycle.completedItems / activeCycle.totalItems) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Cycles List */}
            <div className="space-y-2">
                {filteredCycles.map((cycle) => (
                    <div
                        key={cycle.id}
                        className="p-4 rounded-lg bg-primary-20 hover:bg-primary-30 transition-colors group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-2 h-2 rounded-full", statusConfig[cycle.status].color)} />
                                <div>
                                    <h3 className="text-sm font-medium text-neutral">{cycle.name}</h3>
                                    {cycle.description && (
                                        <p className="text-xs text-neutral-40">{cycle.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-xs text-neutral-40">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(cycle.startDate).toLocaleDateString("pt-BR")}
                                    <ArrowRight className="h-3 w-3" />
                                    {new Date(cycle.endDate).toLocaleDateString("pt-BR")}
                                </div>
                                <div className="w-24">
                                    <div className="flex items-center justify-between text-xs text-neutral-40 mb-1">
                                        <span>{cycle.completedItems}/{cycle.totalItems}</span>
                                        <span>{cycle.totalItems > 0 ? Math.round((cycle.completedItems / cycle.totalItems) * 100) : 0}%</span>
                                    </div>
                                    <div className="h-1.5 bg-primary-30 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full transition-all", statusConfig[cycle.status].color)}
                                            style={{ width: `${cycle.totalItems > 0 ? (cycle.completedItems / cycle.totalItems) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Editar
                                        </DropdownMenuItem>
                                        {cycle.status === "upcoming" && (
                                            <DropdownMenuItem>
                                                <Play className="h-4 w-4 mr-2" />
                                                Iniciar Cycle
                                            </DropdownMenuItem>
                                        )}
                                        {cycle.status === "active" && (
                                            <DropdownMenuItem>
                                                <Square className="h-4 w-4 mr-2" />
                                                Finalizar Cycle
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem className="text-danger" onClick={() => deleteCycle(cycle.id)}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredCycles.length === 0 && (
                    <div className="text-center py-12 text-neutral-40">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum cycle encontrado</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo Cycle</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-30 mb-1">Nome</label>
                            <Input
                                value={newCycle.name}
                                onChange={(e) => setNewCycle({ ...newCycle, name: e.target.value })}
                                placeholder="Sprint 3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-30 mb-1">Descrição</label>
                            <Input
                                value={newCycle.description}
                                onChange={(e) => setNewCycle({ ...newCycle, description: e.target.value })}
                                placeholder="Opcional"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-30 mb-1">Data Início</label>
                                <Input
                                    type="date"
                                    value={newCycle.startDate}
                                    onChange={(e) => setNewCycle({ ...newCycle, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-30 mb-1">Data Fim</label>
                                <Input
                                    type="date"
                                    value={newCycle.endDate}
                                    onChange={(e) => setNewCycle({ ...newCycle, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCreate} disabled={!newCycle.name || !newCycle.startDate || !newCycle.endDate}>
                            Criar Cycle
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
