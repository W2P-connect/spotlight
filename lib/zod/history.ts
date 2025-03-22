import { z } from 'zod';

export const workoutHistoryExerciseSchema = z.object({
    id: z.string().uuid(),
    workoutHistoryId: z.string().uuid(),
    exerciseId: z.string().uuid(),
    nbReps: z.array(z.number().int().nonnegative()),
    weight: z.array(z.number().int().nonnegative()),
    minReps: z.array(z.number().int().nonnegative()),
    maxReps: z.array(z.number().int().nonnegative()),
    restTime: z.array(z.number().int().nonnegative()),
    order: z.number().int().nonnegative().default(1),
    supersetId: z.string().uuid().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strip();

export const workoutHistorySchema = z.object({
    date: z.string().datetime().optional(),
    ownerId: z.string().uuid(),
    workoutTemplateId: z.string().uuid().nullable().optional(),
    workoutProgramId: z.string().uuid().nullable().optional().or(z.literal("")),
    name: z.string().default("Séance libre"),
    comment: z.string().nullable().optional(),
}).strip();
