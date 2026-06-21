import { type Request, type Response } from "express";
import {
  signInSchema,
  signUpSchema,
  type AuthResponse,
} from "../types/auth.js";
import { generateToken } from "../util/token.js";
import * as authService from "../services/authService.js";

export const signUp = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { email, firstName, lastName, password } = req.body;

    if (!email || !firstName || !lastName || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });

    const validate = signUpSchema.safeParse(req.body);
    if (!validate.success)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });

    try {
      const safeUser = await authService.signUp(
        validate.data.email,
        validate.data.firstName,
        validate.data.lastName,
        validate.data.password,
      );

      const token = generateToken(safeUser);

      const authResponse: AuthResponse = {
        token,
        user: safeUser,
      };

      console.log("User signed up successfully");

      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 4,
        secure: true,
        sameSite: "strict",
        httpOnly: true,
      });

      return res.status(201).json({ success: true, authResponse });
    } catch (error: any) {
      if (error.message === "Email already in use") {
        return res
          .status(409)
          .json({ success: false, message: error.message });
      }
      if (error.message === "Unable to create user") {
        return res
          .status(404)
          .json({ success: false, message: error.message });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in signUp (authController): ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const signIn = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });

    const validate = signInSchema.safeParse(req.body);
    if (!validate.success)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });

    try {
      const safeUser = await authService.signIn(
        validate.data.email,
        validate.data.password,
      );

      const token = generateToken(safeUser);

      const authResponse: AuthResponse = {
        token,
        user: safeUser,
      };

      console.log("User signed in successfully");

      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 4,
        secure: true,
        sameSite: "strict",
        httpOnly: true,
      });

      return res.status(200).json({ success: true, authResponse });
    } catch (error: any) {
      if (error.message === "User not found") {
        return res
          .status(404)
          .json({ success: false, message: error.message });
      }
      if (error.message === "Invalid credentials") {
        return res
          .status(401)
          .json({ success: false, message: error.message });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in signIn (authController): ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const signOut = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    authService.signOut();

    res.clearCookie("token", {
      secure: true,
      sameSite: "strict",
      httpOnly: true,
    });

    return res
      .status(200)
      .json({ success: true, message: "User signed out succesfully" });
  } catch (error) {
    console.error("Error in signOut (authController): ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const verify = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const safeUser = authService.verify(req.user);
    return res.status(200).json({ success: true, user: safeUser });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return res.status(401).json({ success: false, message: error.message });
    }
    console.error("Error in verify (authController): ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
