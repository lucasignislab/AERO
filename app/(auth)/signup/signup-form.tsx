"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
    const router = useRouter();
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabase = createClient();

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push("/dashboard");
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-danger/20 border border-danger text-danger px-4 py-2 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="displayName" className="block text-sm font-medium text-neutral-20">
                    Nome
                </label>
                <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-primary-20 border border-primary-30 rounded-lg text-neutral placeholder:text-neutral-40 focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="Seu nome"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-20">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-primary-20 border border-primary-30 rounded-lg text-neutral placeholder:text-neutral-40 focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="seu@email.com"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-20">
                    Senha
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-primary-20 border border-primary-30 rounded-lg text-neutral placeholder:text-neutral-40 focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="Mínimo 6 caracteres"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand hover:bg-brand/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Criando..." : "Criar Conta"}
            </button>
        </form>
    );
}
