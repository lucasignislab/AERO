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
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
    Lock,
    Globe,
    Filter,
    Copy,
} from "lucide-react";

interface View {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    filters: {
        state?: string[];
        priority?: string[];
        assignee?: string[];
        labels?: string[];
    };
    createdBy: { id: string; name: string };
    createdAt: string;
}

const demoViews: View[] = [
    {
        id: "1",
        name: "Todos os itens de trabalho",
        description: "Todos os itens sem filtro",
        isPublic: true,
        filters: {},
        createdBy: { id: "1", name: "Sistema" },
        createdAt: "2024-01-01",
    },
    {
        id: "2",
        name: "Atribuído a mim",
        isPublic: false,
        filters: { assignee: ["me"] },
        createdBy: { id: "1", name: "Lucas" },
        createdAt: "2024-12-10",
    },
    {
        id: "3",
        name: "Urgentes",
        description: "Itens com prioridade urgente ou alta",
        isPublic: true,
        filters: { priority: ["urgent", "high"] },
        createdBy: { id: "2", name: "Maria" },
        createdAt: "2024-12-15",
    },
    {
        id: "4",
        name: "Bugs Abertos",
        isPublic: true,
        filters: { labels: ["bug"], state: ["backlog", "todo", "in_progress"] },
        createdBy: { id: "1", name: "Lucas" },
        createdAt: "2024-12-12",
    },
];

export default function ViewsClient() {
    const [views, setViews] = useState<View[]>(demoViews);
    const [modalOpen, setModalOpen] = useState(false);
    const [newView, setNewView] = useState({ name: "", description: "", isPublic: true });

    const handleCreate = () => {
        if (!newView.name) return;
        const view: View = {
            id: Date.now().toString(),
            name: newView.name,
            description: newView.description,
            isPublic: newView.isPublic,
            filters: {},
            createdBy: { id: "1", name: "Lucas" },
            createdAt: new Date().toISOString().split("T")[0],
        };
        setViews([...views, view]);
        setNewView({ name: "", description: "", isPublic: true });
        setModalOpen(false);
    };

    const deleteView = (id: string) => {
        setViews(views.filter(v => v.id !== id));
    };

    const getFilterCount = (view: View) => {
        let count = 0;
        if (view.filters.state?.length) count += view.filters.state.length;
        if (view.filters.priority?.length) count += view.filters.priority.length;
        if (view.filters.assignee?.length) count += view.filters.assignee.length;
        if (view.filters.labels?.length) count += view.filters.labels.length;
        return count;
    };

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-neutral">Views</h1>
                <Button onClick={() => setModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova View
                </Button>
            </div>

            {/* Views List */}
            <div className="space-y-2">
                {views.map((view) => {
                    const filterCount = getFilterCount(view);
                    return (
                        <div
                            key={view.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-primary-20 hover:bg-primary-30 transition-colors group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <Eye className="h-5 w-5 text-neutral-40" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-medium text-neutral">{view.name}</h3>
                                        {view.isPublic ? (
                                            <Globe className="h-3.5 w-3.5 text-neutral-40" />
                                        ) : (
                                            <Lock className="h-3.5 w-3.5 text-neutral-40" />
                                        )}
                                    </div>
                                    {view.description && (
                                        <p className="text-xs text-neutral-40">{view.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {filterCount > 0 && (
                                    <Badge variant="secondary" className="gap-1">
                                        <Filter className="h-3 w-3" />
                                        {filterCount} filtro{filterCount > 1 ? "s" : ""}
                                    </Badge>
                                )}
                                <span className="text-xs text-neutral-40">
                                    {view.createdBy.name} • {new Date(view.createdAt).toLocaleDateString("pt-BR")}
                                </span>
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
                                        <DropdownMenuItem>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Duplicar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-danger" onClick={() => deleteView(view.id)}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    );
                })}
            </div>

            {views.length === 0 && (
                <div className="text-center py-12 text-neutral-40">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma view criada</p>
                </div>
            )}

            {/* Create Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nova View</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-30 mb-1">Nome</label>
                            <Input
                                value={newView.name}
                                onChange={(e) => setNewView({ ...newView, name: e.target.value })}
                                placeholder="Bugs em Progresso"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-30 mb-1">Descrição</label>
                            <Input
                                value={newView.description}
                                onChange={(e) => setNewView({ ...newView, description: e.target.value })}
                                placeholder="Opcional"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-30 mb-2">Visibilidade</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={newView.isPublic}
                                        onChange={() => setNewView({ ...newView, isPublic: true })}
                                        className="accent-brand"
                                    />
                                    <Globe className="h-4 w-4 text-neutral-40" />
                                    <span className="text-sm text-neutral">Público</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={!newView.isPublic}
                                        onChange={() => setNewView({ ...newView, isPublic: false })}
                                        className="accent-brand"
                                    />
                                    <Lock className="h-4 w-4 text-neutral-40" />
                                    <span className="text-sm text-neutral">Privado</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCreate} disabled={!newView.name}>
                            Criar View
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
