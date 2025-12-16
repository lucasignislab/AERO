"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ListTodo, Circle, Layers, Eye, FileStack, BarChart3 } from "lucide-react";

interface Feature {
    id: string;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    enabled: boolean;
}

const defaultFeatures: Feature[] = [
    {
        id: "work-items",
        label: "Work Items",
        description: "Gerencie tarefas e issues com múltiplos layouts",
        icon: ListTodo,
        enabled: true,
    },
    {
        id: "cycles",
        label: "Cycles",
        description: "Organize sprints com datas de início e fim",
        icon: Circle,
        enabled: true,
    },
    {
        id: "modules",
        label: "Modules",
        description: "Agrupe work items por features ou épicos",
        icon: Layers,
        enabled: true,
    },
    {
        id: "views",
        label: "Views",
        description: "Crie visualizações personalizadas com filtros",
        icon: Eye,
        enabled: true,
    },
    {
        id: "pages",
        label: "Pages",
        description: "Documentação e wiki do projeto",
        icon: FileStack,
        enabled: true,
    },
    {
        id: "analytics",
        label: "Analytics",
        description: "Relatórios e gráficos de progresso",
        icon: BarChart3,
        enabled: false,
    },
];

export default function FeaturesPage() {
    const [features, setFeatures] = useState<Feature[]>(defaultFeatures);

    const toggleFeature = (featureId: string) => {
        setFeatures((prev) =>
            prev.map((f) =>
                f.id === featureId ? { ...f, enabled: !f.enabled } : f
            )
        );
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-neutral mb-2">Recursos</h1>
            <p className="text-neutral-40 mb-6">
                Ative ou desative recursos para seus projetos.
            </p>

            <div className="space-y-3">
                {features.map((feature) => (
                    <div
                        key={feature.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-primary-20"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-md bg-primary-30">
                                <feature.icon className="h-5 w-5 text-neutral" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-neutral">
                                    {feature.label}
                                </h3>
                                <p className="text-xs text-neutral-40">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleFeature(feature.id)}
                            className={cn(
                                "relative w-11 h-6 rounded-full transition-colors",
                                feature.enabled ? "bg-brand" : "bg-primary-30"
                            )}
                        >
                            <span
                                className={cn(
                                    "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                                    feature.enabled && "translate-x-5"
                                )}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
