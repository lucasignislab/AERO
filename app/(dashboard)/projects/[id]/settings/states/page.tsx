"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, GripVertical, Trash2 } from "lucide-react";

interface State {
    id: string;
    name: string;
    color: string;
    group: "backlog" | "todo" | "in_progress" | "done" | "cancelled";
}

const stateGroups = {
    backlog: { label: "Backlog", color: "text-neutral-40" },
    todo: { label: "A Fazer", color: "text-blue-400" },
    in_progress: { label: "Em Progresso", color: "text-yellow-400" },
    done: { label: "Concluído", color: "text-success" },
    cancelled: { label: "Cancelado", color: "text-danger" },
};

const defaultStates: State[] = [
    { id: "1", name: "Backlog", color: "#6b7280", group: "backlog" },
    { id: "2", name: "A Fazer", color: "#3b82f6", group: "todo" },
    { id: "3", name: "Em Progresso", color: "#eab308", group: "in_progress" },
    { id: "4", name: "Revisão", color: "#8b5cf6", group: "in_progress" },
    { id: "5", name: "Concluído", color: "#22c55e", group: "done" },
    { id: "6", name: "Cancelado", color: "#ef4444", group: "cancelled" },
];

export default function StatesPage() {
    const [states, setStates] = useState<State[]>(defaultStates);
    const [newStateName, setNewStateName] = useState("");
    const [selectedGroup, setSelectedGroup] = useState<State["group"]>("todo");

    const addState = () => {
        if (!newStateName.trim()) return;
        const newState: State = {
            id: Date.now().toString(),
            name: newStateName,
            color: "#6b7280",
            group: selectedGroup,
        };
        setStates([...states, newState]);
        setNewStateName("");
    };

    const deleteState = (id: string) => {
        setStates(states.filter((s) => s.id !== id));
    };

    const groupedStates = Object.entries(stateGroups).map(([group, info]) => ({
        group: group as State["group"],
        ...info,
        states: states.filter((s) => s.group === group),
    }));

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-neutral mb-2">Estados</h1>
            <p className="text-neutral-40 mb-6">
                Configure os estados dos work items neste projeto.
            </p>

            {/* Add State */}
            <div className="bg-primary-20 rounded-lg p-4 mb-6">
                <h2 className="text-sm font-medium text-neutral mb-3">Adicionar Estado</h2>
                <div className="flex gap-2">
                    <Input
                        value={newStateName}
                        onChange={(e) => setNewStateName(e.target.value)}
                        placeholder="Nome do estado"
                        className="flex-1"
                    />
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value as State["group"])}
                        className="px-3 py-2 rounded-md bg-primary-30 border border-primary-30 text-neutral text-sm"
                    >
                        {Object.entries(stateGroups).map(([key, { label }]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <Button onClick={addState} disabled={!newStateName.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                    </Button>
                </div>
            </div>

            {/* States by Group */}
            <div className="space-y-6">
                {groupedStates.map(({ group, label, color, states: groupStates }) => (
                    <div key={group}>
                        <h3 className={cn("text-sm font-medium mb-2", color)}>
                            {label}
                        </h3>
                        <div className="space-y-1">
                            {groupStates.map((state) => (
                                <div
                                    key={state.id}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-primary-20 hover:bg-primary-30 transition-colors group"
                                >
                                    <GripVertical className="h-4 w-4 text-neutral-40 cursor-grab" />
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: state.color }}
                                    />
                                    <span className="flex-1 text-sm text-neutral">
                                        {state.name}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => deleteState(state.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-danger" />
                                    </Button>
                                </div>
                            ))}
                            {groupStates.length === 0 && (
                                <p className="text-sm text-neutral-40 py-2 px-3">
                                    Nenhum estado neste grupo
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
