import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Mock data for preview mode
    const user = { email: "lucas@example.com", id: "mock-user-id" };
    const profile = { display_name: "Lucas Coelho", avatar_url: undefined };
    const projects = [
        { id: "mock-project-1", name: "AERO Frontend", icon: "🚀", color: "#3b82f6" },
        { id: "mock-project-2", name: "AERO Backend", icon: "⚙️", color: "#ef4444" }
    ];

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
