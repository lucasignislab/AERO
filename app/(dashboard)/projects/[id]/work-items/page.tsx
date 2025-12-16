import WorkItemsClient from "./work-items-client";

export default function WorkItemsPage() {
    return (
        <div className="h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral">Work Items</h1>
                <p className="text-neutral-30 mt-1">
                    Gerencie as tarefas do projeto
                </p>
            </div>

            <WorkItemsClient />
        </div>
    );
}
