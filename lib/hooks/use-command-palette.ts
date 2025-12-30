"use client";

import { create } from "zustand";

interface CommandPaletteStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    toggle: () => void;
}

export const useCommandPalette = create<CommandPaletteStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
