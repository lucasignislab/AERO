"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface Label {
    id: string;
    name: string;
    color: string;
}

const colorOptions = [
    "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
    "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#6b7280",
];

const defaultLabels: Label[] = [
    { id: "1", name: "Bug", color: "#ef4444" },
    { id: "2", name: "Feature", color: "#22c55e" },
    { id: "3", name: "Melhoria", color: "#3b82f6" },
    { id: "4", name: "Documentação", color: "#8b5cf6" },
    { id: "5", name: "Urgente", color: "#f97316" },
];

export default function LabelsPage() {
    const [labels, setLabels] = useState<Label[]>(defaultLabels);
    const [newLabelName, setNewLabelName] = useState("");
    const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

    const addLabel = () => {
        if (!newLabelName.trim()) return;
        const newLabel: Label = {
            id: Date.now().toString(),
            name: newLabelName,
            color: selectedColor,
        };
        setLabels([...labels, newLabel]);
        setNewLabelName("");
    };

    const deleteLabel = (id: string) => {
        setLabels(labels.filter((l) => l.id !== id));
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-neutral mb-2">Etiquetas</h1>
            <p className="text-neutral-40 mb-6">
                Crie etiquetas para categorizar os work items.
            </p>

            {/* Add Label */}
            <div className="bg-primary-20 rounded-lg p-4 mb-6">
                <h2 className="text-sm font-medium text-neutral mb-3">Adicionar Etiqueta</h2>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <Input
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                            placeholder="Nome da etiqueta"
                            className="flex-1"
                        />
                        <Button onClick={addLabel} disabled={!newLabelName.trim()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        {colorOptions.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`w-6 h-6 rounded-full transition-transform ${selectedColor === color ? "ring-2 ring-white scale-110" : ""
                                    }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Labels List */}
            <div className="space-y-2">
                {labels.map((label) => (
                    <div
                        key={label.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-primary-20 hover:bg-primary-30 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: label.color }}
                            />
                            <span className="text-sm text-neutral">{label.name}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteLabel(label.id)}
                        >
                            <Trash2 className="h-4 w-4 text-danger" />
                        </Button>
                    </div>
                ))}
                {labels.length === 0 && (
                    <p className="text-sm text-neutral-40 py-4 text-center">
                        Nenhuma etiqueta criada
                    </p>
                )}
            </div>
        </div>
    );
}
