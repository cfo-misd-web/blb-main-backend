import { z } from "zod";

export const loginRequest = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export const loginResponse = z.object({
    message: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string().min(1),
        createdAt: z.number(),
        updatedAt: z.number(),
    }),
    token: z.string()
})


export const registerSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6)
});