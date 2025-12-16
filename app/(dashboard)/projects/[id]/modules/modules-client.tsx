"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    LayoutGrid,
    List,
    MoreHorizontal,
    Pencil,
    Trash2,
    Users,
    Calendar,
    Layers,
} from "lucide-react";

interface Module {
    id: string;
    name: string;
    description?: string;
    status: "backlog" | "planned" | "in_progress" | "paused" | "completed" | "cancelled";
    lead?: { id: string; name: string; avatar_url?: string };
    startDate?: string;
    endDate?: string;
    totalItems: number;
    completedItems: number;
}

const statusConfig = {
    backlog: { label: "Backlog", color: "bg-neutral-40", textColor: "text-neutral-40" },
    planned: { label: "Planejado", color: "bg-blue-500", textColor: "text-blue-400" },
    in_progress: { label: "Em Progresso", color: "bg-yellow-500", textColor: "text-yellow-400" },
    paused: { label: "Pausado", color: "bg-orange-500", textColor: "text-orange-400" },
    completed: { label: "Concluído", color: "bg-success", textColor: "text-success" },
    cancelled: { label: "Cancelado", color: "bg-danger", textColor: "text-danger" },
};

const demoModules: Module[] = [
    {
        id: "1",
        name: "Autenticação",
        description: "Login, signup e OAuth",
        status: "completed",
        lead: { id: "1", name: "Lucas" },
        totalItems: 8,
        completedItems: 8,
    },
    {
        id: "2",
        name: "Work Items",
        description: "Kanban, lista e todos os layouts",
        status: "in_progress",
        lead: { id: "2", name: "Maria" },
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        totalItems: 15,
        completedItems: 10,
    },
    {
        id: "3",
        name: "Analytics",
        description: "Dashboards e gráficos",
        status: "planned",
        totalItems: 6,
        completedItems: 0,
    },
    {
        id: "4",
        name: "Integrações",
        description: "GitHub, Slack, etc",
        status: "backlog",
        totalItems: 0,
        completedItems: 0,
    },
];

export default function ModulesClient() {
    const [modules, setModules] = useState<Module[]>(demoModules);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [newModule, setNewModule] = useState({ name: "", description: "", status: "backlog" as Module["status"] });

    const handleCreate = () => {
        if (!newModule.name) return;
        const module: Module = {
            id: Date.now().toString(),
            name: newModule.name,
            description: newModule.description,
            status: newModule.status,
            totalItems: 0,
            completedItems: 0,
        };
        setModules([...modules, module]);
        setNewModule({ name: "", description: "", status: "backlog" });
        setModalOpen(false);
    };

    const deleteModule = (id: string) => {
        setModules(modules.filter(m => m.id !== id));
    };

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-semibold text-neutral">Modules</h1>
                    <div className="flex bg-primary-20 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                viewMode === "grid" ? "bg-primary-10 text-neutral" : "text-neutral-30"
                            )}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                viewMode === "list" ? "bg-primary-10 text-neutral" : "text-neutral-30"
                            )}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Module
                </Button>
            </div>

            {/* Modules Grid */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            className="p-4 rounded-lg bg-primary-20 hover:bg-primary-30 transition-colors group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <Badge className={cn("mb-2", statusConfig[module.status].color)}>
                                        {statusConfig[module.status].label}
                                    </Badge>
                                    <h3 className="text-sm font-medium text-neutral">{module.name}</h3>
                                    {module.description && (
                                        <p className="text-xs text-neutral-40 mt-1">{module.description}</p>
                                    )}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                                        <DropdownMenuItem className="text-danger" onClick={() => deleteModule(module.id)}>
                                            <Trash2 className="h-4 w-4 mr-2" />Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Progress */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between text-xs text-neutral-40 mb-1">
                                    <span>{module.completedItems}/{module.totalItems} itens</span>
                                    <span>{module.totalItems > 0 ? Math.round((module.completedItems / module.totalItems) * 100) : 0}%</span>
                                </div>
                                <div className="h-1.5 bg-primary-30 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full transition-all", statusConfig[module.status].color)}
                                        style={{ width: `${module.totalItems > 0 ? (module.completedItems / module.totalItems) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-xs text-neutral-40">
                                {module.lead && (
                                    <div className="flex items-center gap-1">
                                        <Avatar className="h-4 w-4">
                                            <AvatarImage src={module.lead.avatar_url} />
                                            <AvatarFallback className="text-[8px]">{module.lead.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <span>{module.lead.name}</span>
                                    </div>
                                )}
                                {module.startDate && module.endDate && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>{new Date(module.startDate).toLocaleDateString("pt-BR", { month: "short", day: "numeric" })} - {new Date(module.endDate).toLocaleDateString("pt-BR", { month: "short", day: "numeric" })}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-primary-20 hover:bg-primary-30 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <Layers className="h-5 w-5 text-neutral-40" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-medium text-neutral">{module.name}</h3>
                                        <Badge className={cn("text-[10px]", statusConfig[module.status].color)}>
                                            {statusConfig[module.status].label}
                                        </Badge>
                                    </div>
                                    {module.description && (
                                        <p className="text-xs text-neutral-40">{module.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-32">
                                    <div className="h-1.5 bg-primary-30 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full transition-all", statusConfig[module.status].color)}
                                            style={{ width: `${module.totalItems > 0 ? (module.completedItems / module.totalItems) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm text-neutral-40 w-16 text-right">
                                    {module.totalItems > 0 ? Math.round((module.completedItems / module.totalItems) * 100) : 0}%
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                                        <DropdownMenuItem className="text-danger" onClick={() => deleteModule(module.id)}>
                                            <Trash2 className="h-4 w-4 mr-2" />Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modules.length === 0 && (
                <div className="text-center py-12 text-neutral-40">
                    <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum module criado</p>
                </div>
            )}

            {/* Create Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo Module</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-30 mb-1">Nome</label>
                            <Input
                                value={newModule.name}
                                onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                                placeholder="Autenticação"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-30 mb-1">Descrição</label>
                            <Input
                                value={newModule.description}
                                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                                placeholder="Opcional"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-30 mb-1">Status</label>
                            <select
                                value={newModule.status}
                                onChange={(e) => setNewModule({ ...newModule, status: e.target.value as Module["status"] })}
                                className="w-full px-3 py-2 rounded-md bg-primary-20 border border-primary-30 text-neutral text-sm"
                            >
                                {Object.entries(statusConfig).map(([key, { label }]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCreate} disabled={!newModule.name}>
                            Criar Module
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
