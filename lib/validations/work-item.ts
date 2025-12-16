import { z } from "zod";

export const workItemSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().optional(),
    priority: z.enum(["urgent", "high", "medium", "low", "none"]).default("none"),
    stateId: z.string().uuid().optional(),
    assigneeIds: z.array(z.string().uuid()).default([]),
    labelIds: z.array(z.string().uuid()).default([]),
    dueDate: z.string().datetime().optional(),
    startDate: z.string().datetime().optional(),
    cycleId: z.string().uuid().optional(),
    epicId: z.string().uuid().optional(),
    parentId: z.string().uuid().optional(),
});

export const createWorkItemSchema = workItemSchema.extend({
    projectId: z.string().uuid(),
});

export type WorkItemFormData = z.infer<typeof workItemSchema>;
export type CreateWorkItemFormData = z.infer<typeof createWorkItemSchema>;
