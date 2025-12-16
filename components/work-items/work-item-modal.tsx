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
    Loader2,
} from "lucide-react";

interface IssueState {
    id: string;
    name: string;
    color: string;
}

interface WorkItemModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit?: (data: { title: string; description?: string; priority?: string; state_id?: string }) => Promise<void>;
    states?: IssueState[];
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
    onSubmit,
    states = [],
}: WorkItemModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"urgent" | "high" | "medium" | "low" | "none">("none");
    const [stateId, setStateId] = useState<string>(states[0]?.id || "");
    const [loading, setLoading] = useState(false);

    const selectedPriority = priorities.find((p) => p.value === priority)!;
    const selectedState = states.find((s) => s.id === stateId) || states[0];

    const handleSubmit = async () => {
        if (!title.trim()) return;

        setLoading(true);
        try {
            await onSubmit?.({
                title,
                description: description || undefined,
                priority,
                state_id: stateId || undefined
            });
            setTitle("");
            setDescription("");
            setPriority("none");
            setStateId(states[0]?.id || "");
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to create:", error);
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Badge
                                        variant="secondary"
                                        className="h-2 w-2 p-0 rounded-full"
                                        style={{ backgroundColor: selectedState?.color || "#737373" }}
                                    />
                                    {selectedState?.name || "Backlog"}
                                    <ChevronDown className="h-3 w-3 text-neutral-40" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {states.map((s) => (
                                    <DropdownMenuItem
                                        key={s.id}
                                        onClick={() => setStateId(s.id)}
                                        className="gap-2"
                                    >
                                        <Badge
                                            variant="secondary"
                                            className="h-2 w-2 p-0 rounded-full"
                                            style={{ backgroundColor: s.color }}
                                        />
                                        {s.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

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
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Criando...
                            </>
                        ) : (
                            "Criar Tarefa"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
