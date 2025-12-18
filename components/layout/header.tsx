import {
    Search,
    ChevronDown,
    Inbox,
    HelpCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function Header() {
    return (
        <header className="h-12 border-b border-primary-30 bg-primary-10/50 flex items-center justify-between px-4">
            {/* Left side - Workspace Toggle */}
            <div className="flex items-center gap-2 cursor-pointer hover:bg-primary-20 px-2 py-1 rounded transition-colors group">
                <div className="w-5 h-5 bg-info rounded flex items-center justify-center text-[10px] font-bold text-white">
                    L
                </div>
                <span className="text-sm font-semibold text-neutral">lucaspainroom</span>
                <ChevronDown className="h-3.5 w-3.5 text-neutral-40 group-hover:text-neutral transition-colors" />
            </div>

            {/* Middle - Search Bar */}
            <div className="flex-1 max-w-md px-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-40 group-focus-within:text-neutral transition-colors" />
                    <Input
                        placeholder="Search commands..."
                        className="w-full bg-primary-20/50 border-primary-30 h-8 pl-10 text-xs text-neutral focus-visible:ring-1 focus-visible:ring-primary-40 transition-all rounded-md"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <kbd className="text-[10px] text-neutral-40 bg-primary-30 px-1 rounded">⌘</kbd>
                        <kbd className="text-[10px] text-neutral-40 bg-primary-30 px-1 rounded">K</kbd>
                    </div>
                </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-primary-20 rounded-md transition-colors text-neutral-40 hover:text-neutral">
                        <Inbox className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 hover:bg-primary-20 rounded-md transition-colors text-neutral-40 hover:text-neutral">
                        <HelpCircle className="h-4 w-4" />
                    </button>
                </div>

                <Avatar className="h-6 w-6 border border-primary-30">
                    <AvatarImage src="/avatar-placeholder.png" />
                    <AvatarFallback className="text-[10px] bg-primary-30">LC</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
