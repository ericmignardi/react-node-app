import { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
  verify,
} from "../controllers/authController.js";
import { validate } from "../middleware/authMiddleware.js";

export const authRouter = Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.post("/sign-out", signOut);

authRouter.get("/verify", validate, verify);
