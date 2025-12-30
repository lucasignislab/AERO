"use client";

import * as React from "react";
import { Search, Plus, Layers, Folder, Layout, Grid, Circle, Info } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCommandPalette } from "@/lib/hooks/use-command-palette";
import { cn } from "@/lib/utils";

const COMMANDS = [
    {
        group: "Criar",
        items: [
            { id: "new-work-item", label: "Novo item de trabalho", icon: Plus, shortcuts: ["N", "I"] },
            { id: "new-page", label: "Nova página", icon: Layers, shortcuts: ["N", "D"] },
            { id: "new-view", label: "Nova visualização", icon: Layout, shortcuts: ["N", "V"] },
            { id: "new-cycle", label: "Novo ciclo", icon: Circle, shortcuts: ["N", "C"] },
            { id: "new-module", label: "Novo módulo", icon: Grid, shortcuts: ["N", "M"] },
            { id: "new-project", label: "Novo projeto", icon: Folder, shortcuts: ["N", "P"] },
            { id: "new-workspace", label: "Novo workspace", icon: Plus, shortcuts: [] },
        ],
    },
    {
        group: "Navegação",
        items: [
            { id: "open-cycle", label: "Abrir um ciclo", icon: Circle, shortcuts: ["O", "C"] },
            { id: "open-module", label: "Abrir um módulo", icon: Grid, shortcuts: ["O", "M"] },
        ],
    },
];

export function CommandPalette() {
    const { isOpen, onClose, toggle } = useCommandPalette();
    const [search, setSearch] = React.useState("");
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggle();
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [toggle]);

    const filteredCommands = COMMANDS.map((group) => ({
        ...group,
        items: group.items.filter((item) =>
            item.label.toLowerCase().includes(search.toLowerCase())
        ),
    })).filter((group) => group.items.length > 0);

    const totalItems = filteredCommands.reduce((acc, group) => acc + group.items.length, 0);

    React.useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev + 1) % totalItems);
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        } else if (e.key === "Enter") {
            // Execute command
            console.log("Executando", selectedIndex);
        }
    };

    let globalIndex = 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-primary-10 border-primary-30 shadow-2xl rounded-xl">
                <div className="flex flex-col h-[500px]">
                    <div className="flex items-center px-4 py-3 border-b border-primary-30 bg-primary-20">
                        <Search className="w-5 h-5 mr-3 text-neutral-30" />
                        <input
                            autoFocus
                            className="flex-1 bg-transparent border-none outline-none text-neutral placeholder-neutral-30 text-[15px]"
                            placeholder="Digite um comando ou pesquise"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={onKeyDown}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto py-2 custom-scrollbar bg-primary-10">
                        {filteredCommands.map((group) => (
                            <div key={group.group} className="px-2 mb-4">
                                <div className="px-3 py-2 text-[11px] font-semibold text-neutral-30 uppercase tracking-wider">
                                    {group.group}
                                </div>
                                <div className="space-y-0.5">
                                    {group.items.map((item) => {
                                        const isSelected = globalIndex === selectedIndex;
                                        globalIndex++;

                                        return (
                                            <button
                                                key={item.id}
                                                className={cn(
                                                    "w-full flex items-center px-3 py-2.5 rounded-md transition-colors text-left group",
                                                    isSelected ? "bg-primary-20 text-neutral" : "text-neutral-20 hover:bg-primary-20/50 hover:text-neutral-10"
                                                )}
                                            >
                                                <item.icon className={cn("w-4 h-4 mr-3", isSelected ? "text-neutral" : "text-neutral-30")} />
                                                <span className="flex-1 text-[14px]">{item.label}</span>
                                                {item.shortcuts.length > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        {item.shortcuts.map((key, i) => (
                                                            <React.Fragment key={key}>
                                                                <kbd className="flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-mono text-neutral-30 bg-primary-20 border border-primary-30 rounded shadow-sm">
                                                                    {key}
                                                                </kbd>
                                                                {i < item.shortcuts.length - 1 && (
                                                                    <span className="text-[10px] text-neutral-30 font-medium lowercase">depois</span>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 bg-primary-10 border-t border-primary-30">
                        <div className="flex items-center text-neutral-30 text-[12px]">
                            <Info className="w-3.5 h-3.5 mr-2" />
                            <span>Nível do workspace</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-4 bg-primary-20 rounded-full relative cursor-pointer hover:bg-primary-30 transition-colors border border-primary-30">
                                <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 bg-neutral-20 rounded-full transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
