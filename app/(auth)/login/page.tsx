import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background aurora-bg">
            <div className="w-full max-w-md p-8 space-y-6 bg-primary-10 rounded-2xl border border-primary-30">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-neutral">AERO</h1>
                    <p className="text-neutral-30 mt-2">Planeje na velocidade do pensamento.</p>
                </div>

                <LoginForm />

                <p className="text-center text-neutral-30 text-sm">
                    Não tem uma conta?{" "}
                    <Link href="/signup" className="text-brand hover:underline">
                        Criar conta
                    </Link>
                </p>
            </div>
        </div>
    );
}
