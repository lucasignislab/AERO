"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home } from "lucide-react";

function getBreadcrumbs(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        return { href, label };
    });
    return breadcrumbs;
}

export function Header() {
    const pathname = usePathname();
    const breadcrumbs = getBreadcrumbs(pathname);

    return (
        <header className="h-14 border-b border-primary-30 bg-primary-10 flex items-center px-4 gap-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1 text-sm">
                <Link
                    href="/dashboard"
                    className="text-neutral-30 hover:text-neutral transition-colors"
                >
                    <Home className="h-4 w-4" />
                </Link>
                {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.href} className="flex items-center gap-1">
                        <ChevronRight className="h-4 w-4 text-neutral-40" />
                        {index === breadcrumbs.length - 1 ? (
                            <span className="text-neutral font-medium">{crumb.label}</span>
                        ) : (
                            <Link
                                href={crumb.href}
                                className="text-neutral-30 hover:text-neutral transition-colors"
                            >
                                {crumb.label}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Actions */}
            <Button variant="default" size="sm">
                New Issue
            </Button>
        </header>
    );
}
