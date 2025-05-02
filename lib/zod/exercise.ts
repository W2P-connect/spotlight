import { z } from "zod";

export const exerciseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    isPublic: z.boolean(),
    ownerId: z.string().uuid().nullable(),
    tags: z.array(z.string()),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strip();
