import { type Request, type Response } from "express";
import { type AuthResponse } from "../types/auth.js";

export const signUp = async (
  req: Request,
  res: Response,
): Promise<AuthResponse> => {};

export const signIn = async (
  req: Request,
  res: Response,
): Promise<AuthResponse> => {};

export const signOut = async (req: Request, res: Response): Promise<void> => {};

export const verify = async (
  req: Request,
  res: Response,
): Promise<AuthResponse> => {};
