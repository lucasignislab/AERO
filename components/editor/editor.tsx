"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { cn } from "@/lib/utils";

interface EditorProps {
    content?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    className?: string;
    editable?: boolean;
}

export function Editor({
    content = "",
    onChange,
    placeholder = "Start writing...",
    className,
    editable = true,
}: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Underline,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-invert max-w-none focus:outline-none min-h-[200px]",
                    "prose-headings:text-neutral prose-p:text-neutral-10",
                    "prose-strong:text-neutral prose-code:text-brand",
                    "prose-a:text-brand prose-a:no-underline hover:prose-a:underline"
                ),
            },
        },
    });

    return (
        <div
            className={cn(
                "bg-primary-20 rounded-lg border border-primary-30 p-4",
                className
            )}
        >
            <EditorContent editor={editor} />
        </div>
    );
}
