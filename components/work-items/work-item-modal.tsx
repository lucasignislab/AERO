"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Editor } from "@/components/editor/editor";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ChevronDown,
    AlertCircle,
    ArrowUp,
    ArrowDown,
    Minus,
    Circle,
} from "lucide-react";

interface WorkItemModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId?: string;
    onSave?: (data: WorkItemFormData) => void;
}

interface WorkItemFormData {
    title: string;
    description: string;
    priority: "urgent" | "high" | "medium" | "low" | "none";
    stateId?: string;
}

const priorities = [
    { value: "urgent", label: "Urgente", icon: AlertCircle, color: "text-danger" },
    { value: "high", label: "Alta", icon: ArrowUp, color: "text-warning" },
    { value: "medium", label: "Média", icon: Minus, color: "text-info" },
    { value: "low", label: "Baixa", icon: ArrowDown, color: "text-success" },
    { value: "none", label: "Sem prioridade", icon: Circle, color: "text-neutral-40" },
] as const;

export function WorkItemModal({
    open,
    onOpenChange,
    onSave,
}: WorkItemModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<WorkItemFormData["priority"]>("none");
    const [loading, setLoading] = useState(false);

    const selectedPriority = priorities.find((p) => p.value === priority)!;

    const handleSubmit = async () => {
        if (!title.trim()) return;

        setLoading(true);
        try {
            onSave?.({ title, description, priority });
            setTitle("");
            setDescription("");
            setPriority("none");
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Nova Tarefa</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Title */}
                    <Input
                        placeholder="Título da tarefa"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg font-medium"
                        autoFocus
                    />

                    {/* Properties Row */}
                    <div className="flex flex-wrap gap-2">
                        {/* Priority */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <selectedPriority.icon className={`h-3.5 w-3.5 ${selectedPriority.color}`} />
                                    {selectedPriority.label}
                                    <ChevronDown className="h-3 w-3 text-neutral-40" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {priorities.map((p) => (
                                    <DropdownMenuItem
                                        key={p.value}
                                        onClick={() => setPriority(p.value)}
                                        className="gap-2"
                                    >
                                        <p.icon className={`h-3.5 w-3.5 ${p.color}`} />
                                        {p.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* State */}
                        <Button variant="outline" size="sm" className="gap-2">
                            <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full" />
                            Backlog
                            <ChevronDown className="h-3 w-3 text-neutral-40" />
                        </Button>

                        {/* Assignee */}
                        <Button variant="outline" size="sm" className="gap-2">
                            Responsável
                            <ChevronDown className="h-3 w-3 text-neutral-40" />
                        </Button>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-20">
                            Descrição
                        </label>
                        <Editor
                            content={description}
                            onChange={setDescription}
                            placeholder="Adicione uma descrição..."
                            className="min-h-[150px]"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-4 border-t border-primary-30">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={!title.trim() || loading}>
                        {loading ? "Criando..." : "Criar Tarefa"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
