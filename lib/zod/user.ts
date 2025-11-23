import { z } from "zod";

export const userMetadataSchema = z.object({
    email: z.string().email().optional(),
    email_verified: z.boolean().optional(),
    phone_verified: z.boolean().optional(),
    meta_loaded: z.boolean().optional(),
    sub: z.string().optional(),
    city: z.string().max(31).optional(),
    country: z.string().max(31).optional(),
    bio: z.string().max(80).optional(),
    gym_place: z.string().optional(),
    gender: z.string().optional(),
    main_sport: z.string().optional(),
    height: z.string().max(4).optional(),
    weight: z.string().max(6).optional(),
});

export const isValidUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
};

export const isValidName = (name: string): boolean => {
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]{0,25}$/;
    return nameRegex.test(name);
};

export const createExerciseGoalSchema = z.object({
    exerciseId: z.string().uuid(),
    targetKg: z.number().min(0),
    order: z.number().int().min(0).optional(),
}).strip();

export const updateExerciseGoalSchema = z.object({
    targetKg: z.number().min(0).optional(),
    order: z.number().int().min(0).optional(),
}).strip();

export const reorderExerciseGoalsSchema = z.object({
    goals: z.array(z.object({
        goalId: z.string().uuid(),
        order: z.number().int().min(0),
    })),
}).strip();
