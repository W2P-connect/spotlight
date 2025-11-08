import { z } from "zod";

export const createWorkoutProgramShema = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  color: z.string(),
});

export const updateWorkoutProgramSchema = z.object({
  name: z.string().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  archived: z.boolean().optional(),
}).strip()
