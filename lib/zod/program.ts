import { z } from "zod";

export const createWorkoutProgramShema = z.object({
    id: z.string().uuid().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    name: z.string(),
});