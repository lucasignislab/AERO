import Link from "next/link";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background aurora-bg">
            <div className="w-full max-w-md p-8 space-y-6 bg-primary-10 rounded-2xl border border-primary-30">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-neutral">Criar Conta</h1>
                    <p className="text-neutral-30 mt-2">Comece a planejar com AERO</p>
                </div>

                <SignupForm />

                <p className="text-center text-neutral-30 text-sm">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="text-brand hover:underline">
                        Fazer login
                    </Link>
                </p>
            </div>
        </div>
    );
}
