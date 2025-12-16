"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStickies, useCurrentUser, useWorkspace } from "@/lib/hooks";
import { Plus, StickyNote, Trash2, X, Loader2 } from "lucide-react";

const colorOptions: { name: string; value: "yellow" | "green" | "blue" | "pink" | "purple" | "orange" }[] = [
    { name: "Amarelo", value: "yellow" },
    { name: "Rosa", value: "pink" },
    { name: "Verde", value: "green" },
    { name: "Azul", value: "blue" },
    { name: "Roxo", value: "purple" },
    { name: "Laranja", value: "orange" },
];

const colorMap: Record<string, string> = {
    yellow: "#fef08a",
    pink: "#fecdd3",
    green: "#bbf7d0",
    blue: "#bfdbfe",
    purple: "#ddd6fe",
    orange: "#fed7aa",
};

export default function StickiesPage() {
    const { user } = useCurrentUser();
    const { workspace } = useWorkspace(user?.id ?? null);
    const { stickies, isLoading, createSticky, deleteSticky } = useStickies(workspace?.id ?? null);

    const [newContent, setNewContent] = useState("");
    const [selectedColor, setSelectedColor] = useState<"yellow" | "green" | "blue" | "pink" | "purple" | "orange">("yellow");
    const [isCreating, setIsCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleCreate = async () => {
        if (!newContent.trim()) return;

        setIsSaving(true);
        try {
            await createSticky({
                content: newContent,
                color: selectedColor,
            });
            setNewContent("");
            setIsCreating(false);
        } catch (error) {
            console.error("Failed to create sticky:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSticky(id);
        } catch (error) {
            console.error("Failed to delete sticky:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-40" />
            </div>
        );
    }

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
                    style={{ backgroundColor: colorMap[selectedColor] }}
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
                                    style={{ backgroundColor: colorMap[color.value] }}
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
                        <Button size="sm" onClick={handleCreate} disabled={!newContent.trim() || isSaving}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
                        style={{ backgroundColor: colorMap[sticky.color] || "#fef08a" }}
                    >
                        <button
                            onClick={() => handleDelete(sticky.id)}
                            className="absolute top-2 right-2 p-1 rounded hover:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-4 w-4 text-gray-600" />
                        </button>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                            {sticky.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-3">
                            {new Date(sticky.created_at).toLocaleDateString("pt-BR", {
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
