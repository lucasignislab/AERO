"use client";

import * as React from "react";
import { Search, Plus, Layers, Folder, Layout, Grid, Circle, Info } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCommandPalette } from "@/lib/hooks/use-command-palette";
import { cn } from "@/lib/utils";

const COMMANDS = [
    {
        group: "Create",
        items: [
            { id: "new-work-item", label: "New work item", icon: Plus, shortcuts: ["N", "I"] },
            { id: "new-page", label: "New page", icon: Layers, shortcuts: ["N", "D"] },
            { id: "new-view", label: "New view", icon: Layout, shortcuts: ["N", "V"] },
            { id: "new-cycle", label: "New cycle", icon: Circle, shortcuts: ["N", "C"] },
            { id: "new-module", label: "New module", icon: Grid, shortcuts: ["N", "M"] },
            { id: "new-project", label: "New project", icon: Folder, shortcuts: ["N", "P"] },
            { id: "new-workspace", label: "New workspace", icon: Plus, shortcuts: [] },
        ],
    },
    {
        group: "Navigate",
        items: [
            { id: "open-cycle", label: "Open a cycle", icon: Circle, shortcuts: ["O", "C"] },
            { id: "open-module", label: "Open a module", icon: Grid, shortcuts: ["O", "M"] },
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
            console.log("Executing", selectedIndex);
        }
    };

    let globalIndex = 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-[#121212] border-neutral-800 shadow-2xl">
                <div className="flex flex-col h-[500px]">
                    <div className="flex items-center px-4 py-3 border-b border-neutral-800">
                        <Search className="w-5 h-5 mr-3 text-neutral-500" />
                        <input
                            autoFocus
                            className="flex-1 bg-transparent border-none outline-none text-neutral-200 placeholder-neutral-500 text-[15px]"
                            placeholder="Type a command or search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={onKeyDown}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                        {filteredCommands.map((group) => (
                            <div key={group.group} className="px-2 mb-4">
                                <div className="px-3 py-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
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
                                                    isSelected ? "bg-neutral-800 text-neutral-100" : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                                                )}
                                            >
                                                <item.icon className={cn("w-4 h-4 mr-3", isSelected ? "text-neutral-200" : "text-neutral-500")} />
                                                <span className="flex-1 text-[14px]">{item.label}</span>
                                                {item.shortcuts.length > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        {item.shortcuts.map((key, i) => (
                                                            <React.Fragment key={key}>
                                                                <kbd className="flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-mono text-neutral-500 bg-neutral-900 border border-neutral-800 rounded">
                                                                    {key}
                                                                </kbd>
                                                                {i < item.shortcuts.length - 1 && (
                                                                    <span className="text-[10px] text-neutral-600 font-medium lowercase">then</span>
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

                    <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d0d] border-t border-neutral-800">
                        <div className="flex items-center text-neutral-500 text-[12px]">
                            <Info className="w-3.5 h-3.5 mr-2" />
                            <span>Workspace level</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-4 bg-neutral-700 rounded-full relative cursor-pointer hover:bg-neutral-600 transition-colors">
                                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-neutral-200 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
