import z from "zod";
import { type User } from "../generated/prisma/client.js";

export const signUpSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  firstName: z
    .string()
    .min(1, "First name is required")
    .transform((v) => v.trim()),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .transform((v) => v.trim()),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUp = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required"),
});

export type SignIn = z.infer<typeof signInSchema>;

export type AuthResponse = {
  user: Omit<User, "password">;
  token: string;
};

export type SafeUser = Omit<User, "password">;
