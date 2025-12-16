"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    FileText,
    MoreHorizontal,
    Pencil,
    Trash2,
    Lock,
    Globe,
    Star,
    Archive,
    Clock,
} from "lucide-react";

interface Page {
    id: string;
    title: string;
    isPublic: boolean;
    isLocked: boolean;
    isFavorite: boolean;
    updatedAt: string;
    createdBy: { id: string; name: string };
}

const demoPages: Page[] = [
    {
        id: "1",
        title: "Roadmap 2025",
        isPublic: true,
        isLocked: false,
        isFavorite: true,
        updatedAt: "2024-12-16T10:30:00",
        createdBy: { id: "1", name: "Lucas" },
    },
    {
        id: "2",
        title: "Guia de Contribuição",
        isPublic: true,
        isLocked: true,
        isFavorite: false,
        updatedAt: "2024-12-15T14:00:00",
        createdBy: { id: "2", name: "Maria" },
    },
    {
        id: "3",
        title: "Notas da Reunião - Sprint Planning",
        isPublic: false,
        isLocked: false,
        isFavorite: false,
        updatedAt: "2024-12-14T09:00:00",
        createdBy: { id: "1", name: "Lucas" },
    },
    {
        id: "4",
        title: "Arquitetura do Sistema",
        isPublic: true,
        isLocked: false,
        isFavorite: true,
        updatedAt: "2024-12-10T16:45:00",
        createdBy: { id: "3", name: "Pedro" },
    },
];

function getTimeAgo(date: string) {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return then.toLocaleDateString("pt-BR");
}

export default function PagesClient() {
    const [pages, setPages] = useState<Page[]>(demoPages);
    const [modalOpen, setModalOpen] = useState(false);
    const [filter, setFilter] = useState<"all" | "favorites" | "private">("all");
    const [newPage, setNewPage] = useState({ title: "", isPublic: true });

    const filteredPages = pages.filter(page => {
        if (filter === "favorites") return page.isFavorite;
        if (filter === "private") return !page.isPublic;
        return true;
    });

    const handleCreate = () => {
        if (!newPage.title) return;
        const page: Page = {
            id: Date.now().toString(),
            title: newPage.title,
            isPublic: newPage.isPublic,
            isLocked: false,
            isFavorite: false,
            updatedAt: new Date().toISOString(),
            createdBy: { id: "1", name: "Lucas" },
        };
        setPages([page, ...pages]);
        setNewPage({ title: "", isPublic: true });
        setModalOpen(false);
    };

    const toggleFavorite = (id: string) => {
        setPages(pages.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    };

    const deletePage = (id: string) => {
        setPages(pages.filter(p => p.id !== id));
    };

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-semibold text-neutral">Pages</h1>
                    <div className="flex bg-primary-20 rounded-lg p-1">
                        {(["all", "favorites", "private"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm transition-colors",
                                    filter === f
                                        ? "bg-primary-10 text-neutral"
                                        : "text-neutral-30 hover:text-neutral"
                                )}
                            >
                                {f === "all" ? "Todas" : f === "favorites" ? "Favoritas" : "Privadas"}
                            </button>
                        ))}
                    </div>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Page
                </Button>
            </div>

            {/* Pages List */}
            <div className="space-y-2">
                {filteredPages.map((page) => (
                    <div
                        key={page.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-primary-20 hover:bg-primary-30 transition-colors group cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-neutral-40" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-medium text-neutral">{page.title}</h3>
                                    {page.isLocked && (
                                        <Lock className="h-3.5 w-3.5 text-warning" />
                                    )}
                                    {!page.isPublic && (
                                        <Lock className="h-3.5 w-3.5 text-neutral-40" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-40">
                                    <Clock className="h-3 w-3" />
                                    <span>{getTimeAgo(page.updatedAt)}</span>
                                    <span>•</span>
                                    <span>{page.createdBy.name}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(page.id); }}
                                className="p-1 hover:bg-primary-30 rounded"
                            >
                                <Star
                                    className={cn(
                                        "h-4 w-4 transition-colors",
                                        page.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-neutral-40"
                                    )}
                                />
                            </button>
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
                                        <Archive className="h-4 w-4 mr-2" />
                                        Arquivar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-danger" onClick={() => deletePage(page.id)}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Excluir
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPages.length === 0 && (
                <div className="text-center py-12 text-neutral-40">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma page encontrada</p>
                </div>
            )}

            {/* Create Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nova Page</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-30 mb-1">Título</label>
                            <Input
                                value={newPage.title}
                                onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                                placeholder="Título da página"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-30 mb-2">Visibilidade</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={newPage.isPublic}
                                        onChange={() => setNewPage({ ...newPage, isPublic: true })}
                                        className="accent-brand"
                                    />
                                    <Globe className="h-4 w-4 text-neutral-40" />
                                    <span className="text-sm text-neutral">Pública</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={!newPage.isPublic}
                                        onChange={() => setNewPage({ ...newPage, isPublic: false })}
                                        className="accent-brand"
                                    />
                                    <Lock className="h-4 w-4 text-neutral-40" />
                                    <span className="text-sm text-neutral">Privada</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCreate} disabled={!newPage.title}>
                            Criar Page
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
