import { z } from "zod";

export const projectSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    identifier: z.string().min(2, "Identificador deve ter no mínimo 2 caracteres").max(5, "Identificador deve ter no máximo 5 caracteres").toUpperCase(),
    description: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    leadId: z.string().uuid().optional(),
});

export const createProjectSchema = projectSchema.extend({
    workspaceId: z.string().uuid(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
