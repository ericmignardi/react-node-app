import z from "zod";
import { type User } from "../generated/prisma/client.js";

const signUpSchema = z.object({
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

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required"),
});

export type SignIn = z.infer<typeof signInSchema>;

export type AuthResponse = {
  user: User;
  token: string;
};
