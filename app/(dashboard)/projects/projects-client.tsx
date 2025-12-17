"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useProjects, useCurrentUser, useWorkspace } from "@/lib/hooks";
import { FolderKanban, Plus, Loader2, Globe, Lock } from "lucide-react";

const projectColors = [
    "#ef4444", "#f97316", "#f59e0b", "#84cc16",
    "#22c55e", "#14b8a6", "#06b6d4", "#0ea5e9",
    "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
];

const projectIcons = ["📁", "🚀", "💼", "📊", "🎯", "⚡", "🔥", "💡", "🎨", "🔧"];

export default function ProjectsClient() {
    const router = useRouter();
    const { user, isLoading: userLoading } = useCurrentUser();
    const { workspace, isLoading: wsLoading } = useWorkspace(user?.id ?? null);
    const { projects, isLoading: projectsLoading, createProject } = useProjects(workspace?.id ?? null);

    const [modalOpen, setModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newProject, setNewProject] = useState({
        name: "",
        identifier: "",
        description: "",
        color: projectColors[0],
        icon: projectIcons[0],
        isPrivate: false,
        leadId: "",
    });

    const isLoading = userLoading || wsLoading || projectsLoading;

    const handleCreate = async () => {
        if (!newProject.name || !newProject.identifier) return;

        setIsCreating(true);
        try {
            const project = await createProject({
                name: newProject.name,
                identifier: newProject.identifier.toUpperCase(),
                description: newProject.description || null,
                color: newProject.color,
                icon: newProject.icon,
                is_private: newProject.isPrivate,
                lead_id: newProject.leadId || user?.id,
            });
            setNewProject({
                name: "",
                identifier: "",
                description: "",
                color: projectColors[0],
                icon: projectIcons[0],
                isPrivate: false,
                leadId: "",
            });
            setModalOpen(false);
            router.push(`/projects/${project.id}`);
        } catch (error) {
            console.error("Failed to create project:", error);
            alert("Erro ao criar projeto. Verifique logs.");
        } finally {
            setIsCreating(false);
        }
    };

    const generateIdentifier = (name: string) => {
        return name
            .split(" ")
            .map(w => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 4);
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-40" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral">Projects</h1>
                    <p className="text-neutral-30 mt-1">
                        Gerencie seus projetos e tarefas
                    </p>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Projeto
                </Button>
            </div>

            {projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="block"
                        >
                            <div className="bg-card rounded-xl border border-primary-30 p-4 hover:border-brand transition-colors h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                        style={{ backgroundColor: project.color || "#388cfa" }}
                                    >
                                        {project.icon || "📁"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-neutral truncate">
                                                {project.name}
                                            </h3>
                                            {project.is_private ? (
                                                <Lock className="w-3 h-3 text-neutral-40" />
                                            ) : (
                                                <Globe className="w-3 h-3 text-neutral-40" />
                                            )}
                                        </div>
                                        <p className="text-sm text-neutral-40">
                                            {project.identifier}
                                        </p>
                                    </div>
                                </div>
                                {project.description && (
                                    <p className="text-sm text-neutral-30 line-clamp-2 mb-4 flex-1">
                                        {project.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between pt-4 border-t border-primary-30 mt-auto">
                                    <span className="text-xs text-neutral-40">
                                        Atualizado há {Math.floor((Date.now() - new Date(project.updated_at).getTime()) / (1000 * 60 * 60 * 24))}d
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-card rounded-xl border border-primary-30 p-12 text-center">
                    <FolderKanban className="h-12 w-12 text-neutral-40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral mb-2">
                        Nenhum projeto criado
                    </h3>
                    <p className="text-neutral-30 mb-4">
                        Crie seu primeiro projeto para começar a organizar suas tarefas.
                    </p>
                    <Button onClick={() => setModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Projeto
                    </Button>
                </div>
            )}

            {/* Create Project Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Novo Projeto</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        {/* Left Column: Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-30 mb-1">Nome *</label>
                                <Input
                                    value={newProject.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setNewProject({
                                            ...newProject,
                                            name,
                                            identifier: newProject.identifier || generateIdentifier(name)
                                        });
                                    }}
                                    placeholder="Ex: App Redesign"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-30 mb-1">Identificador (Key) *</label>
                                <Input
                                    value={newProject.identifier}
                                    onChange={(e) => setNewProject({ ...newProject, identifier: e.target.value.toUpperCase() })}
                                    placeholder="APP"
                                    maxLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-30 mb-1">Descrição</label>
                                <Input
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    placeholder="Uma breve descrição..."
                                />
                            </div>
                        </div>

                        {/* Right Column: Settings */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-30 mb-2">Visibilidade</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewProject({ ...newProject, isPrivate: false })}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${!newProject.isPrivate ? "border-brand bg-brand/5 ring-1 ring-brand" : "border-primary-30 hover:border-neutral-30"}`}
                                    >
                                        <Globe className={`h-5 w-5 mb-2 ${!newProject.isPrivate ? "text-brand" : "text-neutral-40"}`} />
                                        <span className={`text-xs font-medium ${!newProject.isPrivate ? "text-brand" : "text-neutral-40"}`}>Público</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewProject({ ...newProject, isPrivate: true })}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${newProject.isPrivate ? "border-brand bg-brand/5 ring-1 ring-brand" : "border-primary-30 hover:border-neutral-30"}`}
                                    >
                                        <Lock className={`h-5 w-5 mb-2 ${newProject.isPrivate ? "text-brand" : "text-neutral-40"}`} />
                                        <span className={`text-xs font-medium ${newProject.isPrivate ? "text-brand" : "text-neutral-40"}`}>Privado</span>
                                    </button>
                                </div>
                                <p className="text-[10px] text-neutral-40 mt-1">
                                    {newProject.isPrivate ? "Apenas membros convidados podem ver." : "Todos no workspace podem ver."}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-30 mb-2">Ícone & Cor</label>
                                <div className="flex gap-2 mb-2">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: newProject.color }}>
                                        {newProject.icon}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {projectIcons.slice(0, 5).map(icon => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setNewProject({ ...newProject, icon })}
                                                className={`w-8 h-8 rounded hover:bg-primary-20 flex items-center justify-center text-sm ${newProject.icon === icon ? "bg-primary-20" : ""}`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {projectColors.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewProject({ ...newProject, color })}
                                            className={`w-5 h-5 rounded-full transition-transform ${newProject.color === color ? "ring-2 ring-offset-2 ring-offset-background ring-brand scale-110" : ""}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCreate} disabled={!newProject.name || !newProject.identifier || isCreating}>
                            {isCreating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Criar Projeto
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
