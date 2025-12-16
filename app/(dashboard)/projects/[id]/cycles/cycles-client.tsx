"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCycles } from "@/lib/hooks";
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
    Loader2,
} from "lucide-react";

const statusConfig = {
    active: { label: "Ativo", color: "bg-success", textColor: "text-success" },
    upcoming: { label: "Próximo", color: "bg-blue-500", textColor: "text-blue-400" },
    completed: { label: "Concluído", color: "bg-neutral-40", textColor: "text-neutral-40" },
};

export default function CyclesClient() {
    const params = useParams();
    const projectId = params.id as string;

    const { cycles, isLoading, createCycle, updateCycle, deleteCycle } = useCycles(projectId);

    const [modalOpen, setModalOpen] = useState(false);
    const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "completed">("all");
    const [newCycle, setNewCycle] = useState({ name: "", description: "", startDate: "", endDate: "" });
    const [isCreating, setIsCreating] = useState(false);

    const filteredCycles = cycles.filter(cycle =>
        filter === "all" || cycle.status === filter
    );

    const activeCycle = cycles.find(c => c.status === "active");

    const handleCreate = async () => {
        if (!newCycle.name || !newCycle.startDate || !newCycle.endDate) return;

        setIsCreating(true);
        try {
            await createCycle({
                name: newCycle.name,
                description: newCycle.description || null,
                start_date: newCycle.startDate,
                end_date: newCycle.endDate,
                status: "upcoming",
            });
            setNewCycle({ name: "", description: "", startDate: "", endDate: "" });
            setModalOpen(false);
        } catch (error) {
            console.error("Failed to create cycle:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCycle(id);
        } catch (error) {
            console.error("Failed to delete cycle:", error);
        }
    };

    const handleStartCycle = async (id: string) => {
        try {
            // Complete any active cycle first
            if (activeCycle) {
                await updateCycle(activeCycle.id, { status: "completed" });
            }
            await updateCycle(id, { status: "active" });
        } catch (error) {
            console.error("Failed to start cycle:", error);
        }
    };

    const handleCompleteCycle = async (id: string) => {
        try {
            await updateCycle(id, { status: "completed" });
        } catch (error) {
            console.error("Failed to complete cycle:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-40" />
            </div>
        );
    }

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
                                {new Date(activeCycle.start_date).toLocaleDateString("pt-BR")} - {new Date(activeCycle.end_date).toLocaleDateString("pt-BR")}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-success" />
                                <span className="text-2xl font-bold text-neutral">
                                    {activeCycle.total_items ? Math.round(((activeCycle.completed_items || 0) / activeCycle.total_items) * 100) : 0}%
                                </span>
                            </div>
                            <p className="text-sm text-neutral-40">
                                {activeCycle.completed_items || 0}/{activeCycle.total_items || 0} itens
                            </p>
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 h-2 bg-primary-30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-success transition-all"
                            style={{ width: `${activeCycle.total_items ? ((activeCycle.completed_items || 0) / activeCycle.total_items) * 100 : 0}%` }}
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
                                    {new Date(cycle.start_date).toLocaleDateString("pt-BR")}
                                    <ArrowRight className="h-3 w-3" />
                                    {new Date(cycle.end_date).toLocaleDateString("pt-BR")}
                                </div>
                                <div className="w-24">
                                    <div className="flex items-center justify-between text-xs text-neutral-40 mb-1">
                                        <span>{cycle.completed_items || 0}/{cycle.total_items || 0}</span>
                                        <span>{cycle.total_items ? Math.round(((cycle.completed_items || 0) / cycle.total_items) * 100) : 0}%</span>
                                    </div>
                                    <div className="h-1.5 bg-primary-30 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full transition-all", statusConfig[cycle.status].color)}
                                            style={{ width: `${cycle.total_items ? ((cycle.completed_items || 0) / cycle.total_items) * 100 : 0}%` }}
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
                                            <DropdownMenuItem onClick={() => handleStartCycle(cycle.id)}>
                                                <Play className="h-4 w-4 mr-2" />
                                                Iniciar Cycle
                                            </DropdownMenuItem>
                                        )}
                                        {cycle.status === "active" && (
                                            <DropdownMenuItem onClick={() => handleCompleteCycle(cycle.id)}>
                                                <Square className="h-4 w-4 mr-2" />
                                                Finalizar Cycle
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem className="text-danger" onClick={() => handleDelete(cycle.id)}>
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
                        <Button onClick={handleCreate} disabled={!newCycle.name || !newCycle.startDate || !newCycle.endDate || isCreating}>
                            {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Criar Cycle
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
