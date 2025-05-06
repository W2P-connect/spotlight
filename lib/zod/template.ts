import { z } from "zod";

export const workoutTemplateLinkSchema = z.object({
    id: z.string().uuid().optional(),
    workoutProgramId: z.string().uuid(),
    workoutTemplateId: z.string().uuid(),
    order: z.number().int().nonnegative().default(1),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});