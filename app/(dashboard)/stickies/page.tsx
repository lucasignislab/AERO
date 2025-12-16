"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, StickyNote, Trash2, X } from "lucide-react";

interface Sticky {
    id: string;
    content: string;
    color: string;
    createdAt: string;
}

const colorOptions = [
    { name: "Amarelo", value: "#fef08a" },
    { name: "Rosa", value: "#fecdd3" },
    { name: "Verde", value: "#bbf7d0" },
    { name: "Azul", value: "#bfdbfe" },
    { name: "Roxo", value: "#ddd6fe" },
    { name: "Laranja", value: "#fed7aa" },
];

const demoStickies: Sticky[] = [
    { id: "1", content: "Revisar PR #42 antes do deploy", color: "#fef08a", createdAt: "2024-12-16T10:00:00" },
    { id: "2", content: "Reunião com o time às 15h", color: "#fecdd3", createdAt: "2024-12-16T09:00:00" },
    { id: "3", content: "Pesquisar bibliotecas de drag-and-drop para React", color: "#bbf7d0", createdAt: "2024-12-15T14:00:00" },
];

export default function StickiesPage() {
    const [stickies, setStickies] = useState<Sticky[]>(demoStickies);
    const [newContent, setNewContent] = useState("");
    const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
    const [isCreating, setIsCreating] = useState(false);

    const addSticky = () => {
        if (!newContent.trim()) return;
        const sticky: Sticky = {
            id: Date.now().toString(),
            content: newContent,
            color: selectedColor,
            createdAt: new Date().toISOString(),
        };
        setStickies([sticky, ...stickies]);
        setNewContent("");
        setIsCreating(false);
    };

    const deleteSticky = (id: string) => {
        setStickies(stickies.filter(s => s.id !== id));
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-neutral">Stickies</h1>
                <Button onClick={() => setIsCreating(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Sticky
                </Button>
            </div>

            {/* New Sticky Form */}
            {isCreating && (
                <div
                    className="mb-6 p-4 rounded-lg shadow-lg"
                    style={{ backgroundColor: selectedColor }}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-1">
                            {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setSelectedColor(color.value)}
                                    className={cn(
                                        "w-5 h-5 rounded-full transition-transform",
                                        selectedColor === color.value && "ring-2 ring-gray-600 scale-110"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                />
                            ))}
                        </div>
                        <button onClick={() => setIsCreating(false)} className="text-gray-600 hover:text-gray-800">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Digite sua nota..."
                        className="w-full bg-transparent border-none resize-none text-gray-800 placeholder-gray-500 text-sm focus:outline-none min-h-[80px]"
                        autoFocus
                    />
                    <div className="flex justify-end">
                        <Button size="sm" onClick={addSticky} disabled={!newContent.trim()}>
                            Salvar
                        </Button>
                    </div>
                </div>
            )}

            {/* Stickies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stickies.map((sticky) => (
                    <div
                        key={sticky.id}
                        className="p-4 rounded-lg shadow-md group relative"
                        style={{ backgroundColor: sticky.color }}
                    >
                        <button
                            onClick={() => deleteSticky(sticky.id)}
                            className="absolute top-2 right-2 p-1 rounded hover:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-4 w-4 text-gray-600" />
                        </button>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                            {sticky.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-3">
                            {new Date(sticky.createdAt).toLocaleDateString("pt-BR", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                ))}
            </div>

            {stickies.length === 0 && !isCreating && (
                <div className="text-center py-12 text-neutral-40">
                    <StickyNote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma sticky note</p>
                    <Button variant="outline" className="mt-4" onClick={() => setIsCreating(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar primeira sticky
                    </Button>
                </div>
            )}
        </div>
    );
}
