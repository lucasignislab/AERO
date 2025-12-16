import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    FolderKanban,
    FileText,
    Settings,
    ArrowLeft,
} from "lucide-react";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    if (!project) {
        notFound();
    }

    const navItems = [
        { href: `/projects/${id}/work-items`, label: "Work Items", icon: FolderKanban },
        { href: `/projects/${id}/pages`, label: "Pages", icon: FileText },
        { href: `/projects/${id}/settings`, label: "Settings", icon: Settings },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/projects">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: project.color || "#388cfa" }}
                >
                    {project.icon || "📁"}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-neutral">{project.name}</h1>
                        <Badge variant="secondary">{project.identifier}</Badge>
                    </div>
                    {project.description && (
                        <p className="text-neutral-30 mt-1">{project.description}</p>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-2 border-b border-primary-30 pb-4">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button variant="ghost" className="gap-2">
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Button>
                    </Link>
                ))}
            </div>

            {/* Content placeholder */}
            <div className="bg-card rounded-xl border border-primary-30 p-12 text-center">
                <FolderKanban className="h-12 w-12 text-neutral-40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral mb-2">
                    Selecione uma seção
                </h3>
                <p className="text-neutral-30">
                    Use a navegação acima para acessar Work Items, Pages ou Settings.
                </p>
            </div>
        </div>
    );
}
