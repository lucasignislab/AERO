import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .single();

    // Fetch projects for sidebar
    const { data: projects } = await supabase
        .from("projects")
        .select("id, name, icon, color")
        .order("created_at", { ascending: false });

    return (
        <TooltipProvider>
            <div className="flex h-screen bg-background">
                <Sidebar
                    user={{
                        email: user.email,
                        display_name: profile?.display_name,
                        avatar_url: profile?.avatar_url,
                    }}
                    projects={projects || []}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
}
