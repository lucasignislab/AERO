"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simple delay to simulate authentication
        setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
        }, 500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-center">
            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand hover:bg-brand/90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
                {loading ? "Entrando..." : "Comece agora"}
            </button>
            <p className="text-neutral-40 text-sm">
                Versão de demonstração - Acesso instantâneo
            </p>
        </form>
    );
}
