"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Trash2 } from "lucide-react";

export default function ProjectSettingsPage() {
    const params = useParams();
    const [projectName, setProjectName] = useState("Meu Projeto");
    const [projectKey, setProjectKey] = useState("PRJ");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState<"public" | "private">("private");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Save to Supabase
        await new Promise((r) => setTimeout(r, 500));
        setIsSaving(false);
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-neutral mb-6">Configurações Gerais</h1>

            <div className="space-y-6">
                {/* Project Name */}
                <div>
                    <label className="block text-sm font-medium text-neutral-30 mb-2">
                        Nome do Projeto
                    </label>
                    <Input
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Nome do projeto"
                    />
                </div>

                {/* Project Key */}
                <div>
                    <label className="block text-sm font-medium text-neutral-30 mb-2">
                        Identificador
                    </label>
                    <Input
                        value={projectKey}
                        onChange={(e) => setProjectKey(e.target.value.toUpperCase().slice(0, 5))}
                        placeholder="PRJ"
                        maxLength={5}
                    />
                    <p className="text-xs text-neutral-40 mt-1">
                        Usado nos IDs dos work items (ex: PRJ-123)
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-neutral-30 mb-2">
                        Descrição
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descreva o projeto..."
                        className="w-full px-3 py-2 rounded-md bg-primary-20 border border-primary-30 text-neutral text-sm min-h-[100px] resize-none"
                    />
                </div>

                {/* Visibility */}
                <div>
                    <label className="block text-sm font-medium text-neutral-30 mb-2">
                        Visibilidade
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="visibility"
                                checked={visibility === "private"}
                                onChange={() => setVisibility("private")}
                                className="accent-brand"
                            />
                            <span className="text-sm text-neutral">Privado</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="visibility"
                                checked={visibility === "public"}
                                onChange={() => setVisibility("public")}
                                className="accent-brand"
                            />
                            <span className="text-sm text-neutral">Público</span>
                        </label>
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 flex gap-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>

                {/* Danger Zone */}
                <div className="pt-8 border-t border-primary-30">
                    <h2 className="text-lg font-semibold text-danger mb-4">Zona de Perigo</h2>
                    <div className="bg-danger/10 border border-danger/30 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-neutral mb-2">Excluir Projeto</h3>
                        <p className="text-xs text-neutral-40 mb-4">
                            Esta ação é irreversível e excluirá todos os dados do projeto.
                        </p>
                        <Button variant="destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir Projeto
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
