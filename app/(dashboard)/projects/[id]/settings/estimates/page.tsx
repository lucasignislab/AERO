"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface EstimatePoint {
    id: string;
    value: string;
    label: string;
}

const fibonacciEstimates: EstimatePoint[] = [
    { id: "1", value: "0", label: "Trivial" },
    { id: "2", value: "1", label: "Muito Pequeno" },
    { id: "3", value: "2", label: "Pequeno" },
    { id: "4", value: "3", label: "Médio" },
    { id: "5", value: "5", label: "Grande" },
    { id: "6", value: "8", label: "Muito Grande" },
    { id: "7", value: "13", label: "Épico" },
];

const tshirtEstimates: EstimatePoint[] = [
    { id: "1", value: "XS", label: "Extra Pequeno" },
    { id: "2", value: "S", label: "Pequeno" },
    { id: "3", value: "M", label: "Médio" },
    { id: "4", value: "L", label: "Grande" },
    { id: "5", value: "XL", label: "Extra Grande" },
];

export default function EstimatesPage() {
    const [estimateType, setEstimateType] = useState<"fibonacci" | "tshirt" | "custom">("fibonacci");
    const [estimates, setEstimates] = useState<EstimatePoint[]>(fibonacciEstimates);
    const [newValue, setNewValue] = useState("");
    const [newLabel, setNewLabel] = useState("");

    const handleTypeChange = (type: typeof estimateType) => {
        setEstimateType(type);
        if (type === "fibonacci") {
            setEstimates(fibonacciEstimates);
        } else if (type === "tshirt") {
            setEstimates(tshirtEstimates);
        }
    };

    const addEstimate = () => {
        if (!newValue.trim() || !newLabel.trim()) return;
        const newEstimate: EstimatePoint = {
            id: Date.now().toString(),
            value: newValue,
            label: newLabel,
        };
        setEstimates([...estimates, newEstimate]);
        setNewValue("");
        setNewLabel("");
    };

    const deleteEstimate = (id: string) => {
        setEstimates(estimates.filter((e) => e.id !== id));
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-neutral mb-2">Estimativas</h1>
            <p className="text-neutral-40 mb-6">
                Configure o sistema de pontos para estimar work items.
            </p>

            {/* Estimate Type Selector */}
            <div className="flex gap-2 mb-6">
                {[
                    { id: "fibonacci", label: "Fibonacci" },
                    { id: "tshirt", label: "T-Shirt" },
                    { id: "custom", label: "Personalizado" },
                ].map((type) => (
                    <button
                        key={type.id}
                        onClick={() => handleTypeChange(type.id as typeof estimateType)}
                        className={cn(
                            "px-4 py-2 rounded-md text-sm transition-colors",
                            estimateType === type.id
                                ? "bg-brand text-white"
                                : "bg-primary-20 text-neutral-30 hover:bg-primary-30"
                        )}
                    >
                        {type.label}
                    </button>
                ))}
            </div>

            {/* Add Custom Estimate */}
            {estimateType === "custom" && (
                <div className="bg-primary-20 rounded-lg p-4 mb-6">
                    <h2 className="text-sm font-medium text-neutral mb-3">Adicionar Ponto</h2>
                    <div className="flex gap-2">
                        <Input
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder="Valor (ex: 5)"
                            className="w-24"
                        />
                        <Input
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            placeholder="Descrição"
                            className="flex-1"
                        />
                        <Button onClick={addEstimate} disabled={!newValue.trim() || !newLabel.trim()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar
                        </Button>
                    </div>
                </div>
            )}

            {/* Estimates List */}
            <div className="space-y-2">
                {estimates.map((estimate) => (
                    <div
                        key={estimate.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-primary-20 hover:bg-primary-30 transition-colors group"
                    >
                        <GripVertical className="h-4 w-4 text-neutral-40 cursor-grab" />
                        <span className="w-12 text-sm font-mono text-brand">
                            {estimate.value}
                        </span>
                        <span className="flex-1 text-sm text-neutral">
                            {estimate.label}
                        </span>
                        {estimateType === "custom" && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteEstimate(estimate.id)}
                            >
                                <Trash2 className="h-4 w-4 text-danger" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
