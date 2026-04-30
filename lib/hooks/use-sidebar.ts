"use client";

import { useState, useCallback } from "react";

const STORAGE_KEY = "aero-sidebar-collapsed";

function getInitialCollapsed(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "true";
}

export function useSidebar() {
    const [collapsed, setCollapsed] = useState(getInitialCollapsed);

    const toggle = useCallback(() => {
        setCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem(STORAGE_KEY, String(next));
            return next;
        });
    }, []);

    return { collapsed, toggle };
}
