import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ success: false, message: "Token required" });
    return;
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };
    if (!decodedUser || typeof decodedUser.id !== "number") {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedUser.id,
      },
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
    return;
  }
};
