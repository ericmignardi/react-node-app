import { type User } from "../generated/prisma/client.js";
import { type SafeUser } from "../types/auth.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const signUp = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string,
): Promise<SafeUser> => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashedPassword,
    },
  });

  if (!user) {
    throw new Error("Unable to create user");
  }

  const { password: userPassword, ...safeUser } = user;
  return safeUser;
};

export const signIn = async (
  email: string,
  password: string,
): Promise<SafeUser> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const { password: userPassword, ...safeUser } = user;
  return safeUser;
};

export const signOut = (): void => {};

export const verify = (user?: User): SafeUser => {
  if (!user) {
    throw new Error("Unauthorized");
  }
  const { password, ...safeUser } = user;
  return safeUser;
};
