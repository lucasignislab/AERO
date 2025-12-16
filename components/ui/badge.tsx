import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-brand text-white",
                secondary: "border-transparent bg-primary-20 text-neutral",
                destructive: "border-transparent bg-danger text-white",
                outline: "text-neutral border-primary-30",
                success: "border-transparent bg-success text-white",
                warning: "border-transparent bg-warning text-white",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
