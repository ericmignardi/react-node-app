import { type User } from "../generated/prisma/client.js";

export const signUp = (
  email: string,
  firstName: string,
  lastName: string,
  password: string,
): User => {};

export const signIn = (email: string, password: string): User => {};

export const signOut = (): void => {};

export const verify = (): User => {};
