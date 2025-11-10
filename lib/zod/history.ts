import { cleanComment } from "@/utils/utils";
import { z } from "zod";

const zCleanedComment = z
  .string()
  .max(200, { message: "Le commentaire ne peut pas dépasser 200 caractères." })
  .nullable()
  .optional()
  .transform((val) => (typeof val === "string" ? cleanComment(val) : val));

export const workoutHistoryExerciseSchema = z
  .object({
    id: z.string().uuid(),
    workoutHistoryId: z.string().uuid(),
    exerciseId: z.string().uuid(),
    comment: zCleanedComment,
    nbReps: z.array(z.number().nonnegative()),
    weight: z.array(z.number().nonnegative()),
    minReps: z.array(z.number().int().nonnegative()),
    maxReps: z.array(z.number().int().nonnegative()).optional(),
    intensity: z.array(z.number().int().nonnegative()).optional(),
    restTime: z.array(z.number().int().nonnegative()),
    order: z.number().int().nonnegative().default(1),
    supersetId: z.string().uuid().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strip();

export const updateWorkoutHistoryExerciseSchema = z
  .object({
    order: z.number().nonnegative().optional(),
    nbReps: z.array(z.number().nonnegative()).optional(),
    weight: z.array(z.number()).optional(),
    comment: zCleanedComment,
    restTime: z.array(z.number().int().nonnegative()).optional(),
    supersetId: z.string().uuid().nullable().optional(),
    exerciseId: z.string().uuid().optional(),
  })
  .strip();

export const workoutHistorySchema = z
  .object({
    id: z.string().uuid(),
    date: z.string().datetime().optional(),
    ownerId: z.string().uuid(),
    workoutTemplateId: z.string().uuid().nullable().optional(),
    workoutProgramId: z.string().uuid().nullable().optional().or(z.literal("")),
    name: z.string().default("Séance libre"),
    duration: z.number().int().nonnegative().default(0),
    comment: zCleanedComment,
    isPublic: z.boolean().optional(),
    workoutPlace: z.string().nullable().optional(),
  })
  .strip();

export const updateWorkoutHistorySchema = z
  .object({
    name: z.string().min(1).optional(),
    comment: zCleanedComment,
    workoutTemplateId: z.string().uuid().nullable().optional(),
    workoutProgramId: z.string().uuid().nullable().optional(),
    isPublic: z.boolean().optional(),
    workoutPlace: z.string().nullable().optional(),
    date: z.string().datetime().optional(),
    duration: z.number().int().nonnegative().optional(),
  })
  .strip();
