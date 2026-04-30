import { cn } from "@/lib/utils";

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-primary-20", className)}
            {...props}
        />
    );
}

function SkeletonCard() {
    return (
        <div className="rounded-xl border border-primary-30 p-4 space-y-3">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
        </div>
    );
}

function SkeletonListItem() {
    return (
        <div className="flex items-center gap-3 px-3 py-2.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-6 rounded-full" />
        </div>
    );
}

function SkeletonKanbanColumn() {
    return (
        <div className="shrink-0 w-[350px] space-y-3">
            <div className="flex items-center gap-2 p-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-6" />
            </div>
            {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-primary-30 p-4 space-y-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 rounded-md" />
                        <Skeleton className="h-6 w-6 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export { Skeleton, SkeletonCard, SkeletonListItem, SkeletonKanbanColumn };
