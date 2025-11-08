import { z } from "zod";
import { TemplateType } from '@prisma/client'

export const workoutTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(30),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  type: z.nativeEnum(TemplateType),
}).strip()

export const workoutTemplateLinkSchema = z.object({
  id: z.string().uuid().optional(),
  workoutProgramId: z.string().uuid(),
  workoutTemplateId: z.string().uuid(),
  order: z.number().int().nonnegative().default(1),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strip()

export const updateWorkoutTemplateSchema = z.object({
  name: z.string().max(30).optional(),
  archived: z.boolean().optional(),
}).strip()

export const updateWorkoutTemplateExerciseSchema = z.object({
  minReps: z.array(z.number().int().nonnegative()),
  maxReps: z.array(z.number().int().nonnegative()).optional(),
  intensity: z.array(z.number().int().nonnegative()).optional(),
  restTime: z.array(z.number().int().nonnegative()).optional(),
  order: z.number().int().nonnegative().default(1),
  supersetId: z.string().uuid().nullable().optional(),
  exerciseId: z.string().uuid().optional(),
  comment: z.string().optional(),
}).strip()
