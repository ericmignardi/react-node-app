import jwt from "jsonwebtoken";
import { SafeUser } from "../types/auth.js";

export const generateToken = (user: SafeUser): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};
