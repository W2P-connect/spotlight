import { z } from 'zod';

export const workoutHistoryExerciseSchema = z.object({
    id: z.string().uuid(),
    workoutHistoryId: z.string().uuid(),
    exerciseId: z.string().uuid(),
    comment: z.string(),
    nbReps: z.array(z.number().int().nonnegative()),
    weight: z.array(z.number().nonnegative()),
    minReps: z.array(z.number().int().nonnegative()),
    maxReps: z.array(z.number().int().nonnegative()),
    restTime: z.array(z.number().int().nonnegative()),
    order: z.number().int().nonnegative().default(1),
    supersetId: z.string().uuid().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strip();

export const updateWorkoutHistoryExerciseSchema = z.object({
    order: z.number().nonnegative().optional(),
    nbReps: z.array(z.number().int().positive()).optional(),
    weight: z.array(z.number().nonnegative()).optional(),
    comment: z.string().nullable().optional(),
    restTime: z.array(z.number().int().nonnegative()).optional(),
    supersetId: z.string().uuid().nullable().optional(),
    exerciseId: z.string().uuid().optional(),
}).strip();

export const workoutHistorySchema = z.object({
    id: z.string().uuid(),
    date: z.string().datetime().optional(),
    ownerId: z.string().uuid(),
    workoutTemplateId: z.string().uuid().nullable().optional(),
    workoutProgramId: z.string().uuid().nullable().optional().or(z.literal("")),
    name: z.string().default("Séance libre"),
    duration: z.number().int().nonnegative().default(0),
    comment: z.string().nullable().optional(),
    isPublic: z.boolean().default(false),
    workoutPlace: z.string().nullable().optional(),
}).strip();

export const updateWorkoutHistorySchema = z.object({
    name: z.string().min(1).optional(),
    comment: z.string().nullable().optional(),
    workoutTemplateId: z.string().uuid().nullable().optional(),
    workoutProgramId: z.string().uuid().nullable().optional(),
    isPublic: z.boolean().default(false),
    workoutPlace: z.string().nullable().optional(),
}).strip();
