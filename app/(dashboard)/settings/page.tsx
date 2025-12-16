"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function SettingsPage() {
    const [workspaceName, setWorkspaceName] = useState("Meu Workspace");
    const [workspaceUrl, setWorkspaceUrl] = useState("meu-workspace");
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
                {/* Workspace Name */}
                <div>
                    <label className="block text-sm font-medium text-neutral-30 mb-2">
                        Nome do Workspace
                    </label>
                    <Input
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        placeholder="Nome do workspace"
                    />
                    <p className="text-xs text-neutral-40 mt-1">
                        O nome que aparece na sidebar e no cabeçalho.
                    </p>
                </div>

                {/* Workspace URL */}
                <div>
                    <label className="block text-sm font-medium text-neutral-30 mb-2">
                        URL do Workspace
                    </label>
                    <div className="flex items-center">
                        <span className="text-neutral-40 text-sm mr-1">aero.app/</span>
                        <Input
                            value={workspaceUrl}
                            onChange={(e) => setWorkspaceUrl(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                            placeholder="meu-workspace"
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Timezone */}
                <div>
                    <label className="block text-sm font-medium text-neutral-30 mb-2">
                        Fuso Horário
                    </label>
                    <select className="w-full px-3 py-2 rounded-md bg-primary-20 border border-primary-30 text-neutral text-sm">
                        <option value="America/Sao_Paulo">América/São Paulo (GMT-3)</option>
                        <option value="America/New_York">América/New York (GMT-5)</option>
                        <option value="Europe/London">Europa/Londres (GMT+0)</option>
                        <option value="Asia/Tokyo">Ásia/Tóquio (GMT+9)</option>
                    </select>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
