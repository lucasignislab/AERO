"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserPlus, MoreHorizontal, Mail, Shield, Trash2 } from "lucide-react";

interface Member {
    id: string;
    email: string;
    display_name?: string;
    avatar_url?: string;
    role: "admin" | "member" | "guest";
}

const demoMembers: Member[] = [
    { id: "1", email: "admin@aero.app", display_name: "Admin User", role: "admin" },
    { id: "2", email: "designer@aero.app", display_name: "Designer", role: "member" },
    { id: "3", email: "dev@aero.app", display_name: "Developer", role: "member" },
];

const roleLabels = {
    admin: { label: "Admin", variant: "default" as const },
    member: { label: "Membro", variant: "secondary" as const },
    guest: { label: "Convidado", variant: "outline" as const },
};

export default function MembersPage() {
    const [members] = useState<Member[]>(demoMembers);
    const [inviteEmail, setInviteEmail] = useState("");
    const [isInviting, setIsInviting] = useState(false);

    const handleInvite = async () => {
        if (!inviteEmail) return;
        setIsInviting(true);
        // TODO: Implement invite via Supabase
        await new Promise((r) => setTimeout(r, 500));
        setInviteEmail("");
        setIsInviting(false);
    };

    return (
        <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-neutral mb-6">Membros</h1>

            {/* Invite Section */}
            <div className="bg-primary-20 rounded-lg p-4 mb-6">
                <h2 className="text-sm font-medium text-neutral mb-3">Convidar Membro</h2>
                <div className="flex gap-2">
                    <Input
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="email@exemplo.com"
                        type="email"
                        className="flex-1"
                    />
                    <Button onClick={handleInvite} disabled={isInviting || !inviteEmail}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        {isInviting ? "Convidando..." : "Convidar"}
                    </Button>
                </div>
            </div>

            {/* Members List */}
            <div className="space-y-2">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-primary-20 hover:bg-primary-30 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={member.avatar_url} />
                                <AvatarFallback>
                                    {member.display_name?.[0] || member.email[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium text-neutral">
                                    {member.display_name || member.email}
                                </p>
                                <p className="text-xs text-neutral-40">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={roleLabels[member.role].variant}>
                                {roleLabels[member.role].label}
                            </Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Shield className="h-4 w-4 mr-2" />
                                        Alterar Papel
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Reenviar Convite
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-danger">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remover
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
