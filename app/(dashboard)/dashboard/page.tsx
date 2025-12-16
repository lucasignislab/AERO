export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral">Dashboard</h1>
                <p className="text-neutral-30 mt-1">
                    Bem-vindo ao AERO. Planeje na velocidade do pensamento.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Tarefas Abertas" value="24" />
                <StatCard title="Em Progresso" value="8" />
                <StatCard title="Concluídas Hoje" value="5" />
                <StatCard title="Sprint Atual" value="Sprint 12" />
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-xl border border-primary-30 p-6">
                <h2 className="text-xl font-semibold text-neutral mb-4">
                    Atividade Recente
                </h2>
                <div className="space-y-3">
                    <ActivityItem
                        action="criou a tarefa"
                        target="Implementar autenticação"
                        time="há 2 horas"
                    />
                    <ActivityItem
                        action="moveu"
                        target="Bug no formulário"
                        time="há 3 horas"
                    />
                    <ActivityItem
                        action="comentou em"
                        target="Refatorar sidebar"
                        time="há 5 horas"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="bg-card rounded-xl border border-primary-30 p-4">
            <p className="text-sm text-neutral-30">{title}</p>
            <p className="text-2xl font-bold text-neutral mt-1">{value}</p>
        </div>
    );
}

function ActivityItem({
    action,
    target,
    time,
}: {
    action: string;
    target: string;
    time: string;
}) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-brand" />
            <span className="text-neutral-30">Você {action}</span>
            <span className="text-neutral font-medium">{target}</span>
            <span className="text-neutral-40 ml-auto">{time}</span>
        </div>
    );
}
