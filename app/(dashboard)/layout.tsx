import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = { email: "lucas@example.com", id: "mock-user-id" };
    const profile = { display_name: "Lucas Coelho", avatar_url: undefined };
    const projects = [
        { id: "mock-project-1", name: "AERO Frontend", icon: "🚀", color: "#3b82f6" },
        { id: "mock-project-2", name: "AERO Backend", icon: "⚙️", color: "#ef4444" }
    ];

    return (
        <DashboardShell
            user={user}
            profile={profile}
            projects={projects}
        >
            {children}
        </DashboardShell>
    );
}
