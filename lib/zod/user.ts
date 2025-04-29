import { z } from "zod";

export const userMetadataSchema = z.object({
    email: z.string().email().optional(),
    email_verified: z.boolean().optional(),
    phone_verified: z.boolean().optional(),
    meta_loaded: z.boolean().optional(),
    sub: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    bio: z.string().optional(),
    gym_place: z.string().optional(),
    gender: z.string().optional(),
    main_sport: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
});

export const isValidUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
};

export const isValidName = (name: string): boolean => {
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]{1,25}$/;
    return nameRegex.test(name);
};
