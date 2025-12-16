"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
    Inbox as InboxIcon,
    Check,
    CheckCheck,
    Archive,
    Bell,
    BellOff,
    AtSign,
    RefreshCw,
} from "lucide-react";

interface Notification {
    id: string;
    type: "assigned" | "mentioned" | "comment" | "state_change";
    title: string;
    message: string;
    workItemId: string;
    workItemTitle: string;
    isRead: boolean;
    createdAt: string;
    actor: { id: string; name: string; avatar_url?: string };
}

const demoNotifications: Notification[] = [
    {
        id: "1",
        type: "assigned",
        title: "Tarefa atribuída",
        message: "atribuiu AERO-42 a você",
        workItemId: "42",
        workItemTitle: "Implementar filtros avançados",
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
        actor: { id: "2", name: "Maria" },
    },
    {
        id: "2",
        type: "mentioned",
        title: "Menção",
        message: "mencionou você em um comentário",
        workItemId: "38",
        workItemTitle: "Revisar componentes UI",
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        actor: { id: "3", name: "Pedro" },
    },
    {
        id: "3",
        type: "state_change",
        title: "Estado alterado",
        message: "moveu para Em Progresso",
        workItemId: "35",
        workItemTitle: "Setup de testes",
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
        actor: { id: "2", name: "Maria" },
    },
    {
        id: "4",
        type: "comment",
        title: "Novo comentário",
        message: "comentou: 'Podemos revisar isso amanhã?'",
        workItemId: "30",
        workItemTitle: "Documentação API",
        isRead: true,
        createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
        actor: { id: "4", name: "Ana" },
    },
];

const typeIcons = {
    assigned: "🎯",
    mentioned: "💬",
    comment: "💬",
    state_change: "🔄",
};

function getTimeAgo(date: string) {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return then.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

export default function InboxPage() {
    const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
    const [filter, setFilter] = useState<"all" | "unread" | "mentions">("all");

    const filteredNotifications = notifications.filter(n => {
        if (filter === "unread") return !n.isRead;
        if (filter === "mentions") return n.type === "mentioned";
        return true;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const archiveNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold text-neutral">Inbox</h1>
                    {unreadCount > 0 && (
                        <Badge className="bg-brand">{unreadCount}</Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={markAllAsRead} disabled={unreadCount === 0}>
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Marcar tudo como lido
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4">
                {(["all", "unread", "mentions"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-sm transition-colors",
                            filter === f
                                ? "bg-primary-20 text-neutral"
                                : "text-neutral-40 hover:text-neutral"
                        )}
                    >
                        {f === "all" && <Bell className="h-4 w-4 inline mr-1" />}
                        {f === "unread" && <BellOff className="h-4 w-4 inline mr-1" />}
                        {f === "mentions" && <AtSign className="h-4 w-4 inline mr-1" />}
                        {f === "all" ? "Todas" : f === "unread" ? "Não lidas" : "Menções"}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-1">
                {filteredNotifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={cn(
                            "flex items-start gap-3 p-4 rounded-lg transition-colors group cursor-pointer",
                            notification.isRead ? "bg-primary-10 hover:bg-primary-20" : "bg-primary-20 hover:bg-primary-30"
                        )}
                        onClick={() => markAsRead(notification.id)}
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={notification.actor.avatar_url} />
                            <AvatarFallback className="text-xs">
                                {notification.actor.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-neutral">
                                    {notification.actor.name}
                                </span>
                                <span className="text-sm text-neutral-40">
                                    {notification.message}
                                </span>
                            </div>
                            <p className="text-sm text-neutral-30 truncate">
                                {notification.workItemTitle}
                            </p>
                            <span className="text-xs text-neutral-40">
                                {getTimeAgo(notification.createdAt)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.isRead && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => { e.stopPropagation(); archiveNotification(notification.id); }}
                            >
                                <Archive className="h-4 w-4" />
                            </Button>
                        </div>
                        {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                        )}
                    </div>
                ))}
            </div>

            {filteredNotifications.length === 0 && (
                <div className="text-center py-12 text-neutral-40">
                    <InboxIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma notificação</p>
                </div>
            )}
        </div>
    );
}
