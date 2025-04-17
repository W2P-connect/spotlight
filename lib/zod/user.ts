import { z } from "zod";

export const userMetadataSchema = z.object({
    email: z.string().email().optional(),
    email_verified: z.boolean().optional(),
    phone_verified: z.boolean().optional(),
    meta_loaded: z.boolean().optional(),
    sub: z.string().optional(),
    username: z.string().optional(),
    last_name: z.string().optional(),
    first_name: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    bio: z.string().optional(),
    gym_place: z.string().optional(),
    gender: z.string().optional(),
    main_sport: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    profil_picture_uri: z.string().optional(),
});
