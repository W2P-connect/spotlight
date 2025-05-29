import { z } from "zod";

export const workoutTemplateLinkSchema = z.object({
  id: z.string().uuid().optional(),
  workoutProgramId: z.string().uuid(),
  workoutTemplateId: z.string().uuid(),
  order: z.number().int().nonnegative().default(1),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const updateWorkoutTemplateExerciseSchema = z.object({
  minReps: z.array(z.number().int().positive()),
  maxReps: z.array(z.number().int().nonnegative()),
  intensity: z.array(z.number().int().nonnegative()),
  restTime: z.array(z.number().int().nonnegative()).optional(),
  order: z.number().int().nonnegative().default(1),
  supersetId: z.string().uuid().nullable().optional(),
  exerciseId: z.string().uuid().optional(),
  comment: z.string().optional(),
});
