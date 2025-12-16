import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus } from "lucide-react";

export default async function ProjectsPage() {
    const supabase = await createClient();

    const { data: projects } = await supabase
        .from("projects")
        .select("id, name, identifier, description, color, icon")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral">Projects</h1>
                    <p className="text-neutral-30 mt-1">
                        Gerencie seus projetos e tarefas
                    </p>
                </div>
                <Button>
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
                            <div className="bg-card rounded-xl border border-primary-30 p-4 hover:border-brand transition-colors">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                        style={{ backgroundColor: project.color || "#388cfa" }}
                                    >
                                        {project.icon || "📁"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-neutral truncate">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm text-neutral-40">
                                            {project.identifier}
                                        </p>
                                    </div>
                                </div>
                                {project.description && (
                                    <p className="text-sm text-neutral-30 mt-3 line-clamp-2">
                                        {project.description}
                                    </p>
                                )}
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
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Projeto
                    </Button>
                </div>
            )}
        </div>
    );
}
